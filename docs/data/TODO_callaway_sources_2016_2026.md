# TODO: キャロウェイ ユーティリティ（2016-06〜2026）日本公式一次情報の未確認一覧

このファイルは `scripts/update_callaway.py` により自動生成されます。
取得不能・不足項目を年別に記録します（推測登録は行いません）。

## 取得起点
- https://www.callawaygolf.jp/golf/clubs/hybrids
- https://news.callawaygolf.jp/archive-clubs/

## 取得失敗ログ（HTTP/接続）
- `https://www.callawaygolf.jp/golf/clubs/hybrids`: HTTP 429
- `http://www.callawaygolf.jp/combo-set-2017-steelhead-xr-jv.html`: HTTP 429
- `http://www.callawaygolf.jp/combo-set-2017-steelhead-xr-womens-jv.html`: HTTP 429
- `http://www.callawaygolf.jp/hybrids-2017-xr-os-jv.html`: HTTP 429
- `http://www.callawaygolf.jp/hybrids-2017-xr-os-womens-jv.html`: HTTP 429
- `https://www.callawaygolf.jp/products/sale/クラブ/ユーティリティ/hybrids-2017-epic-star-jv.html`: UnicodeEncodeError
- `https://www.callawaygolf.jp/products/クラブ/ウェッジ/wedges-2017-sure-out-womens-customs-jv.html`: UnicodeEncodeError
- `https://www.callawaygolf.jp/products/クラブ/ユーティリティ/hybrids-2018-rogue-star-jv.html`: UnicodeEncodeError
- `https://www.callawaygolf.jp/products/クラブ/ユーティリティ/hybrids-2018-rogue-star-womens-jv.html`: UnicodeEncodeError
- `https://www.callawaygolf.jp/sale/クラブ/ウェッジ/wedges-2017-sure-out-jv.html`: UnicodeEncodeError

## 年別TODO

### 2016
- BIG BERTHA BETA Women's ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/womens-clubs/utilities/2016_big_bertha_beta_womens_ut.html
  - 不足項目: lofts
- BIG BERTHA BETA ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2016_big_bertha_beta_ut.html
  - 不足項目: lofts
- 起点ページ取得失敗 (hybrids_root) （理由: HTTP 429）
  - URL: https://www.callawaygolf.jp/golf/clubs/hybrids
  - 不足項目: source_url / release_date / lofts

### 2017
- モデルページ取得失敗 （理由: HTTP 429）
  - URL: http://www.callawaygolf.jp/combo-set-2017-steelhead-xr-jv.html
  - 不足項目: source_url / release_date / lofts
- モデルページ取得失敗 （理由: HTTP 429）
  - URL: http://www.callawaygolf.jp/combo-set-2017-steelhead-xr-womens-jv.html
  - 不足項目: source_url / release_date / lofts
- モデルページ取得失敗 （理由: HTTP 429）
  - URL: http://www.callawaygolf.jp/hybrids-2017-xr-os-jv.html
  - 不足項目: source_url / release_date / lofts
- モデルページ取得失敗 （理由: HTTP 429）
  - URL: http://www.callawaygolf.jp/hybrids-2017-xr-os-womens-jv.html
  - 不足項目: source_url / release_date / lofts
- モデルページ取得失敗 （理由: UnicodeEncodeError）
  - URL: https://www.callawaygolf.jp/products/sale/クラブ/ユーティリティ/hybrids-2017-epic-star-jv.html
  - 不足項目: source_url / release_date / lofts
- モデルページ取得失敗 （理由: UnicodeEncodeError）
  - URL: https://www.callawaygolf.jp/products/クラブ/ウェッジ/wedges-2017-sure-out-womens-customs-jv.html
  - 不足項目: source_url / release_date / lofts
- モデルページ取得失敗 （理由: UnicodeEncodeError）
  - URL: https://www.callawaygolf.jp/sale/クラブ/ウェッジ/wedges-2017-sure-out-jv.html
  - 不足項目: source_url / release_date / lofts
- 起点ページ取得失敗 (hybrids_root) （理由: HTTP 429）
  - URL: https://www.callawaygolf.jp/golf/clubs/hybrids
  - 不足項目: source_url / release_date / lofts

### 2018
- モデルページ取得失敗 （理由: UnicodeEncodeError）
  - URL: https://www.callawaygolf.jp/products/クラブ/ユーティリティ/hybrids-2018-rogue-star-jv.html
  - 不足項目: source_url / release_date / lofts
