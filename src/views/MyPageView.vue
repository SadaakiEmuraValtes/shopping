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

      <!-- Default card -->
      <div v-if="defaultCard" id="default-card-section" class="card-section">
        <h2 class="section-title">デフォルトクレジットカード</h2>
        <div id="default-card" class="credit-card">
          <div id="card-number" class="card-number">{{ defaultCard.number }}</div>
          <div class="card-row">
            <div>
              <div class="card-label">名義人</div>
              <div id="card-name" class="card-value">{{ defaultCard.cardName }}</div>
            </div>
            <div>
              <div class="card-label">有効期限</div>
              <div id="card-expiry" class="card-value">{{ defaultCard.expiry }}</div>
            </div>
            <div>
              <div class="card-label">利用可能額</div>
              <div id="card-limit" class="card-value" :class="{ 'card-limit-low': defaultCard.cardLimit < 20000 }">
                {{ formatPrice(defaultCard.cardLimit) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Favorite genres -->
      <div id="favorite-genres-section" class="genre-section">
        <div class="genre-section-header">
          <h2 class="section-title">好きなゲームジャンル</h2>
          <button v-if="!isEditingGenres" class="btn-edit-genre" @click="startEditGenres">編集</button>
          <button v-else class="btn-save-genre" @click="saveGenres">保存</button>
        </div>
        <div v-if="!isEditingGenres">
          <div v-if="store.favoriteGenres.length > 0" class="genre-tags">
            <span v-for="g in store.favoriteGenres" :key="g" class="genre-tag">{{ g }}</span>
          </div>
          <p v-else class="genre-empty">まだジャンルが設定されていません</p>
        </div>
        <div v-else class="genre-checkboxes">
          <label
            v-for="genre in GENRES"
            :key="genre"
            class="genre-check"
            :class="{ active: editGenres.includes(genre) }"
          >
            <input type="checkbox" :value="genre" v-model="editGenres" />
            {{ genre }}
          </label>
        </div>
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { store, logout, cartCount, formatPrice, getUserDefaultCard, updateFavoriteGenres } from '../store/index.js'
import { GENRES } from '../data/genres.js'

const router = useRouter()

const avatarChar = computed(() => store.currentUser?.name?.[0] || '?')

const joinedDate = computed(() => {
  const user = store.users.find(u => u.id === store.currentUser?.id)
  return user?.createdAt || '—'
})

const recentOrders = computed(() => {
  return [...store.orders].reverse().slice(0, 5)
})

const defaultCard = computed(() => getUserDefaultCard())

const isEditingGenres = ref(false)
const editGenres = ref([])

function startEditGenres() {
  editGenres.value = [...store.favoriteGenres]
  isEditingGenres.value = true
}

function saveGenres() {
  updateFavoriteGenres(editGenres.value)
  isEditingGenres.value = false
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

function handleLogout() {
  if (!window.confirm('ログアウトしますか？')) return
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

/* Credit card */
.card-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 20px;
}

.credit-card {
  background: linear-gradient(135deg, #1a2a4a, #2a1a4a);
  border-radius: 12px;
  padding: 20px 24px;
  color: #fff;
}

.card-number {
  font-size: 16px;
  font-family: monospace;
  letter-spacing: 2px;
  margin-bottom: 16px;
  color: rgba(255,255,255,0.9);
}

.card-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.card-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.6);
  margin-bottom: 2px;
}

.card-value {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.card-limit-low {
  color: #fbbf24;
}

/* Favorite genres */
.genre-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 20px;
}

.genre-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.genre-section-header .section-title {
  margin-bottom: 0;
}

.btn-edit-genre, .btn-save-genre {
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 100px;
  border: 1px solid var(--accent);
  color: var(--accent);
  transition: var(--transition);
}

.btn-save-genre {
  background: var(--accent);
  color: #fff;
}

.btn-edit-genre:hover {
  background: var(--accent);
  color: #fff;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.genre-tag {
  padding: 4px 12px;
  background: rgba(108, 99, 255, 0.15);
  border: 1px solid var(--accent);
  border-radius: 100px;
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
}

.genre-empty {
  font-size: 13px;
  color: var(--text-muted);
}

.genre-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.genre-check {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.genre-check input[type="checkbox"] {
  display: none;
}

.genre-check:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.genre-check.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  font-weight: 600;
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
