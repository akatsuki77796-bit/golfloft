# UT/Hybrid データ追加手順（`clubs.json`）

このファイルは、`/docs/data/clubs.json` を後から手入力で埋めるための手順書です。

## 1. 1件のデータ形式

```json
{
  "maker": "Titleist",
  "model": "GT2 Hybrid",
  "category": "hybrid",
  "loft_deg": 21,
  "year": 2025,
  "source_url": "https://www.titleist.com/golf-clubs/hybrids/gt2-hybrid",
  "notes": "公式スペックページで確認"
}
```

- `maker`: メーカー名（例: Titleist, PING, TaylorMade）
- `model`: モデル名
- `category`: 今回は `"hybrid"` 固定
- `loft_deg`: 数値（不明なら `null`）
- `year`: 年式（2016〜2026）
- `source_url`: 必須（公式または信頼できる参照URL）
- `notes`: 補足。不明の場合は「未確認」と明記

## 2. コピペで追加する手順

1. `clubs.json` から対象メーカー・年式の行を探す
2. `model` を実モデル名に更新
3. `source_url` を公式スペックURLへ更新
4. `loft_deg` を実測/公式値に更新（不明時は `null` のまま）
5. `notes` を「公式で確認済み」などに更新

## 3. ルール

- 捏造禁止（推測で `loft_deg` を入れない）
- `source_url` は必須
- 値が取れない場合は `loft_deg: null` とし、`notes` に「未確認」を残す
- 文字コードは UTF-8 のまま保存
