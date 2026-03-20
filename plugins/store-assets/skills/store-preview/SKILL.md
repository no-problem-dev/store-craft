---
title: "スクリーンショットプレビュー"
created: 2026-03-20
version: 1.0.0
tools: [Read, Bash]
tags: [skill, app-store, preview]
status: active
type: skill
user_invocable: true
trigger: ["/store-preview", "ストアプレビュー"]
---

# スクリーンショットプレビュー

## CONTEXT

### 適用範囲
store-craft エンジンの開発サーバーを起動し、ブラウザでスクリーンショットをプレビューする。

## ROLE

| 属性 | 内容 |
|------|------|
| **専門性** | store-craft エンジンの操作 |
| **権限** | 開発サーバーの起動・停止 |
| **責任** | プレビュー URL の提供 |

## INTENT

### Goal
生成前にブラウザでスクリーンショットの見た目を確認できるようにする。

## STEPS

### Step 1: エンジン起動
```bash
cd "${ENGINE_DIR}" && npm run dev
```

### Step 2: プレビュー URL を案内
```
http://localhost:3847/render?config={config_path}&id={screenshot_id}&device=iphone-6.9
```

各スクリーンショット ID ごとに URL を生成してユーザーに提示する。

## PROOF

### Done Criteria
- [ ] 開発サーバーが起動している
- [ ] プレビュー URL がユーザーに提示されている
