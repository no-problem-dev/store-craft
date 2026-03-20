---
title: "App Store スクリーンショット生成"
created: 2026-03-20
version: 2.0.0
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
iOS/macOS アプリの App Store 用スクリーンショットを自動生成する。
**実際のシミュレータスクリーンショット**をデバイスフレーム + テキストオーバーレイと合成して
App Store 仕様の PNG を出力する。

### 用語
- **生スクリーンショット (raw screenshot)**: シミュレータから直接キャプチャした PNG。`store-assets/raw/` に保存
- **合成スクリーンショット**: 生スクリーンショットをデバイスフレーム・テキスト・背景と合成した最終 PNG
- **store-craft エンジン**: Next.js + Playwright ベースのスクリーンショット合成レンダラー
- **store-craft.config.json**: スクリーンショット設定ファイル。各エントリの `screen` フィールドは生スクリーンショットの絶対パス

### 前提条件
- Node.js 20+ がインストール済み
- XcodeBuildMCP が利用可能（推奨）、または `xcrun simctl` が使えること
- 対象アプリが Xcode でビルド可能であること

## ROLE

| 属性 | 内容 |
|------|------|
| **専門性** | App Store スクリーンショットの ASO 最適化、シミュレータスクリーンショット撮影、合成レンダリング |
| **権限** | store-craft.config.json 生成、シミュレータ操作、PNG レンダリング実行 |
| **責任** | 実際のアプリ UI に基づく高品質 App Store スクリーンショットの生成 |

## INTENT

### Goal
対象アプリをシミュレータで起動し、実画面をキャプチャして、ASO 最適化されたスクリーンショットセットを生成する。

### Value
- **V-1**: 実際のアプリ UI を使った本物のスクリーンショット（モック不使用）
- **V-2**: ASO ベストプラクティスに基づくテキストオーバーレイとレイアウト
- **V-3**: 1 コマンドで再生成可能なパイプライン

### Success Criteria
- [ ] シミュレータから生スクリーンショットがキャプチャされている
- [ ] store-craft.config.json の各 `screen` フィールドが実 PNG パスを指している
- [ ] 合成 PNG が iPhone 6.9" (1320×2868) で正常出力されている

## STEPS

### Step 0: エンジン環境確認

```bash
ENGINE_DIR="$(find ~/.claude/plugins/cache/store-craft -type d -name engine | head -1)"
if [ ! -d "${ENGINE_DIR}/node_modules" ]; then
  cd "${ENGINE_DIR}" && npm install && npx playwright install chromium
fi
```

### Step 1: アプリ分析 & スクリーンショット構成設計

`screenshot-designer` エージェントを起動し、対象アプリを分析する。

```
Agent(subagent_type: "store-assets:screenshot-designer")
prompt: |
  対象アプリ: {app_path}
  分析してスクリーンショット構成案を出力してください。
  どの画面をキャプチャすべきか、画面への遷移方法を含めてください。
```

**エージェントの出力:**
- スクリーンショット構成案（6〜10枚）
- 各画面のキャプチャ方法（どう遷移してどの状態でキャプチャするか）
- テキストオーバーレイの内容

### Step 2: シミュレータで生スクリーンショット撮影

対象アプリをシミュレータでビルド・起動し、各画面をキャプチャする。

**キャプチャ方法（優先順位）:**

1. **XcodeBuildMCP（推奨）**: `xbm-run` でアプリ起動 → `xbm-ui-verify` で画面遷移・スクリーンショット
2. **xcrun simctl**: `xcrun simctl io booted screenshot {output.png}`
3. **XCUITest**: UI テストでスクリーンショット取得（fastlane snapshot 互換）

**保存先:** `{project}/store-assets/raw/`

```
store-assets/
├── raw/                    # 生スクリーンショット（シミュレータから直接キャプチャ）
│   ├── 01_hero.png
│   ├── 02_chat.png
│   ├── 03_skills.png
│   └── ...
├── screenshots/            # 合成スクリーンショット（最終出力）
└── store-craft.config.json
```

**撮影の注意点:**
- ステータスバーの時刻は 9:41 に設定（Apple の慣例）: `xcrun simctl status_bar booted override --time "9:41"`
- 通知バナー等の不要な UI 要素が表示されていないこと
- ダークモード/ライトモードを適切に選択
- モックデータでリアルな画面状態を構築

### Step 3: store-craft.config.json 生成

各エントリの `screen` フィールドに **生スクリーンショットの絶対パス** を設定する。

```json
{
  "app": { "name": "アプリ名", "tagline": "キャッチコピー" },
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
      "screen": "/absolute/path/to/store-assets/raw/01_hero.png"
    }
  ],
  "outputDir": "./store-assets/screenshots"
}
```

### Step 4: 合成 PNG レンダリング

エンジンの render スクリプトで生スクリーンショットをデバイスフレーム + テキスト + 背景と合成する。

```bash
cd "${ENGINE_DIR}"
npx tsx src/render.ts --config "${PROJECT_DIR}/store-craft.config.json"
```

### Step 5: 確認 & 調整

生成された合成 PNG を確認し、テキストやテーマを調整する。

## PROOF

### Output
- `store-assets/raw/*.png` — 生スクリーンショット（シミュレータキャプチャ）
- `store-assets/screenshots/*.png` — 合成スクリーンショット（最終出力、1320×2868）
- `store-craft.config.json` — スクリーンショット設定

### Verification
- [ ] raw/ の PNG がシミュレータの実画面である（HTML モックでない）
- [ ] screenshots/ の PNG が指定解像度で出力されている
- [ ] テキストオーバーレイが日本語で正しく表示されている

### Do / Don't
**Do:**
- ✅ 必ずシミュレータから実際のスクリーンショットを撮影する
- ✅ ステータスバーの時刻を 9:41 に設定する
- ✅ モックデータでリアルな画面状態を構築する
- ✅ XcodeBuildMCP を優先的に使用する

**Don't:**
- ❌ HTML/CSS でアプリ画面をモックアップしない（実スクショ必須）
- ❌ 生スクリーンショットを手動で加工しない（エンジンが合成する）
- ❌ 相対パスを config の screen フィールドに使わない（絶対パス必須）
