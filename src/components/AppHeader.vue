<template>
  <header class="app-header">
    <div class="header-inner container">
      <!-- Logo -->
      <RouterLink to="/" class="logo">
        <span class="logo-icon">🎮</span>
        <span class="logo-text">GameShop</span>
      </RouterLink>

      <!-- Hamburger -->
      <button class="hamburger" @click="menuOpen = !menuOpen" :aria-label="menuOpen ? 'メニューを閉じる' : 'メニューを開く'">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Navigation -->
      <nav class="nav" :class="{ open: menuOpen }" @click.self="menuOpen = false">
        <RouterLink to="/" class="nav-link" @click="menuOpen = false">TOP</RouterLink>

        <RouterLink to="/cart" class="nav-link nav-link-icon" @click="menuOpen = false">
          <span>🛒</span>
          <span>ショッピングカート</span>
          <span v-if="cartItemCount > 0" class="nav-badge">{{ cartItemCount }}</span>
        </RouterLink>

        <RouterLink to="/favorites" class="nav-link nav-link-icon" @click="menuOpen = false">
          <span>❤️</span>
          <span>お気に入り</span>
          <span v-if="store.favorites.length > 0" class="nav-badge">{{ store.favorites.length }}</span>
        </RouterLink>

        <template v-if="store.currentUser">
          <RouterLink to="/my-page" class="nav-link" @click="menuOpen = false">マイページ</RouterLink>
          <RouterLink to="/purchase-history" class="nav-link" @click="menuOpen = false">購入履歴</RouterLink>
          <button class="nav-link nav-link-logout" @click="handleLogout">ログアウト</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="nav-link" @click="menuOpen = false">ログイン</RouterLink>
          <RouterLink to="/register" class="nav-link nav-link-register" @click="menuOpen = false">会員登録</RouterLink>
        </template>
      </nav>

      <!-- Overlay for mobile -->
      <div v-if="menuOpen" class="nav-overlay" @click="menuOpen = false"></div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store, logout, cartCount } from '../store/index.js'

const router = useRouter()
const menuOpen = ref(false)

const cartItemCount = computed(() => cartCount())

function handleLogout() {
  logout()
  menuOpen.value = false
  router.push('/')
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--header-height);
  background: rgba(15, 15, 19, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
}

.header-inner {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 12px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  text-decoration: none;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Nav */
.nav {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: var(--transition);
  white-space: nowrap;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary);
  background: var(--bg-card);
}

.nav-link-register {
  background: var(--accent);
  color: #fff !important;
  border-radius: var(--radius-sm);
}

.nav-link-register:hover {
  background: var(--accent-hover) !important;
}

.nav-link-logout {
  color: var(--danger) !important;
}

.nav-link-logout:hover {
  background: rgba(239, 68, 68, 0.1) !important;
}

.nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: var(--danger);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 9px;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: var(--transition);
}

/* Nav Overlay */
.nav-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.5);
}

/* Mobile */
@media (max-width: 900px) {
  .hamburger {
    display: flex;
  }

  .nav-overlay {
    display: block;
  }

  .nav {
    position: fixed;
    top: var(--header-height);
    right: -280px;
    width: 280px;
    height: calc(100vh - var(--header-height));
    background: var(--bg-secondary);
    border-left: 1px solid var(--border);
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 16px 12px;
    margin-left: 0;
    transition: right 0.3s ease;
    overflow-y: auto;
    z-index: 100;
  }

  .nav.open {
    right: 0;
  }

  .nav-link {
    padding: 12px 16px;
    font-size: 15px;
  }
}
</style>
