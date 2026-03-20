---
name: store-icon
description: App Store アイコンを SVG 設計から 1024x1024 PNG に変換して生成する。Apple HIG 準拠。「ストアアイコン」「/store-icon」などで自動適用。
---

# App Store アイコン生成

## CONTEXT

### 適用範囲
iOS/macOS アプリの App Store アイコン（1024×1024 PNG）をコードベースで生成する。
SVG 設計 → PNG 変換のパイプラインで、Apple HIG 準拠のアイコンを出力する。

### 前提条件
- rsvg-convert（`brew install librsvg`）またはその他の SVG→PNG 変換ツール

## ROLE

| 属性 | 内容 |
|------|------|
| **専門性** | Apple HIG アイコンガイドライン、SVG デザイン |
| **権限** | SVG ファイル生成、PNG 変換実行 |
| **責任** | 1024×1024 不透明 sRGB PNG の生成 |

## INTENT

### Goal
アプリのブランドアイデンティティを表現する App Store アイコンを SVG で設計し、Apple 仕様の PNG に変換する。

### Value
- **V-1**: コードベースで管理可能なアイコン（SVG → Git 管理）
- **V-2**: Apple HIG 完全準拠（不透明、角丸なし、sRGB）
- **V-3**: ダーク/ライトモード対応のバリアント生成

## STEPS

### Step 1: アプリブランド分析
- アプリ名、機能、デザインシステムから視覚的アイデンティティを把握
- 主要カラーパレットを抽出

### Step 2: SVG アイコン設計
- 1024×1024 の SVG を作成
- シンプルで記憶に残るモチーフ
- 背景は完全不透明（角丸は Apple が自動適用するため付けない）
- テキストは最小限（小サイズで判読不能になるため）

### Step 3: PNG 変換
```bash
rsvg-convert -w 1024 -h 1024 icon.svg > AppIcon.png
```

### Step 4: Xcode Asset Catalog への配置
生成した PNG を `Assets.xcassets/AppIcon.appiconset/` に配置する。

## PROOF

### Output
- `store-assets/icon.svg` — SVG ソース
- `store-assets/AppIcon.png` — 1024×1024 PNG

### Done Criteria
- [ ] 1024×1024 不透明 PNG が生成されている
- [ ] sRGB カラースペース
- [ ] 角丸なし（正方形）
