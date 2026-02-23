# PING ユーティリティ 日本公式 source_url 未確認リスト

この環境から `https://clubping.jp/` へのアクセスが 403 で失敗したため、日本公式一次情報 URL を取得できませんでした。推測登録を避けるため、`docs/data/makers/ping.json` は実データ未登録にしています。

## 実施したが失敗した確認
- `curl -I https://clubping.jp/product/product2022_g430_hybrid.html` → CONNECT tunnel failed: 403

## モデルごとの確認タスク（2015年以降）
以下は**登録候補名**です。実登録前に、各モデルで「日本発売日」「ロフト展開」が同一ページで確認できる日本公式 URL を確定してください。

- G440 ハイブリッド
  - 探し方: `clubping.jp` の製品ページで「G440 ハイブリッド」を検索し、スペック表と発売情報のあるページを採用
  - 手掛かりURL: `https://clubping.jp/`（サイト内検索）
- G440 HL ハイブリッド
  - 探し方: G440 派生として HL 専用ページが分かれていないか確認
  - 手掛かりURL: `https://clubping.jp/`
- G430 ハイブリッド
  - 探し方: 2022年モデル製品ページ（URL 末尾 `product2022_g430_hybrid.html` 系）とニュースリリースを突合
  - 手掛かりURL: `https://clubping.jp/product/product2022_g430_hybrid.html`
- G430 HL ハイブリッド
  - 探し方: HL 派生の製品ページまたはニュースリリースで別型番扱いか確認
  - 手掛かりURL: `https://clubping.jp/`
- G425 ハイブリッド
  - 探し方: 2021年前後の製品アーカイブを `product` 配下で確認
  - 手掛かりURL: `https://clubping.jp/`
- G410 ハイブリッド
  - 探し方: 2019年前後の製品アーカイブを確認
  - 手掛かりURL: `https://clubping.jp/`
- G400 ハイブリッド
  - 探し方: 2017年前後の製品アーカイブを確認
  - 手掛かりURL: `https://clubping.jp/`
- G ハイブリッド
  - 探し方: 2016年前後の製品アーカイブを確認
  - 手掛かりURL: `https://clubping.jp/`
- G30 ハイブリッド（2015年発売判定が必要）
  - 探し方: 日本発売日が 2015年以降かを一次情報で確認できる場合のみ対象
  - 手掛かりURL: `https://clubping.jp/`

## 登録時のチェック
- 派生モデル（HL など）は別レコード
- 同一モデル内のロフト違いは `lofts` に昇順で集約
- `source_url` が日本公式一次情報でない場合は登録しない
