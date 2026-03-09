# 🎮 ゲームショッピングサイト

Vue 3 製のゲーム EC サイトデモアプリです。ショッピングカート・会員管理・購入履歴などの基本的な EC 機能を備えています。

**デモ:** https://sadaakiemuravaltes.github.io/shopping/

---

## 機能一覧

| 機能 | 説明 |
|------|------|
| 商品一覧 | カテゴリ/プラットフォーム絞り込み（複数選択可）・在庫切れを除くフィルター・キーワード検索・並び替え |
| ジャンルフィルター | RPG・アクション等14ジャンルで絞り込み（複数選択可） |
| 好きなジャンルボタン | ログインユーザーの設定ジャンルをワンクリックで一括適用 |
| 商品詳細 | 画像・説明・レビュー表示・カート追加 |
| カート | 数量変更・削除・小計リアルタイム計算 |
| 会員登録 / ログイン | バリデーション付きフォーム・好きなジャンル複数選択 |
| チェックアウト | 住所入力・配送希望日（`yyyy/mm/dd` テキスト入力、翌日〜1ヶ月先）・配送希望時間帯選択・支払い方法選択 |
| 注文完了 | 注文番号発行（`GS-YYYYMMDD-HHmmss-XXXX` 形式） |
| 購入履歴 | 注文番号検索・アコーディオン展開・ページネーション |
| 商品評価 | 購入済み商品への星評価＋コメント投稿（モーダル） |
| マイページ | ユーザー情報確認・好きなジャンル設定・デフォルトカード表示・最近の注文 |
| お気に入り | 商品のブックマーク |
| お知らせバナー | 期間限定セール告知など |
| 広告サイドバー | ランダム表示（1件）、外部ゲームショップへ遷移 |

---

## 技術スタック

- **Vue 3** — Composition API (`<script setup>`)
- **Vue Router 4** — `createWebHashHistory` (GitHub Pages 対応)
- **Vite 5** — ビルドツール
- **JavaScript** — TypeScript なし

状態管理はライブラリ不使用（`reactive` ストア + sessionStorage 永続化）。

---

## セットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動 (http://localhost:5173/shopping/)
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

---

## デプロイ (GitHub Pages)

`dist/` の内容を `gh-pages` ブランチへプッシュしてデプロイします。

```bash
npm run build

# dist を gh-pages ブランチへ強制プッシュ
cd /tmp
rm -rf gh-pages-deploy
git clone --branch gh-pages https://github.com/SadaakiEmuraValtes/shopping.git gh-pages-deploy 2>/dev/null \
  || git clone https://github.com/SadaakiEmuraValtes/shopping.git gh-pages-deploy
cd gh-pages-deploy
git checkout --orphan gh-pages 2>/dev/null || true

cp -r <プロジェクトroot>/dist/. .
git add -A
git commit -m "Deploy"
git push origin gh-pages --force
```

`vite.config.js` の `base` は `/shopping/` に設定済みです。

---

## プロジェクト構成

```
src/
├── App.vue               # ルートコンポーネント（ヘッダー・フッター含む）
├── main.js               # エントリーポイント
├── router/
│   └── index.js          # ルーティング定義
├── store/
│   └── index.js          # グローバルストア（reactive + sessionStorage）
├── components/
│   ├── AppHeader.vue     # ナビゲーションヘッダー
│   └── ProductCard.vue   # 商品カードコンポーネント
├── views/
│   ├── HomeView.vue          # TOPページ（商品一覧・広告）
│   ├── ProductDetailView.vue # 商品詳細
│   ├── CartView.vue          # カート
│   ├── CheckoutView.vue      # チェックアウト
│   ├── OrderCompleteView.vue # 注文完了
│   ├── PurchaseHistoryView.vue # 購入履歴
│   ├── LoginView.vue         # ログイン
│   ├── RegisterView.vue      # 会員登録
│   ├── MyPageView.vue        # マイページ
│   ├── FavoritesView.vue     # お気に入り
│   ├── ReviewsView.vue       # レビュー一覧
│   └── HelpView.vue          # ヘルプ
└── data/
    ├── products.js       # 商品マスタデータ（54商品、genres フィールド含む）
    ├── users.js          # デモユーザーデータ（favoriteGenres フィールド含む）
    ├── genres.js         # ゲームジャンル定数（14ジャンル）
    └── reviews.js        # レビューデータ
```

---

## 注文番号フォーマット

注文完了時に以下の形式でユニークな注文番号が発行されます。

```
GS-20260309-153042-4829
 ^   ^        ^      ^
 |   日付      時刻   4桁乱数
 プレフィックス
```

購入履歴画面でこの番号（またはその一部）を入力して注文を検索できます。

---

## ライセンス

個人学習・デモ用途。
