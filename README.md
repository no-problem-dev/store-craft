# store-craft

App Store アセット（スクリーンショット・アイコン）のコードベース自動生成プラットフォーム。

## 概要

Claude Code プラグインとして動作し、iOS/macOS アプリの App Store 用スクリーンショットとアイコンをコードで生成する。

```
/store-screenshot 実行
  → screenshot-designer がアプリ分析 & レイアウト設計
  → Next.js エンジンで TSX テンプレート生成
  → Playwright で PNG レンダリング (1320×2868)
  → (optional) fastlane deliver でアップロード
```

## スキル

| スキル | 用途 |
|--------|------|
| `/store-screenshot` | App Store スクリーンショット生成（分析→設計→レンダリング） |
| `/store-icon` | App Store アイコン生成（SVG→PNG） |
| `/store-preview` | ブラウザでスクリーンショットをプレビュー |

## エージェント

| エージェント | 役割 |
|-------------|------|
| `screenshot-designer` | アプリ分析、スクリーンショット構成設計、画面コンポーネント生成 |
| `aso-advisor` | ASO ベストプラクティスに基づくフィードバック |

## エンジン

Next.js + Playwright ベースのスクリーンショットレンダラー。

### 必要環境

- Node.js 20+
- Playwright (Chromium)

### セットアップ

```bash
cd plugins/store-assets/engine
npm install
npx playwright install chromium
```

### 使い方

1. 対象プロジェクトで `/store-screenshot` を実行
2. screenshot-designer がアプリを分析し `store-craft.config.json` を生成
3. 画面コンポーネント (TSX) が `store-assets/screens/` に生成される
4. エンジンが PNG をレンダリングし `store-assets/screenshots/` に出力

### プレビュー

```bash
cd plugins/store-assets/engine
npm run dev
# http://localhost:3847/render?config={config_path}&id={screenshot_id}
```

## アーキテクチャ

```
store-craft/
├── .claude-plugin/marketplace.json    # マーケットプレイスマニフェスト
└── plugins/store-assets/
    ├── .claude-plugin/plugin.json     # プラグインマニフェスト
    ├── skills/                        # ユーザー起動スキル
    │   ├── store-screenshot/
    │   ├── store-icon/
    │   └── store-preview/
    ├── agents/                        # 専門エージェント
    │   ├── screenshot-designer.md
    │   └── aso-advisor.md
    └── engine/                        # Next.js レンダリングエンジン
        ├── src/
        │   ├── app/                   # Next.js App Router
        │   ├── components/            # DeviceFrame, TextOverlay, ScreenshotLayout
        │   ├── devices/               # デバイス仕様定義
        │   ├── themes/                # テーマ定義
        │   └── render.ts             # PNG レンダリングスクリプト
        └── package.json
```

## 対応デバイス

| デバイス | 解像度 | 必須 |
|---------|--------|------|
| iPhone 6.9" (16 Pro Max) | 1320×2868 | ✅ |
| iPhone 6.7" (16 Plus) | 1290×2796 | |
| iPhone 6.5" (11 Pro Max) | 1284×2778 | |
| iPad 13" | 2064×2752 | iPad 対応時 |

## テーマ

| テーマ | 特徴 |
|--------|------|
| `ocean` | 深い青のグラデーション（デフォルト） |
| `midnight` | ダーク系、白文字 |
| `sunrise` | 暖色系グラデーション |
| `minimal` | 白背景、クリーン |

## ライセンス

MIT
