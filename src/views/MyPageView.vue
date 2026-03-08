<template>
  <div class="container my-page">
    <h1 class="page-title">マイページ</h1>

    <div class="my-layout">
      <!-- Profile card -->
      <div class="profile-card">
        <div class="profile-avatar">{{ avatarChar }}</div>
        <div class="profile-name">{{ store.currentUser.name }}</div>
        <div class="profile-email">{{ store.currentUser.email }}</div>
        <div class="profile-since">
          会員登録: {{ joinedDate }}
        </div>
      </div>

      <!-- Quick stats -->
      <div class="stats-grid">
        <RouterLink to="/cart" class="stat-card">
          <div class="stat-icon">🛒</div>
          <div class="stat-num">{{ cartCount() }}</div>
          <div class="stat-label">カート内商品</div>
        </RouterLink>
        <RouterLink to="/favorites" class="stat-card">
          <div class="stat-icon">❤️</div>
          <div class="stat-num">{{ store.favorites.length }}</div>
          <div class="stat-label">お気に入り</div>
        </RouterLink>
        <RouterLink to="/purchase-history" class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-num">{{ store.orders.length }}</div>
          <div class="stat-label">注文履歴</div>
        </RouterLink>
      </div>

      <!-- Recent orders -->
      <div class="recent-orders" v-if="store.orders.length > 0">
        <h2 class="section-title">最近の注文</h2>
        <div class="order-list">
          <div class="order-row" v-for="order in recentOrders" :key="order.id">
            <div class="order-row-date">{{ formatDate(order.createdAt) }}</div>
            <div class="order-row-items">
              <span v-for="item in order.items.slice(0, 3)" :key="item.productId" class="order-emoji">{{ item.emoji }}</span>
              <span v-if="order.items.length > 3" class="order-more">+{{ order.items.length - 3 }}</span>
            </div>
            <div class="order-row-total">{{ formatPrice(order.total) }}</div>
          </div>
        </div>
        <RouterLink to="/purchase-history" class="btn btn-secondary btn-sm" style="margin-top:12px">
          すべての注文を見る →
        </RouterLink>
      </div>

      <!-- Account actions -->
      <div class="account-actions">
        <h2 class="section-title">アカウント</h2>
        <button class="action-item" @click="handleLogout">
          <span>🚪</span>
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store, logout, cartCount, formatPrice } from '../store/index.js'

const router = useRouter()

const avatarChar = computed(() => store.currentUser?.name?.[0] || '?')

const joinedDate = computed(() => {
  const user = store.users.find(u => u.id === store.currentUser?.id)
  return user?.createdAt || '—'
})

const recentOrders = computed(() => {
  return [...store.orders].reverse().slice(0, 5)
})

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

function handleLogout() {
  logout()
  router.push('/')
}
</script>

<style scoped>
.my-page {
  padding-bottom: 80px;
}

.my-layout {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 800px;
}

/* Profile */
.profile-card {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.profile-name {
  font-size: 22px;
  font-weight: 700;
}

.profile-email {
  font-size: 14px;
  color: var(--text-secondary);
}

.profile-since {
  font-size: 13px;
  color: var(--text-muted);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 20px;
  text-align: center;
  transition: var(--transition);
  display: block;
  text-decoration: none;
}

.stat-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.stat-num {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-muted);
}

/* Recent orders */
.recent-orders {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: var(--radius-xs);
  font-size: 13px;
}

.order-row-date {
  color: var(--text-muted);
  min-width: 100px;
}

.order-row-items {
  flex: 1;
  display: flex;
  gap: 4px;
  align-items: center;
}

.order-emoji {
  font-size: 20px;
}

.order-more {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-card);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
}

.order-row-total {
  font-weight: 700;
  color: var(--accent);
}

/* Actions */
.account-actions {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 20px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-xs);
  font-size: 14px;
  color: var(--danger);
  transition: var(--transition);
  background: none;
  border: 1px solid var(--border);
}

.action-item:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: var(--danger);
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .stat-card {
    padding: 14px 8px;
  }
  .stat-num {
    font-size: 22px;
  }
}
</style>