- モデルページ取得失敗 （理由: UnicodeEncodeError）
  - URL: https://www.callawaygolf.jp/products/クラブ/ユーティリティ/hybrids-2018-rogue-star-womens-jv.html
  - 不足項目: source_url / release_date / lofts
- 起点ページ取得失敗 (hybrids_root) （理由: HTTP 429）
  - URL: https://www.callawaygolf.jp/golf/clubs/hybrids
  - 不足項目: source_url / release_date / lofts

### 2019
- 起点ページ取得失敗 (hybrids_root) （理由: HTTP 429）
  - URL: https://www.callawaygolf.jp/golf/clubs/hybrids
  - 不足項目: source_url / release_date / lofts

### 2020
- 起点ページ取得失敗 (hybrids_root) （理由: HTTP 429）
  - URL: https://www.callawaygolf.jp/golf/clubs/hybrids
  - 不足項目: source_url / release_date / lofts

### 2021
- 起点ページ取得失敗 (hybrids_root) （理由: HTTP 429）
  - URL: https://www.callawaygolf.jp/golf/clubs/hybrids
  - 不足項目: source_url / release_date / lofts

### 2022
- 起点ページ取得失敗 (hybrids_root) （理由: HTTP 429）
  - URL: https://www.callawaygolf.jp/golf/clubs/hybrids
  - 不足項目: source_url / release_date / lofts

### 2023
- 起点ページ取得失敗 (hybrids_root) （理由: HTTP 429）
  - URL: https://www.callawaygolf.jp/golf/clubs/hybrids
  - 不足項目: source_url / release_date / lofts

### 2024
- 起点ページ取得失敗 (hybrids_root) （理由: HTTP 429）
  - URL: https://www.callawaygolf.jp/golf/clubs/hybrids
  - 不足項目: source_url / release_date / lofts

### 2025
- 起点ページ取得失敗 (hybrids_root) （理由: HTTP 429）
  - URL: https://www.callawaygolf.jp/golf/clubs/hybrids
  - 不足項目: source_url / release_date / lofts

### 2026
- APEX UTILITY アイアン 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2014_apex_ut.html
  - 不足項目: lofts
- APEX ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2015_apex_ut.html
  - 不足項目: lofts
- BIG BERTHA ALPHA 815 （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/left-clubs/utilities/2014_big_bertha_815_ut.html
  - 不足項目: lofts
- BIG BERTHA ALPHA 815 （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2014_big_bertha_815_ut.html
  - 不足項目: lofts
- BIG BERTHA BETA Women's ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/womens-clubs/utilities/2014_big_bertha_beta_womens_ut.html
  - 不足項目: lofts
- BIG BERTHA BETA ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2014_big_bertha_beta_ut.html
  - 不足項目: lofts
- CALLAWAY COLLECTION ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2015_collection_ut.html
  - 不足項目: lofts
- LEGACY BLACK ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2013_legacy_black_ut.html
  - 不足項目: lofts
- X Utility Prototype アイアン 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/irons/2013_x_utility_pro_ir.html
  - 不足項目: lofts
- X Utility Prototype アイアン 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2013_x_utility_pro_ir.html
  - 不足項目: lofts
- X2 HOT ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2014_x2_hot_ut.html
  - 不足項目: lofts
- X2 Hot Pro ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2014_x2_hot_pro_ut.html
  - 不足項目: lofts
- X2 Hot ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/left-clubs/utilities/2014_x2_hot_ut.html
  - 不足項目: lofts
- X2 Hot ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/womens-clubs/utilities/2014_x2_hot_womens_ut.html
  - 不足項目: lofts
- XR PRO ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2015_xr_pro_ut.html
  - 不足項目: lofts
- XR Women'sユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/womens-clubs/utilities/2015_xr_womens_ut.html
  - 不足項目: lofts
- XR ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/mens-clubs/utilities/2015_xr_ut.html
  - 不足項目: lofts
- filly ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/womens-clubs/utilities/2013_filly_ut.html
  - 不足項目: lofts
- filly ユーティリティ 過去モデル （理由: required_fields_missing）
  - URL: https://news.callawaygolf.jp/womens-clubs/utilities/2015_filly_ut.html
  - 不足項目: lofts
- 起点ページ取得失敗 (hybrids_root) （理由: HTTP 429）
  - URL: https://www.callawaygolf.jp/golf/clubs/hybrids
  - 不足項目: source_url / release_date / lofts
