# TODO: キャロウェイ ユーティリティ（2015年以降・日本発売）一次情報の未確認モデル

`docs/data/makers/callaway.json` は **source_url / release_date / lofts を日本公式一次情報で確認できたモデルのみ** 掲載する方針に統一しました。
本ファイルは、一次情報URLが確定できず今回登録を見送ったモデルの管理リストです。

> 2016-06〜2026の年別未確認リストは `docs/data/TODO_callaway_sources_2016_2026.md` を参照。

## 今回 callaway.json から除外したモデル（未確認）

> いずれも以前は「参照元URL未登録」で混在していたため、verified-only方針に合わせて除外。

- ROGUE STAR  
  - 未確認理由: `source_url`（日本公式一次情報）未確定
  - 探索先: `https://www.callawaygolf.jp/golf/clubs/hybrids`、`https://news.callawaygolf.jp/archive-clubs/`
  - 検索キーワード例: `ROGUE STAR ユーティリティ site:news.callawaygolf.jp`
- ROGUE STAR Women's  
  - 未確認理由: `source_url`（日本公式一次情報）未確定
  - 探索先: 同上
  - 検索キーワード例: `ROGUE STAR Women's ユーティリティ site:news.callawaygolf.jp`
- EPIC STAR  
  - 未確認理由: `source_url`（日本公式一次情報）未確定
  - 探索先: 同上
  - 検索キーワード例: `EPIC STAR ユーティリティ site:news.callawaygolf.jp`
- XR OS  
  - 未確認理由: `source_url`（日本公式一次情報）未確定
  - 探索先: 同上
  - 検索キーワード例: `XR OS ユーティリティ site:news.callawaygolf.jp`
- XR OS Women's  
  - 未確認理由: `source_url`（日本公式一次情報）未確定
  - 探索先: 同上
  - 検索キーワード例: `XR OS Women's ユーティリティ site:news.callawaygolf.jp`

## 追加探索候補（2015年以降）

以下は日本公式で存在可能性がある候補。`source_url` / `release_date` / `lofts` が一次情報で確認できた場合のみ登録する。

- PARADYM Ai SMOKE / PARADYM Ai SMOKE HL / PARADYM Ai SMOKE MAX FAST
- PARADYM / PARADYM X / PARADYM MAX FAST
- ROGUE ST MAX / ROGUE ST MAX OS / ROGUE ST MAX FAST
- MAVRIK / MAVRIK MAX
- EPIC FLASH / EPIC FLASH STAR
- BIG BERTHA OS

## 一次情報の採用ルール（再掲）

- `source_url` は `callawaygolf.jp` または `news.callawaygolf.jp` の公式ページのみ
- `release_date` と `lofts` は同一公式ページ内で確認できる場合のみ登録
- 確認できないモデルは callaway.json へ入れない
