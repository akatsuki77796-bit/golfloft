#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import logging
import re
import sys
import time
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from html import unescape
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

REPO_ROOT = Path(__file__).resolve().parents[1]
CALLAWAY_JSON = REPO_ROOT / "docs/data/makers/callaway.json"
SEARCH_INDEX_JSON = REPO_ROOT / "docs/data/search_index.json"
MAKERS_JSON = REPO_ROOT / "docs/data/makers.json"
TODO_MD = REPO_ROOT / "docs/data/TODO_callaway_sources_2016_2026.md"

START_BOUND = "2016-06"
END_YEAR = min(2026, datetime.now().year)
REQUEST_DELAY_SEC = 0.7
REQUEST_TIMEOUT_SEC = 20
ALLOWED_HOSTS = {"www.callawaygolf.jp", "callawaygolf.jp", "news.callawaygolf.jp"}

A_HREF_RE = re.compile(r"<a[^>]+href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", re.IGNORECASE | re.DOTALL)
H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.IGNORECASE | re.DOTALL)
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.IGNORECASE | re.DOTALL)
TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")
HYBRID_WORD_RE = re.compile(r"\s*(?:Hybrid|ハイブリッド|ユーティリティ|Utility)\s*$", re.IGNORECASE)
RELEASE_RE = re.compile(r"(20\d{2})\s*[./年-]\s*(\d{1,2})\s*(?:月)?")
LOFT_RE = re.compile(r"(?<!\d)(\d{1,2}(?:\.\d)?)\s*[°º]")
YEAR_RE = re.compile(r"(20\d{2})")


@dataclass
class Candidate:
    url: str
    origin: str


@dataclass
class TodoItem:
    year: int
    model: str
    url: str
    missing: list[str] = field(default_factory=list)
    reason: str = ""


def strip_tags(text: str) -> str:
    return WS_RE.sub(" ", unescape(TAG_RE.sub(" ", text))).strip()


def extract_links(html: str, base_url: str) -> list[tuple[str, str]]:
    found: list[tuple[str, str]] = []
    for href, body in A_HREF_RE.findall(html):
        found.append((href.strip(), strip_tags(body)))
    return found


def extract_h1_or_title(html: str) -> str:
    h1 = H1_RE.search(html)
    if h1:
        return strip_tags(h1.group(1))
    title = TITLE_RE.search(html)
    if title:
        return strip_tags(title.group(1))
    return ""


