# kakeibo-app — Claude Code ガイド

## プロジェクト概要

レシート画像をアップロードして Claude API で内容を自動読み取りし、家計を管理する Web アプリ。

- **フロントエンド**: React（Vite）
- **バックエンド**: Node.js（Express）
- **AI**: Claude API（claude-haiku 最新バージョン）
- **グラフ**: Chart.js
- **データ永続化**: ローカルストレージ

## ディレクトリ構成

```
kakeibo-app/
├── client/          # React フロントエンド
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
├── server/          # Node.js バックエンド
│   ├── src/
│   └── package.json
├── .env             # APIキー（Git管理外）
├── .env.example     # 環境変数のサンプル
├── .gitignore
└── CLAUDE.md
```

## 環境変数

`.env` ファイルを **絶対に Git にコミットしない**。`.env.example` をコピーして使う。

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
```

## 開発コマンド

```bash
# 依存パッケージのインストール
npm install --prefix client && npm install --prefix server

# 開発サーバー起動（フロント＋バック同時）
npm run dev          # ルートの package.json で concurrently を使って両方起動

# フロントのみ
npm run dev --prefix client

# バックのみ
npm run dev --prefix server
```

## Git 運用ルール

### 基本方針

**コードを変更するたびに必ず GitHub にプッシュする。**
作業途中でも、動作確認が取れた段階で即座にコミット＆プッシュすること。

### コミット手順

```bash
# 1. 変更内容を確認
git status
git diff

# 2. ファイルをステージング（.env は絶対に含めない）
git add <変更ファイル>

# 3. コミット（日本語メッセージ可）
git commit -m "feat: レシート読み取り機能を追加"

# 4. プッシュ
git push origin main
```

### ブランチ戦略

| ブランチ | 用途 |
|---------|------|
| `main` | 常にデプロイ可能な安定版 |
| `feature/*` | 新機能の開発 |
| `fix/*` | バグ修正 |

### コミットメッセージのプレフィックス

| プレフィックス | 用途 |
|--------------|------|
| `feat:` | 新機能 |
| `fix:` | バグ修正 |
| `refactor:` | リファクタリング |
| `style:` | スタイル変更（機能変更なし） |
| `docs:` | ドキュメント更新 |
| `chore:` | ビルド・設定変更 |

### 禁止事項

- `.env` をコミットしない
- `node_modules/` をコミットしない
- `main` ブランチへの直接 force push をしない

## Claude API 利用方針

- API キーはバックエンド（Node.js）でのみ使用し、フロントエンドには一切露出させない
- 使用モデル: `claude-haiku-4-5-20251001`（最新の Haiku）
- レシート読み取りには `claude-api` スキルの知見を参照すること

## コーディング規約

- コメントは日本語で記載する
- コンポーネントは機能単位で分割する
- カスタムフックで状態管理ロジックを分離する
- エラーハンドリングは API 境界（バックエンドのエンドポイント）でのみ行う
