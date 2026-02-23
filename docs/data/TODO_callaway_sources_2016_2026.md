# TODO: キャロウェイ ユーティリティ（2016-06〜2026）日本公式一次情報の未確認一覧

目的: `docs/data/makers/callaway.json` へ追加入力する前提として、
`source_url`（日本公式URL）/ `release_date`（YYYY-MM）/ `lofts`（数値配列）を
**日本公式一次情報で確認できていないモデル**を年別に整理する。

## 今回の調査結果（環境制約）

- 収集起点として指定された以下2URLに対し、実行環境からの HTTP アクセスが `403 Forbidden` となり、
  ページ本文の取得ができなかった。
  - `https://www.callawaygolf.jp/golf/clubs/hybrids`
  - `https://news.callawaygolf.jp/archive-clubs/`
- そのため、今回の更新では `callaway.json` に推測登録を行わず、既存の verified レコードのみ維持した。

## 年別未確認モデル（候補）

> 注意: 下記は「存在可能性がある候補」の整理であり、`callaway.json` への登録確定ではない。
> すべて `source_url` / `release_date` / `lofts` の一次情報確認が必要。

### 2016
- BIG BERTHA OS
  - 当たりURL: `archive-clubs` の2016年クラブ一覧、`site:news.callawaygolf.jp BIG BERTHA OS ユーティリティ`
  - 不足項目: source_url / release_date / lofts
- XR OS
  - 当たりURL: `archive-clubs` の2016年クラブ一覧、`site:news.callawaygolf.jp XR OS ユーティリティ`
  - 不足項目: source_url / release_date / lofts
- XR OS Women's
  - 当たりURL: `archive-clubs` の2016年クラブ一覧、`site:news.callawaygolf.jp XR OS Women's ユーティリティ`
  - 不足項目: source_url / release_date / lofts

### 2017
- GBB EPIC STAR
  - 当たりURL: `archive-clubs` の2017年クラブ一覧、`site:news.callawaygolf.jp EPIC STAR ユーティリティ`
  - 不足項目: source_url / release_date / lofts

### 2018
- ROGUE STAR
  - 当たりURL: `archive-clubs` の2018年クラブ一覧、`site:news.callawaygolf.jp ROGUE STAR ユーティリティ`
  - 不足項目: source_url / release_date / lofts
- ROGUE STAR Women's
  - 当たりURL: `archive-clubs` の2018年クラブ一覧、`site:news.callawaygolf.jp ROGUE STAR Women's ユーティリティ`
  - 不足項目: source_url / release_date / lofts

### 2019
- EPIC FLASH STAR
  - 当たりURL: `archive-clubs` の2019年クラブ一覧、`site:news.callawaygolf.jp EPIC FLASH STAR ユーティリティ`
  - 不足項目: source_url / release_date / lofts

### 2020
- MAVRIK
  - 当たりURL: `archive-clubs` の2020年クラブ一覧、`site:news.callawaygolf.jp MAVRIK ユーティリティ`
  - 不足項目: source_url / release_date / lofts
- MAVRIK MAX
  - 当たりURL: `archive-clubs` の2020年クラブ一覧、`site:news.callawaygolf.jp MAVRIK MAX ユーティリティ`
  - 不足項目: source_url / release_date / lofts

### 2021
- APEX（該当年モデルの有無確認）
  - 当たりURL: `archive-clubs` の2021年クラブ一覧、`site:news.callawaygolf.jp 2021 APEX ユーティリティ`
  - 不足項目: source_url / release_date / lofts

### 2022
- ROGUE ST MAX
  - 当たりURL: `archive-clubs` の2022年クラブ一覧、`site:news.callawaygolf.jp ROGUE ST MAX ユーティリティ`
  - 不足項目: source_url / release_date / lofts
- ROGUE ST MAX OS
  - 当たりURL: `archive-clubs` の2022年クラブ一覧、`site:news.callawaygolf.jp ROGUE ST MAX OS ユーティリティ`
  - 不足項目: source_url / release_date / lofts
- ROGUE ST MAX FAST
  - 当たりURL: `archive-clubs` の2022年クラブ一覧、`site:news.callawaygolf.jp ROGUE ST MAX FAST ユーティリティ`
  - 不足項目: source_url / release_date / lofts

### 2023
- PARADYM
  - 当たりURL: `archive-clubs` の2023年クラブ一覧、`site:news.callawaygolf.jp PARADYM ユーティリティ`
  - 不足項目: source_url / release_date / lofts
- PARADYM X
  - 当たりURL: `archive-clubs` の2023年クラブ一覧、`site:news.callawaygolf.jp PARADYM X ユーティリティ`
  - 不足項目: source_url / release_date / lofts
- PARADYM MAX FAST
  - 当たりURL: `archive-clubs` の2023年クラブ一覧、`site:news.callawaygolf.jp PARADYM MAX FAST ユーティリティ`
  - 不足項目: source_url / release_date / lofts

### 2024
- PARADYM Ai SMOKE
  - 当たりURL: `hybrids` 一覧の現行モデル導線、`archive-clubs` の2024年クラブ一覧
  - 不足項目: source_url / release_date / lofts
- PARADYM Ai SMOKE HL
  - 当たりURL: `hybrids` 一覧の現行モデル導線、`archive-clubs` の2024年クラブ一覧
  - 不足項目: source_url / release_date / lofts
- PARADYM Ai SMOKE MAX FAST
  - 当たりURL: `hybrids` 一覧の現行モデル導線、`archive-clubs` の2024年クラブ一覧
  - 不足項目: source_url / release_date / lofts

### 2025
- ELYTE（ユーティリティ系）
  - 当たりURL: `hybrids` 一覧の現行モデル導線、`archive-clubs` の2025年クラブ一覧
  - 不足項目: source_url / release_date / lofts
- ELYTE X（ユーティリティ系）
  - 当たりURL: `hybrids` 一覧の現行モデル導線、`archive-clubs` の2025年クラブ一覧
  - 不足項目: source_url / release_date / lofts

### 2026
- 公式掲載モデル未確認（要 `hybrids` / `archive-clubs` の2026年確認）
  - 当たりURL: `https://www.callawaygolf.jp/golf/clubs/hybrids`, `https://news.callawaygolf.jp/archive-clubs/`
  - 不足項目: source_url / release_date / lofts

## 登録時チェックリスト

- `type` は `hybrid`、`type_ja` は `ユーティリティ`
- `model` には `Hybrid/ハイブリッド/ユーティリティ` 等の種別語を入れない
- `release_date` は `YYYY-MM`
- `lofts` は数値配列、昇順
- `source_url` は `callawaygolf.jp` または `news.callawaygolf.jp` の日本公式ページのみ
- 上記3項目（source_url / release_date / lofts）が揃わない場合は `callaway.json` に登録しない
