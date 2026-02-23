# データ構成（メーカー別運用）

`/docs` 公開ルートのデータは次の3層で管理します。

## 1. メーカーマスタ
- `makers.json`
  - `key`: メーカー識別子（ページ名・ファイル名で使用）
  - `name_ja`: 日本語表示名
  - `kana`: 50音順ソート用
  - `data_file`: メーカー別データJSONへのパス
  - `page_url`: メーカー別ページURL

## 2. メーカー別データ
- `makers/{maker_key}.json`
  - `models` 配列で型番単位に管理
  - 同型番は1レコードに集約し、`lofts` は昇順配列で保持
  - `source_url` は空欄可だが、項目自体は必須

モデルレコード例:

```json
{
  "model": "GT2 Hybrid",
  "type": "hybrid",
  "type_ja": "ユーティリティ",
  "lofts": [18, 21, 24],
  "release_date": "2024-08",
  "source_url": ""
}
```

## 3. 全体検索用インデックス
- `search_index.json`
  - 検索に必要な最小項目のみ保持
  - `maker_key`, `maker_name_ja`, `type_ja`, `model`, `lofts`, `release_date`, `source_url`

`index.html` はこの索引のみ読み込み、重い全件読込を避けます。