class CallawayUpdater:
    def __init__(self, hybrids_url: str, archive_url: str, delay_sec: float = REQUEST_DELAY_SEC) -> None:
        self.hybrids_url = hybrids_url
        self.archive_url = archive_url
        self.delay_sec = delay_sec
        self.failures: list[tuple[str, str]] = []
        self.todo_items: list[TodoItem] = []

    def fetch(self, url: str) -> tuple[str | None, str | None]:
        try:
            logging.info("GET %s", url)
            req = Request(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0 (compatible; golfloft-bot/1.0)",
                    "Accept-Language": "ja,en-US;q=0.8",
                },
            )
            with urlopen(req, timeout=REQUEST_TIMEOUT_SEC) as response:
                html = response.read().decode("utf-8", errors="ignore")
            time.sleep(self.delay_sec)
            return html, None
        except HTTPError as error:
            msg = f"HTTP {error.code}"
        except URLError as error:
            msg = error.reason.__class__.__name__ if hasattr(error.reason, "__class__") else "URLError"
        except TimeoutError:
            msg = "Timeout"
        except Exception as error:  # noqa: BLE001
            msg = error.__class__.__name__

        logging.warning("Failed to fetch %s: %s", url, msg)
        self.failures.append((url, msg))
        return None, msg

    @staticmethod
    def normalize_url(base_url: str, href: str) -> str | None:
        if not href or href.startswith("#") or href.lower().startswith("javascript:"):
            return None
        url = urljoin(base_url, href)
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"}:
            return None
        if parsed.netloc.lower() not in ALLOWED_HOSTS:
            return None
        return f"{parsed.scheme}://{parsed.netloc}{parsed.path}"

    @staticmethod
    def is_candidate_url(url: str, text: str) -> bool:
        path = urlparse(url).path.lower()
        if "archive-clubs" in path:
            return False
        hay = f"{path} {text.lower()}"
        return any(key in hay for key in ["utility", "utilities", "hybrid", "ut", "ユーティリティ", "ハイブリッド"])

    @staticmethod
    def clean_model_name(name: str) -> str:
        value = WS_RE.sub(" ", name).strip()
        return HYBRID_WORD_RE.sub("", value).strip()

    @staticmethod
    def extract_release_date(text: str) -> str | None:
        for match in RELEASE_RE.finditer(text):
            year, month = int(match.group(1)), int(match.group(2))
            if 1 <= month <= 12:
                return f"{year:04d}-{month:02d}"
        return None

    @staticmethod
    def extract_lofts(text: str) -> list[float | int]:
        values = {float(m.group(1)) for m in LOFT_RE.finditer(text) if 10 <= float(m.group(1)) <= 45}
        lofts = sorted(values)
        return [int(v) if v.is_integer() else v for v in lofts]

    @staticmethod
    def extract_year(value: str) -> int | None:
        for match in YEAR_RE.finditer(value):
            year = int(match.group(1))
            if 2016 <= year <= END_YEAR:
                return year
        return None

    def discover_candidates(self) -> list[Candidate]:
        roots = [(self.hybrids_url, "hybrids_root"), (self.archive_url, "archive_root")]
        candidates: dict[str, Candidate] = {}
        year_pages: set[str] = set()

        for root_url, origin in roots:
            html, error = self.fetch(root_url)
            if not html:
                for year in range(2016, END_YEAR + 1):
                    self.todo_items.append(TodoItem(year, f"起点ページ取得失敗 ({origin})", root_url, ["source_url", "release_date", "lofts"], error or "fetch_failed"))
                continue
            for href, text in extract_links(html, root_url):
                url = self.normalize_url(root_url, href)
                if not url:
                    continue
                if origin == "archive_root" and "archive-clubs" in url and any(str(y) in (url + text) for y in range(2016, END_YEAR + 1)):
                    year_pages.add(url)
                if self.is_candidate_url(url, text):
                    candidates[url] = Candidate(url, origin)

        for year_url in sorted(year_pages):
            html, error = self.fetch(year_url)
            if not html:
                self.todo_items.append(TodoItem(self.extract_year(year_url) or END_YEAR, "年別アーカイブ取得失敗", year_url, ["source_url", "release_date", "lofts"], error or "fetch_failed"))
                continue
            for href, text in extract_links(html, year_url):
                url = self.normalize_url(year_url, href)
                if url and self.is_candidate_url(url, text):
                    candidates[url] = Candidate(url, "archive_year")

        return sorted(candidates.values(), key=lambda c: c.url)

    def parse_candidate(self, candidate: Candidate) -> dict | None:
        html, error = self.fetch(candidate.url)
        if not html:
            self.todo_items.append(TodoItem(self.extract_year(candidate.url) or END_YEAR, "モデルページ取得失敗", candidate.url, ["source_url", "release_date", "lofts"], error or "fetch_failed"))
            return None

        model = self.clean_model_name(extract_h1_or_title(html)) or "モデル名未取得"
        text = strip_tags(html)
        release_date = self.extract_release_date(text)
        lofts = self.extract_lofts(text)

        missing = []
        if not release_date:
            missing.append("release_date")
        if not lofts:
            missing.append("lofts")
        if missing:
            self.todo_items.append(TodoItem(self.extract_year(release_date or candidate.url or model) or END_YEAR, model, candidate.url, missing, "required_fields_missing"))
            return None

        if not (START_BOUND <= release_date <= f"{END_YEAR}-12"):
            return None

        return {
            "model": model,
            "type": "hybrid",
            "type_ja": "ユーティリティ",
            "lofts": sorted(lofts, key=float),
            "release_date": release_date,
            "source_url": candidate.url,
        }

    def build_todo_markdown(self) -> str:
        lines = [
            "# TODO: キャロウェイ ユーティリティ（2016-06〜2026）日本公式一次情報の未確認一覧",
            "",
            "このファイルは `scripts/update_callaway.py` により自動生成されます。",
            "取得不能・不足項目を年別に記録します（推測登録は行いません）。",
            "",
            "## 取得起点",
            f"- {self.hybrids_url}",
            f"- {self.archive_url}",
            "",
        ]
        if self.failures:
            lines.append("## 取得失敗ログ（HTTP/接続）")
            for url, reason in self.failures:
                lines.append(f"- `{url}`: {reason}")
            lines.append("")

        grouped: dict[int, list[TodoItem]] = defaultdict(list)
        for item in self.todo_items:
            grouped[item.year if 2016 <= item.year <= END_YEAR else END_YEAR].append(item)

        lines.append("## 年別TODO")
        for year in range(2016, END_YEAR + 1):
            lines.append("")
            lines.append(f"### {year}")
            items = grouped.get(year, [])
            if not items:
                lines.append("- 未確認項目なし")
                continue
            for item in sorted(items, key=lambda i: (i.model, i.url)):
                missing = " / ".join(item.missing)
                reason = f"（理由: {item.reason}）" if item.reason else ""
                lines.append(f"- {item.model} {reason}")
                lines.append(f"  - URL: {item.url}")
                lines.append(f"  - 不足項目: {missing}")

        return "\n".join(lines) + "\n"


