---
title: "メタデータ最適化生成"
created: 2026-03-20
version: 1.0.0
tools: [Read, Write, Edit, Bash, Grep, Glob, Agent, WebSearch, WebFetch]
tags: [skill, app-store, aso, metadata, copywriting]
status: active
type: skill
user_invocable: true
trigger: ["/store-metadata", "ストアメタデータ", "ASO メタデータ"]
---

# メタデータ最適化生成

## CONTEXT

### 適用範囲
App Store のメタデータ（タイトル、サブタイトル、キーワード、説明文、プロモーションテキスト、リリースノート）を
ASO 最適化した状態で生成し、fastlane/metadata/{locale}/ に直接書き出す。

### 用語
- **メタデータ**: App Store Connect で設定するテキスト情報の総称
- **fastlane/metadata/**: fastlane が管理する App Store メタデータのディレクトリ構造
- **4 文字体系**: 日本語の「ひらがな・カタカナ・漢字・ローマ字」の 4 種類の表記体系
- **キーワードフィールド**: App Store Connect の 100 文字キーワード欄（カンマ区切り）
- **最初の 3 行**: 説明文の「続きを読む」タップ前に表示される領域

### 前提条件
- store-craft.config.json が存在すること
- fastlane/metadata/{locale}/ ディレクトリが存在すること（なければ作成する）
- アプリの基本情報（名前、機能、ターゲット）が把握できること

## ROLE

| 属性 | 内容 |
|------|------|
| **専門性** | App Store メタデータ最適化、日本語 ASO コピーライティング、キーワードリサーチ |
| **権限** | fastlane/metadata/{locale}/ 配下のメタデータファイル生成・更新 |
| **責任** | ASO 最適化されたメタデータの生成とキーワード戦略の策定 |
| **禁止事項** | store-craft.config.json の変更、スクリーンショットの変更 |

## INTENT

### Goal
ターゲットペルソナと競合分析に基づき、ダウンロード率を最大化する App Store メタデータを生成する。

### Value
- **V-1**: 日本語 ASO に特化した 4 文字体系バリエーション考慮のキーワード戦略
- **V-2**: fastlane/metadata/ に直接書き出し、`fastlane deliver` ですぐ反映可能
- **V-3**: タイトル/サブタイトル/キーワードの重複排除による 100 文字枠の最大活用

### Success Criteria
- [ ] 全メタデータファイル（6 種）が fastlane/metadata/{locale}/ に生成されている
- [ ] タイトルが 30 文字以内
- [ ] サブタイトルが 30 文字以内
- [ ] キーワードが 100 文字以内で、タイトル/サブタイトルと重複なし
- [ ] 説明文の最初 3 行が強力な訴求を含む

## STEPS

### Step 1: アプリ情報読み込み

```
1. store-craft.config.json を Read で読み込む
2. アプリ名、キャッチコピー、スクリーンショット構成を把握
3. locale を確認（デフォルト: ja）
4. fastlane/metadata/{locale}/ の存在確認、なければ mkdir -p で作成
```

### Step 2: 既存メタデータ確認

```
1. fastlane/metadata/{locale}/ 配下の全ファイルを Glob で検索
2. 存在するファイルを Read で読み込み、現状を把握
3. 現状のキーワード使用状況、文字数を確認
```

### Step 3: 競合分析（オプション）

ユーザーが競合アプリ名を指定した場合、WebSearch で競合のメタデータを調査する。

```
1. 競合アプリ名で App Store 検索結果を WebFetch
2. 競合のタイトル、サブタイトル、キーワード傾向を分析
3. 差別化すべきポイントと狙うべきキーワードギャップを特定
```

### Step 4: metadata-writer エージェント起動

メタデータ生成を `metadata-writer` エージェントに委譲する。

```
Agent(subagent_type: "store-assets:metadata-writer")
prompt: |
  以下のアプリ情報に基づき、ASO 最適化されたメタデータを生成してください。

  ## アプリ情報
  {store-craft.config.json の内容}

  ## 既存メタデータ（あれば）
  {現在の各ファイル内容}

  ## ターゲットペルソナ
  {ユーザー指定のペルソナ情報}

  ## 競合分析結果（あれば）
  {競合のメタデータ分析}

  ## 出力形式
  各メタデータファイルの内容をそれぞれ出力してください。
```

### Step 5: メタデータファイル書き出し

metadata-writer の出力を fastlane/metadata/{locale}/ に書き出す。

```
生成対象ファイル:
- fastlane/metadata/{locale}/name.txt
- fastlane/metadata/{locale}/subtitle.txt
- fastlane/metadata/{locale}/keywords.txt
- fastlane/metadata/{locale}/description.txt
- fastlane/metadata/{locale}/promotional_text.txt
- fastlane/metadata/{locale}/release_notes.txt
```

**書き出し前の検証:**

| ファイル | 検証項目 |
|---------|---------|
| name.txt | 30 文字以内 |
| subtitle.txt | 30 文字以内 |
| keywords.txt | 100 文字以内、カンマ区切り、name/subtitle と重複なし |
| description.txt | 4000 文字以内、最初 3 行の訴求力確認 |
| promotional_text.txt | 170 文字以内 |
| release_notes.txt | 4000 文字以内 |

### Step 6: 自動評価（オプション）

生成後に `/store-evaluate` を実行して品質を確認する。

```
ユーザーに確認:
「メタデータを生成しました。/store-evaluate で品質評価を実行しますか？」
```

## PROOF

### Output
- `fastlane/metadata/{locale}/name.txt` -- タイトル（30 文字以内）
- `fastlane/metadata/{locale}/subtitle.txt` -- サブタイトル（30 文字以内）
- `fastlane/metadata/{locale}/keywords.txt` -- キーワード（100 文字以内）
- `fastlane/metadata/{locale}/description.txt` -- 説明文（4000 文字以内）
- `fastlane/metadata/{locale}/promotional_text.txt` -- プロモーションテキスト（170 文字以内）
- `fastlane/metadata/{locale}/release_notes.txt` -- リリースノート（4000 文字以内）

### Verification
- [ ] 全ファイルが文字数制限内
- [ ] キーワードがタイトル/サブタイトルと重複していない
- [ ] 日本語の自然さが保たれている
- [ ] 説明文の最初 3 行が訴求力を持つ
- [ ] fastlane deliver で利用可能なディレクトリ構造

### Done Criteria
- [ ] 6 ファイルすべてが fastlane/metadata/{locale}/ に書き出されている
- [ ] 文字数制限違反がゼロ
- [ ] キーワード重複がゼロ
- [ ] metadata-writer エージェントの出力が検証済み

### Do / Don't

**Do:**
- ✅ 4 文字体系（ひらがな/カタカナ/漢字/ローマ字）のバリエーションを考慮する
- ✅ キーワードフィールドはタイトル/サブタイトルと重複させない（Apple が自動的に含めるため）
- ✅ 説明文の最初 3 行に全力を注ぐ（「続きを読む」前の領域）
- ✅ 競合分析結果をキーワード戦略に反映する
- ✅ 書き出し前に文字数を正確にカウントする

**Don't:**
- ❌ store-craft.config.json を変更しない
- ❌ スクリーンショットや画像ファイルを変更しない
- ❌ 文字数制限を超過したまま書き出さない
- ❌ 同じキーワードをタイトル・サブタイトル・キーワードフィールドに重複させない
- ❌ 「AIチャット」と「AI チャット」を同一視しない（App Store は別キーワードとして扱う）
