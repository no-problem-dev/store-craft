---
title: "App Store スクリーンショット生成"
created: 2026-03-20
version: 1.0.0
tools: [Read, Write, Edit, Bash, Grep, Glob, Agent, WebSearch]
tags: [skill, app-store, screenshot, aso, marketing]
status: active
type: skill
user_invocable: true
trigger: ["/store-screenshot", "ストアスクリーンショット"]
---

# App Store スクリーンショット生成

## CONTEXT

### 適用範囲
iOS/macOS アプリの App Store 用スクリーンショットをコードベースで自動生成する。
アプリの分析からレイアウト設計、PNG レンダリングまでを一気通貫で実行する。

### 用語
- **store-craft エンジン**: Next.js ベースのスクリーンショットレンダリングエンジン
- **スクリーンショット設定**: `store-craft.config.json` — アプリ情報、テーマ、各スクリーンショットの定義
- **画面コンポーネント**: アプリの各画面を HTML/CSS で再現した React コンポーネント
- **ASO**: App Store Optimization — ダウンロード率を最大化するための最適化

### 前提条件
- Node.js 20+ がインストール済み
- store-craft エンジンの依存関係がインストール済み（初回は自動実行）

## ROLE

| 属性 | 内容 |
|------|------|
| **専門性** | App Store スクリーンショットの ASO 最適化設計、React/HTML によるモックアップ生成 |
| **権限** | store-craft.config.json の生成、画面コンポーネントの生成、PNG レンダリング実行 |
| **責任** | App Store 仕様に準拠した高品質スクリーンショットの生成 |

## INTENT

### Goal
対象アプリを分析し、ダウンロード率を最大化する App Store スクリーンショットセットを自動生成する。

### Value
- **V-1**: アプリ分析に基づく ASO 最適化されたスクリーンショット構成の自動設計
- **V-2**: HTML/CSS コードで管理可能なスクリーンショット（diff で変更追跡可能）
- **V-3**: 1コマンドで全デバイスサイズの PNG を再生成

### Success Criteria
- [ ] store-craft.config.json が生成されている
- [ ] 各スクリーンショットの画面コンポーネント（TSX）が生成されている
- [ ] iPhone 6.9" (1320×2868) の PNG が正常に出力されている
- [ ] テキストが日本語で表示され、デバイスフレーム内に画面が収まっている

## STEPS

### Step 0: エンジン環境確認

store-craft エンジンの依存関係を確認し、未インストールなら実行する。

```bash
ENGINE_DIR="${STORE_CRAFT_PLUGIN}/engine"
if [ ! -d "${ENGINE_DIR}/node_modules" ]; then
  cd "${ENGINE_DIR}" && npm install && npx playwright install chromium
fi
```

`STORE_CRAFT_PLUGIN` は `~/.claude/plugins/marketplaces/store-craft/plugins/store-assets` を指す。
ソースリポジトリ（`~/life/NOPROBLEM/store-craft/plugins/store-assets`）も使用可能。

### Step 1: アプリ分析（screenshot-designer エージェント）

`screenshot-designer` エージェントを起動し、対象アプリを分析する。

**エージェントへの入力:**
- アプリのソースコードパス
- 主要な SwiftUI View ファイル
- デザインシステム（色、フォント）
- アプリの機能一覧

**エージェントの出力:**
- スクリーンショット構成案（6〜10枚の内容・順序・テキスト）
- 推奨テーマ
- 各画面の重要要素

```
Agent(subagent_type: "store-craft:screenshot-designer")
prompt: |
  対象アプリ: {app_path}
  アプリ名: {app_name}
  分析してスクリーンショット構成案を JSON で出力してください。
```

### Step 2: 設定ファイル生成

Step 1 の分析結果に基づき、`store-craft.config.json` を対象プロジェクトのルートに生成する。

```json
{
  "app": {
    "name": "アプリ名",
    "tagline": "キャッチコピー"
  },
  "devices": ["iphone-6.9"],
  "theme": "ocean",
  "locale": "ja",
  "screenshots": [
    {
      "id": "hero",
      "order": 1,
      "headline": "メインキャッチコピー",
      "subtext": "サブテキスト",
      "textPosition": "top",
      "screen": "hero"
    }
  ],
  "outputDir": "./store-assets/screenshots"
}
```

### Step 3: 画面コンポーネント生成

各スクリーンショットのアプリ画面を HTML/CSS で再現する React コンポーネントを生成する。

生成先: 対象プロジェクト内の `store-assets/screens/` ディレクトリ

```
store-assets/
├── screens/
│   ├── HeroScreen.tsx      # 1枚目: メインビジュアル
│   ├── ChatScreen.tsx      # 2枚目: チャット画面
│   ├── FeatureScreen.tsx   # 3枚目: 機能紹介
│   └── ...
├── screenshots/            # PNG 出力先
└── store-craft.config.json
```

**画面コンポーネントの要件:**
- アプリの実際の UI を忠実に再現（色、レイアウト、フォント）
- モックデータで動的な部分を埋める
- デバイス解像度に合わせたサイズ指定

### Step 4: PNG レンダリング

エンジンの render スクリプトを実行して PNG を生成する。

```bash
cd "${ENGINE_DIR}"
npx tsx src/render.ts --config "${PROJECT_DIR}/store-craft.config.json"
```

### Step 5: 確認 & 調整

生成された PNG を確認し、必要に応じてテキストや画面コンポーネントを調整する。
プレビューモードを使ってブラウザで確認することも可能。

```bash
cd "${ENGINE_DIR}"
npm run preview
# ブラウザで http://localhost:3847/render?config=...&id=hero を開く
```

## PROOF

### Output
- `store-craft.config.json` — スクリーンショット設定
- `store-assets/screens/*.tsx` — 画面コンポーネント
- `store-assets/screenshots/*.png` — 生成された PNG（1320×2868）

### Verification
- [ ] PNG ファイルが指定解像度で出力されている
- [ ] テキストが日本語で正しく表示されている
- [ ] デバイスフレーム内にアプリ画面が収まっている
- [ ] 背景グラデーションが正常にレンダリングされている

### Done Criteria
- [ ] 6枚以上のスクリーンショット PNG が生成されている
- [ ] store-craft.config.json がプロジェクトルートに存在する
- [ ] ユーザーがプレビューで確認し承認している

### Do / Don't
**Do:**
- ✅ アプリの実際の配色・デザインシステムを反映する
- ✅ 日本語テキストは太字・大きめサイズで 1 秒で読めるように
- ✅ 最初の 3 枚に最も強い訴求ポイントを配置
- ✅ デバイスフレームは最新 iPhone（Dynamic Island 付き）

**Don't:**
- ❌ 英語テキストと日本語を混在させない（ロケール統一）
- ❌ 1 枚に複数のメッセージを詰め込まない（1 枚 1 コンセプト）
- ❌ 小さすぎるテキストを使わない（App Store 上で判読不能になる）
- ❌ アプリと無関係な装飾を過度に追加しない