def update_search_index() -> None:
    makers_cfg = json.loads(MAKERS_JSON.read_text(encoding="utf-8"))
    records: list[dict] = []
    for maker in makers_cfg.get("makers", []):
        maker_path = REPO_ROOT / "docs/data" / maker.get("data_file", "").replace("./", "")
        if not maker_path.exists():
            continue
        data = json.loads(maker_path.read_text(encoding="utf-8"))
        for model in data.get("models", []):
            records.append(
                {
                    "maker_key": maker.get("key", ""),
                    "maker_name_ja": maker.get("name_ja", ""),
                    "type_ja": model.get("type_ja", ""),
                    "model": model.get("model", ""),
                    "lofts": model.get("lofts", []),
                    "release_date": model.get("release_date", ""),
                    "source_url": model.get("source_url", ""),
                }
            )
    SEARCH_INDEX_JSON.write_text(json.dumps({"records": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--hybrids-url", default="https://www.callawaygolf.jp/golf/clubs/hybrids")
    parser.add_argument("--archive-url", default="https://news.callawaygolf.jp/archive-clubs/")
    parser.add_argument("--delay", type=float, default=REQUEST_DELAY_SEC)
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
    updater = CallawayUpdater(args.hybrids_url, args.archive_url, args.delay)

    candidates = updater.discover_candidates()
    logging.info("Discovered %d candidate URLs", len(candidates))
    verified: dict[tuple[str, str], dict] = {}
    for cand in candidates:
        record = updater.parse_candidate(cand)
        if record:
            verified[(record["model"], record["release_date"])] = record

    models = sorted(verified.values(), key=lambda r: (r["release_date"], r["model"]), reverse=True)
    CALLAWAY_JSON.write_text(
        json.dumps({"maker_key": "callaway", "maker_name_ja": "キャロウェイ", "models": models}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    TODO_MD.write_text(updater.build_todo_markdown(), encoding="utf-8")
    update_search_index()

    logging.info("Verified models written: %d", len(models))
    logging.info("TODO items recorded: %d", len(updater.todo_items))
    return 0


if __name__ == "__main__":
    sys.exit(main())
