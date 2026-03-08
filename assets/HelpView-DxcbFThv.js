import{_ as o,h as p,W as r,o as s,b as l,d,n}from"./index-C_jVmAWs.js";const c={class:"help-wrapper"},f={__name:"HelpView",setup(x){const e=n(null);return p(()=>{const a=e.value.attachShadow({mode:"open"}),i=r.map(t=>`
    <tr>
      <td>${t.name}</td>
      <td>${t.email}</td>
      <td><code>${t.password}</code></td>
    </tr>
  `).join("");a.innerHTML=`
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :host { display: block; }

      .help-body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Noto Sans JP', sans-serif;
        color: #f0f0f8;
        line-height: 1.7;
        max-width: 820px;
        margin: 0 auto;
        padding: 40px 20px 80px;
      }

      h1 { font-size: 26px; font-weight: 800; margin-bottom: 6px; color: #a78bfa; }
      h2 {
        font-size: 17px; font-weight: 700; margin: 32px 0 12px; color: #f0f0f8;
        border-left: 4px solid #6c63ff; padding-left: 12px;
      }
      h3 { font-size: 14px; font-weight: 700; margin: 20px 0 6px; color: #c0c0d8; }
      p { margin-bottom: 10px; font-size: 14px; color: #9090a8; line-height: 1.8; }
      ul { padding-left: 20px; margin-bottom: 12px; }
      li { font-size: 14px; color: #9090a8; margin-bottom: 6px; }
      a { color: #6c63ff; }
      a:hover { color: #a78bfa; }
      code {
        background: #2a2a3e; padding: 2px 7px; border-radius: 4px;
        font-family: 'Consolas', 'Monaco', monospace; font-size: 12px; color: #a78bfa;
      }

      .page-sub { font-size: 13px; color: #606070; margin-bottom: 36px; }

      .alert {
        border-radius: 8px; padding: 14px 18px; margin-bottom: 28px;
        display: flex; align-items: flex-start; gap: 10px;
      }
      .alert-warning {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.4);
      }
      .alert-warning p { color: #f59e0b; margin: 0; font-weight: 600; font-size: 13px; }
      .alert-icon { font-size: 18px; line-height: 1.4; flex-shrink: 0; }

      .section {
        background: #1e1e2d; border: 1px solid #2a2a3e;
        border-radius: 12px; padding: 24px; margin-bottom: 20px;
      }
      .section > h2 { margin-top: 0; }

      .feature-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px;
      }
      .feature-item { background: #16161f; border-radius: 8px; padding: 12px 14px; }
      .feature-title { font-size: 13px; font-weight: 700; color: #f0f0f8; margin-bottom: 4px; }
      .feature-item p { font-size: 12px; color: #606070; margin: 0; }

      table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
      thead tr { background: #16161f; }
      th {
        text-align: left; padding: 9px 14px;
        color: #6c63ff; font-weight: 700; border-bottom: 1px solid #2a2a3e;
        font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;
      }
      td { padding: 8px 14px; border-bottom: 1px solid #1a1a28; color: #c0c0d8; }
      tr:hover td { background: #252538; }
      .note { font-size: 12px; color: #606070; margin-top: 10px; margin-bottom: 0; }

      .warning-list { list-style: none; padding: 0; margin: 0; }
      .warning-list li {
        padding: 6px 0 6px 20px; position: relative;
        color: #9090a8; font-size: 13px; border-bottom: 1px solid #1a1a28;
      }
      .warning-list li:last-child { border-bottom: none; }
      .warning-list li::before {
        content: '・'; position: absolute; left: 0; color: #6c63ff;
      }

      .disclaimer {
        margin-top: 20px; padding-top: 16px; border-top: 1px solid #2a2a3e;
        font-size: 12px; color: #606070; line-height: 1.9;
      }

      @media (max-width: 600px) {
        .feature-grid { grid-template-columns: 1fr; }
        table { font-size: 12px; }
        td, th { padding: 7px 10px; }
        h1 { font-size: 22px; }
      }
    </style>

    <div class="help-body">
      <h1>🎮 GameShop ヘルプ</h1>
      <p class="page-sub">テスト自動化練習用サイト — ご利用ガイド</p>

      <div class="alert alert-warning">
        <span class="alert-icon">⚠️</span>
        <p>このサイトはテスト自動化・Webテストの練習を目的として作成されたデモサイトです。実際の商品を販売するものではありません。</p>
      </div>

      <div class="section">
        <h2>このサイトについて</h2>
        <p>GameShop はゲームショッピングサイトを模したテスト自動化練習用のデモアプリケーションです。Playwright・Selenium・Robot Framework などの自動化ツールを使ったE2Eテストの練習にご活用ください。</p>
        <div class="feature-grid">
          <div class="feature-item"><div class="feature-title">🛒 ショッピングカート</div><p>商品の追加・数量変更・削除</p></div>
          <div class="feature-item"><div class="feature-title">🔐 ユーザー認証</div><p>ログイン・ログアウト・会員登録</p></div>
          <div class="feature-item"><div class="feature-title">❤️ お気に入り</div><p>商品のお気に入り登録・解除</p></div>
          <div class="feature-item"><div class="feature-title">💳 チェックアウト</div><p>住所入力・支払い方法選択・注文確定</p></div>
          <div class="feature-item"><div class="feature-title">📦 注文履歴</div><p>過去の注文確認・星評価投稿</p></div>
          <div class="feature-item"><div class="feature-title">🔍 商品検索</div><p>カテゴリフィルタ・ソート・キーワード検索</p></div>
        </div>
      </div>

      <div class="section">
        <h2>テストアカウント</h2>
        <p>以下のアカウントでログインしてテストを行えます。ログインページでアカウント名をクリックすると自動入力されます。</p>
        <table>
          <thead>
            <tr><th>名前</th><th>メールアドレス</th><th>パスワード</th></tr>
          </thead>
          <tbody>${i}</tbody>
        </table>
        <p class="note">※ 田中 太郎のクレジットカード利用可能額は ¥10,000 です。高額商品の購入エラーテストに活用できます。</p>
        <p class="note">※ 山田 花子・佐藤 健はデフォルトカード (¥50,000) が設定済みです。</p>
      </div>

      <div class="section">
        <h2>サイトの使い方</h2>
        <h3>1. 商品を探す</h3>
        <p>TOPページではカテゴリフィルタ・ソート・キーワード検索で商品を絞り込めます。在庫切れ商品もフィルタで表示できます。</p>
        <h3>2. カートに入れる / 購入する</h3>
        <p>商品詳細ページから数量を選んで「カートに入れる」または「今すぐ購入」を選択します。購入にはログインが必要です。</p>
        <h3>3. チェックアウト</h3>
        <p>配送先住所・支払い方法を入力して注文確定します。郵便番号（ハイフンなし7桁）を入力すると住所が自動補完されます。ログイン中ユーザーにデフォルトカードがある場合は自動入力されます。</p>
        <h3>4. 注文後の操作</h3>
        <p>注文完了後は購入履歴から注文を確認し、各商品へ星1〜5の評価を投稿できます。</p>
        <h3>5. マイページ</h3>
        <p>プロフィール・注文サマリ・デフォルトクレジットカード情報を確認できます。</p>
      </div>

      <div class="section">
        <h2>利用上の注意・免責事項</h2>
        <ul class="warning-list">
          <li>このサイトで表示される商品・ブランド名はすべて架空のものです。実際の購入・決済はできません。</li>
          <li>入力した個人情報（氏名・住所・カード番号等）はブラウザのセッションストレージのみに保存され、外部サーバーへは一切送信されません。</li>
          <li>本サイトはテスト・学習・デモンストレーション目的のみにご利用ください。商業目的での利用はお断りします。</li>
          <li>本サイトのご利用に際して生じたいかなる損害についても、管理者は一切の責任を負いかねます。</li>
          <li>本サイトは予告なく変更・停止する場合があります。</li>
          <li>掲載されている価格・在庫状況はテスト用の仮データであり、実際の市場価格とは関係ありません。</li>
        </ul>
        <p class="disclaimer">
          本サイトは <a href="https://hotel.testplanisphere.dev/" target="_blank">Hotel Planisphere</a> 等のテスト練習サイトにインスパイアされた、Webテスト自動化の学習・練習を目的としたデモアプリケーションです。<br>
          © 2025 GameShop Demo — For Test Automation Practice Only
        </p>
      </div>
    </div>
  `}),(a,i)=>(s(),l("div",c,[d("div",{ref_key:"shadowHost",ref:e,class:"shadow-host"},null,512)]))}},g=o(f,[["__scopeId","data-v-8debd783"]]);export{g as default};
