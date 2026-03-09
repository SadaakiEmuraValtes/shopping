<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-icon">✨</div>
      <h1 class="auth-title">会員登録</h1>
      <p class="auth-sub">新規アカウントを作成します</p>

      <form id="register-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label">お名前</label>
          <input
            id="input-name"
            v-model="name"
            type="text"
            class="form-input"
            placeholder="山田 太郎"
            autocomplete="name"
            required
          />
        </div>

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
              placeholder="8文字以上"
              autocomplete="new-password"
              required
              minlength="6"
            />
            <button type="button" class="pass-toggle" @click="showPass = !showPass">
              {{ showPass ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">パスワード（確認）</label>
          <input
            id="input-password-confirm"
            v-model="passwordConfirm"
            :type="showPass ? 'text' : 'password'"
            class="form-input"
            placeholder="パスワードを再入力"
            autocomplete="new-password"
            required
          />
        </div>

        <p v-if="errorMsg" id="register-error" class="form-error" style="margin-bottom:12px">{{ errorMsg }}</p>

        <button id="btn-register" type="submit" class="btn btn-primary btn-lg btn-block" :disabled="loading">
          <span v-if="loading" class="spinner spinner-sm"></span>
          <span>{{ loading ? '登録中...' : '会員登録する' }}</span>
        </button>
      </form>

      <div class="auth-footer">
        すでにアカウントをお持ちの方は
        <RouterLink to="/login" class="auth-link">ログイン</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../store/index.js'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPass = ref(false)
const errorMsg = ref('')
const loading = ref(false)

async function handleRegister() {
  errorMsg.value = ''

  if (password.value !== passwordConfirm.value) {
    errorMsg.value = 'パスワードが一致しません'
    return
  }
  if (password.value.length < 6) {
    errorMsg.value = 'パスワードは6文字以上で入力してください'
    return
  }

  loading.value = true
  await new Promise(r => setTimeout(r, 600))

  const ok = register(name.value.trim(), email.value, password.value)
  loading.value = false

  if (ok) {
    router.push('/')
  } else {
    errorMsg.value = 'このメールアドレスはすでに登録されています'
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
.pass-toggle:hover { opacity: 1; }

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
.auth-link:hover { text-decoration: underline; }

@media (max-width: 480px) {
  .auth-card {
    padding: 28px 20px;
  }
}
</style>
