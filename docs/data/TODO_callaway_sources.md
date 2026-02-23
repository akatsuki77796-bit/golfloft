# TODO: キャロウェイ ユーティリティ（2015年以降・日本発売）一次情報ソース確認

Codex実行環境から `https://www.callawaygolf.jp/` へのHTTPアクセスが 403 で遮断され、
日本公式一次情報URL（`source_url`）を確認できませんでした。
そのため `docs/data/makers/callaway.json` には推測データを登録していません。

## 確認コマンド（実行ログ）
- `curl -I -L --max-time 20 https://www.callawaygolf.jp/` → `403 Forbidden`

## 候補モデル（要公式確認）
以下は**候補**です。登録前に必ず日本公式ページで「発売日」「ロフト展開」を確認し、
各モデルごとに `source_url` を確定してください。

### 2024-
- PARADYM Ai SMOKE
- PARADYM Ai SMOKE HL
- PARADYM Ai SMOKE MAX FAST

### 2023
- PARADYM
- PARADYM X
- PARADYM MAX FAST

### 2022
- ROGUE ST MAX
- ROGUE ST MAX OS
- ROGUE ST MAX FAST

### 2021
- APEX UW（ユーティリティ枠扱いか要確認）

### 2020
- MAVRIK
- MAVRIK MAX

### 2019
- EPIC FLASH
- EPIC FLASH STAR

### 2018
- ROGUE STAR

### 2017
- GBB EPIC STAR

### 2016
- BIG BERTHA OS

### 2015
- XR
- XR PRO

## 日本公式でのURL探索手順
1. キャロウェイ日本公式の製品一覧で「ユーティリティ / ハイブリッド」カテゴリを選択。
2. 各モデルの製品ページで発売日（ニュースリリース含む）を確認。
3. 同一型番のロフト違いは1レコードに統合し、`lofts` を数値昇順で記録。
4. 派生（MAX / HL / X / FAST など）は別型番として別レコード登録。
5. `source_url` は必ず日本公式一次情報（製品ページ・公式ニュース）を設定。

## 手掛かりURL（要ログイン/アクセス許可環境で再確認）
- https://www.callawaygolf.jp/
- https://www.callawaygolf.jp/jp/%E3%82%AF%E3%83%A9%E3%83%96/
- https://www.callawaygolf.jp/jp/%E3%82%AF%E3%83%A9%E3%83%96/%E3%83%A6%E3%83%BC%E3%83%86%E3%82%A3%E3%83%AA%E3%83%86%E3%82%A3/
- https://www.callawaygolf.jp/jp/news/
