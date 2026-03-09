<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-icon">🔐</div>
      <h1 class="auth-title">ログイン</h1>
      <p class="auth-sub">アカウントにサインインしてください</p>

      <form id="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">メールアドレス</label>
          <input
            id="input-email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="example@example.com"
            autocomplete="email"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">パスワード</label>
          <div class="password-wrap">
            <input
              id="input-password"
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              class="form-input"
              placeholder="パスワードを入力"
              autocomplete="current-password"
              required
            />
            <button type="button" class="pass-toggle" @click="showPass = !showPass">
              {{ showPass ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <p v-if="errorMsg" id="login-error" class="form-error" style="margin-bottom:12px">{{ errorMsg }}</p>

        <button id="btn-login" type="submit" class="btn btn-primary btn-lg btn-block" :disabled="loading">
          <span v-if="loading" class="spinner spinner-sm"></span>
          <span>{{ loading ? 'ログイン中...' : 'ログイン' }}</span>
        </button>
      </form>

      <div class="auth-hint">
        <h3>テスト用アカウント</h3>
        <div class="hint-accounts">
          <button
            v-for="user in testAccounts"
            :key="user.email"
            class="hint-account"
            @click="fillAccount(user)"
          >
            {{ user.name }}
          </button>
        </div>
      </div>

      <div class="auth-footer">
        アカウントをお持ちでない方は
        <RouterLink to="/register" class="auth-link">会員登録</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login, store } from '../store/index.js'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPass = ref(false)
const errorMsg = ref('')
const loading = ref(false)

const testAccounts = [
  { name: '田中 太郎', email: 'tanaka@example.com', password: 'GamePass#2024' },
  { name: '山田 花子', email: 'yamada@example.com', password: 'Switch2@Love' },
  { name: '佐藤 健', email: 'sato@example.com', password: 'SoulsLiker99' },
  { name: '鈴木 美咲', email: 'suzuki@example.com', password: 'Kawaii_Gamer!' },
  { name: '高橋 雄太', email: 'takahashi@example.com', password: 'Pro_Gamer2025' },
]

function fillAccount(user) {
  email.value = user.email
  password.value = user.password
}

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true

  await new Promise(r => setTimeout(r, 600))

  const ok = login(email.value, password.value)
  loading.value = false

  if (ok) {
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    errorMsg.value = 'メールアドレスまたはパスワードが正しくありません'
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px 36px;
}

.auth-icon {
  text-align: center;
  font-size: 48px;
  margin-bottom: 12px;
}

.auth-title {
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 4px;
}

.auth-sub {
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 28px;
}

.password-wrap {
  position: relative;
}

.pass-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.pass-toggle:hover {
  opacity: 1;
}

.auth-hint {
  margin-top: 24px;
  padding: 16px;
  background: rgba(108, 99, 255, 0.08);
  border: 1px solid rgba(108, 99, 255, 0.2);
  border-radius: var(--radius-sm);
}

.auth-hint h3 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.hint-accounts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.hint-account {
  padding: 4px 10px;
  background: rgba(108, 99, 255, 0.15);
  border: 1px solid rgba(108, 99, 255, 0.3);
  border-radius: var(--radius-xs);
  font-size: 12px;
  color: var(--accent);
  transition: var(--transition);
}

.hint-account:hover {
  background: var(--accent);
  color: #fff;
}

.hint-note {
  font-size: 12px;
  color: var(--text-muted);
}

.hint-note code {
  background: var(--bg-secondary);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: monospace;
  color: var(--accent);
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.auth-link {
  color: var(--accent);
  font-weight: 600;
}
.auth-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 28px 20px;
  }
}
</style>
