<template>
  <div class="container">
    <h1 class="page-title">📦 購入履歴</h1>

    <div v-if="store.orders.length === 0" id="history-empty" class="empty-state">
      <div class="empty-icon">📦</div>
      <h3>購入履歴がありません</h3>
      <p>まだ注文が完了していません</p>
      <RouterLink to="/" class="btn btn-primary" style="margin-top:16px">ショッピングへ</RouterLink>
    </div>

    <div v-else>
      <!-- Order number search -->
      <div class="order-search-row">
        <input
          id="order-search-input"
          v-model="orderSearchQuery"
          type="text"
          class="order-search-input"
          placeholder="注文番号で検索..."
          @input="currentPage = 1"
        />
        <button
          v-if="orderSearchQuery"
          id="order-search-clear"
          class="order-search-clear"
          @click="orderSearchQuery = ''; currentPage = 1"
        >✕</button>
      </div>

      <!-- Pagination info -->
      <div class="pagination-info">
        <template v-if="orderSearchQuery">
          「{{ orderSearchQuery }}」の検索結果：{{ searchedOrders.length }} 件
        </template>
        <template v-else>
          全 {{ shuffledOrders.length }} 件中 {{ pageStart }}〜{{ pageEnd }} 件を表示
        </template>
      </div>

      <div id="history-list" class="history-list">
        <div
          v-for="order in pagedOrders"
          :key="order.id"
          :id="`order-card-${order.id}`"
          class="order-card"
          :class="{ open: expandedId === order.id }"
        >
          <!-- Order header -->
          <div :id="`order-head-${order.id}`" class="order-head" @click="toggleExpand(order.id)">
            <div class="order-head-left">
              <span :id="`order-num-${order.id}`" class="order-num">{{ formatOrderId(order.id, order.createdAt) }}</span>
              <span :id="`order-date-${order.id}`" class="order-date">{{ formatDate(order.createdAt) }}</span>
            </div>
            <div class="order-head-right">
              <span :id="`order-total-${order.id}`" class="order-total-label">{{ formatPrice(order.total) }}</span>
              <span class="expand-icon">{{ expandedId === order.id ? '▲' : '▼' }}</span>
            </div>
          </div>

          <!-- Order items preview -->
          <div class="order-preview">
            <span v-for="item in order.items.slice(0, 5)" :key="item.productId" class="preview-emoji">{{ item.emoji }}</span>
            <span v-if="order.items.length > 5" class="preview-more">+{{ order.items.length - 5 }}</span>
            <span class="preview-count">{{ order.items.length }}点</span>
          </div>

          <!-- Expanded detail -->
          <Transition name="expand">
            <div v-if="expandedId === order.id" class="order-body">
              <!-- Items -->
              <div class="order-items">
                <div class="order-item" v-for="item in order.items" :key="item.productId">
                  <span class="item-emoji">{{ item.emoji }}</span>
                  <div class="item-info">
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-unit">{{ formatPrice(item.price) }} × {{ item.quantity }}</div>
                    <!-- Rating -->
                    <div :id="`rating-section-${item.productId}`" class="item-rating">
                      <template v-if="getUserRating(item.productId) !== null">
                        <span class="rated-stars">{{ renderRatingStars(getUserRating(item.productId)) }}</span>
                        <span class="rated-label">評価済み</span>
                        <span v-if="getUserRatingData(item.productId)?.comment" class="rated-comment">「{{ getUserRatingData(item.productId).comment }}」</span>
                      </template>
                      <template v-else>
                        <button
                          :id="`rate-btn-${item.productId}`"
                          class="rate-open-btn"
                          @click="openRatingModal(item.productId, item.name)"
                        >★ 評価を書く</button>
                      </template>
                    </div>
                  </div>
                  <span class="item-subtotal">{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>

              <div class="order-meta-grid">
                <div class="order-meta-section">
                  <h4>配送先</h4>
                  <p>{{ order.shipping.name }}</p>
                  <p>〒{{ order.shipping.postal }} {{ order.shipping.prefecture }}</p>
                  <p>{{ order.shipping.address }}</p>
                  <p v-if="order.shipping.building">{{ order.shipping.building }}</p>
                  <p>{{ order.shipping.phone }}</p>
                  <p v-if="order.shipping.deliveryDate">配送希望日：{{ order.shipping.deliveryDate }}</p>
                </div>
                <div class="order-meta-section">
                  <h4>お支払い</h4>
                  <p>{{ order.payment.methodName }}</p>
                  <p v-if="order.payment.last4">末尾: {{ order.payment.last4 }}</p>
                </div>
              </div>

              <div class="order-total-row">
                <span>合計</span>
                <span class="order-final">{{ formatPrice(order.total) }}</span>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Pagination -->
      <div id="pagination" class="pagination">
        <button
          id="page-prev"
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >← 前へ</button>

        <button
          v-for="p in totalPages"
          :key="p"
          :id="`page-${p}`"
          class="page-btn page-num"
          :class="{ active: currentPage === p }"
          @click="currentPage = p"
        >{{ p }}</button>

        <button
          id="page-next"
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >次へ →</button>
      </div>
    </div>
  </div>

  <!-- Rating Modal -->
  <Teleport to="body">
    <div v-if="ratingModal.open" id="rating-modal-overlay" class="modal-overlay" @click.self="closeRatingModal">
      <div id="rating-modal" class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">商品を評価</h3>
          <button class="modal-close" @click="closeRatingModal">✕</button>
        </div>
        <p class="modal-product-name">{{ ratingModal.productName }}</p>

        <!-- Star selector -->
        <div class="star-selector">
          <span
            v-for="s in 5"
            :key="s"
            :id="`modal-star-${s}`"
            class="star-btn"
            :class="{ active: ratingModal.stars >= s }"
            @click="ratingModal.stars = s"
          >★</span>
          <span class="star-label">{{ ratingModal.stars > 0 ? ratingModal.stars + '点' : '選択してください' }}</span>
        </div>

        <!-- Comment -->
        <div class="modal-comment-wrap">
          <label class="modal-label" for="rating-comment">コメント（任意）</label>
          <textarea
            id="rating-comment"
            v-model="ratingModal.comment"
            class="modal-textarea"
            placeholder="この商品の感想を書いてください..."
            rows="4"
          ></textarea>
        </div>

        <div class="modal-actions">
          <button id="rating-cancel-btn" class="btn btn-secondary" @click="closeRatingModal">キャンセル</button>
          <button id="rating-submit-btn" class="btn btn-primary" :disabled="ratingModal.stars === 0" @click="submitRating">投稿する</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { store, formatPrice, getUserRating, getUserRatingData, setUserRating } from '../store/index.js'

const ORDERS_PER_PAGE = 6

const expandedId = ref(null)
const shuffledOrders = ref([])
const currentPage = ref(1)
const orderSearchQuery = ref('')
const ratingModal = ref({ open: false, productId: null, productName: '', stars: 0, comment: '' })

function formatOrderId(id, createdAt) {
  const s = String(id)
  if (s.startsWith('GS') && s.length === 20) {
    return `${s.slice(0, 2)}-${s.slice(2, 10)}-${s.slice(10, 16)}-${s.slice(16)}`
  }
  // Convert numeric legacy ID to GS format using createdAt
  if (createdAt) {
    const d = new Date(createdAt)
    const pad = (n, l = 2) => String(n).padStart(l, '0')
    const datePart = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
    const timePart = `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`
    const randPart = String(Math.abs(Number(s)) % 10000).padStart(4, '0')
    const gs = `GS${datePart}${timePart}${randPart}`
    return `${gs.slice(0, 2)}-${gs.slice(2, 10)}-${gs.slice(10, 16)}-${gs.slice(16)}`
  }
  return `#${s}`
}

const searchedOrders = computed(() => {
  if (!orderSearchQuery.value.trim()) return shuffledOrders.value
  const q = orderSearchQuery.value.trim().toLowerCase().replace(/-/g, '')
  return shuffledOrders.value.filter(o => {
    const displayed = formatOrderId(o.id, o.createdAt).toLowerCase().replace(/-/g, '')
    return displayed.includes(q)
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(searchedOrders.value.length / ORDERS_PER_PAGE)))

const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * ORDERS_PER_PAGE
  return searchedOrders.value.slice(start, start + ORDERS_PER_PAGE)
})

const pageStart = computed(() => searchedOrders.value.length === 0 ? 0 : (currentPage.value - 1) * ORDERS_PER_PAGE + 1)
const pageEnd = computed(() => Math.min(currentPage.value * ORDERS_PER_PAGE, searchedOrders.value.length))

onMounted(() => {
  const arr = [...store.orders]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  shuffledOrders.value = arr
})

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function openRatingModal(productId, productName) {
  ratingModal.value = { open: true, productId, productName, stars: 0, comment: '' }
}

function closeRatingModal() {
  ratingModal.value.open = false
}

function submitRating() {
  if (ratingModal.value.stars === 0) return
  setUserRating(ratingModal.value.productId, ratingModal.value.stars, ratingModal.value.comment)
  ratingModal.value.open = false
}

function renderRatingStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.order-search-row {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  max-width: 360px;
}

.order-search-input {
  width: 100%;
  padding: 9px 36px 9px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  transition: var(--transition);
}
.order-search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
}
.order-search-input::placeholder { color: var(--text-muted); }

.order-search-clear {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px 4px;
}
.order-search-clear:hover { color: var(--text-primary); }

.pagination-info {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color 0.2s;
}

.order-card.open { border-color: var(--accent); }

.order-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s;
  flex-wrap: wrap;
  gap: 8px;
}

.order-head:hover { background: var(--bg-card-hover); }

.order-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.order-num { font-size: 14px; font-weight: 700; color: var(--accent); }
.order-date { font-size: 13px; color: var(--text-muted); }

.order-head-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-total-label { font-weight: 700; font-size: 16px; }
.expand-icon { font-size: 11px; color: var(--text-muted); }

.order-preview {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 20px 14px;
}

.preview-emoji { font-size: 22px; }
.preview-more {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
}
.preview-count { margin-left: auto; font-size: 13px; color: var(--text-muted); }

.order-body { border-top: 1px solid var(--border); padding: 20px; }

.order-items { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }

.order-item { display: flex; align-items: flex-start; gap: 12px; }

/* Rating section */
.item-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.rate-open-btn {
  padding: 3px 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xs);
  color: #f5c518;
  font-size: 12px;
  cursor: pointer;
  transition: var(--transition);
}
.rate-open-btn:hover {
  border-color: #f5c518;
  background: rgba(245, 197, 24, 0.1);
}

.rated-stars { font-size: 13px; color: #f5c518; }
.rated-label { font-size: 11px; color: var(--text-muted); }
.rated-comment {
  font-size: 12px;
  color: var(--text-secondary);
  font-style: italic;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-box {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  padding: 28px 24px;
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow-hover);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.modal-title {
  font-size: 17px;
  font-weight: 700;
}

.modal-close {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-xs);
  transition: var(--transition);
}
.modal-close:hover { background: var(--bg-secondary); color: var(--text-primary); }

.modal-product-name {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.star-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
}

.star-btn {
  font-size: 30px;
  color: var(--border-light);
  cursor: pointer;
  transition: color 0.15s, transform 0.1s;
  line-height: 1;
  user-select: none;
}
.star-btn:hover,
.star-btn.active { color: #f5c518; transform: scale(1.1); }

.star-label {
  font-size: 13px;
  color: var(--text-muted);
  margin-left: 4px;
}

.modal-comment-wrap { margin-bottom: 24px; }

.modal-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.modal-textarea {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: var(--transition);
}
.modal-textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
}
.modal-textarea::placeholder { color: var(--text-muted); }

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.item-emoji { font-size: 28px; flex-shrink: 0; }
.item-info { flex: 1; }
.item-name { font-size: 14px; font-weight: 600; }
.item-unit { font-size: 13px; color: var(--text-muted); }
.item-subtotal { font-weight: 700; font-size: 14px; }

.order-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  padding: 16px;
}

.order-meta-section h4 {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.order-meta-section p { font-size: 13px; margin-bottom: 3px; }

.order-total-row {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 17px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.order-final { color: var(--accent); font-size: 20px; }

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 0 64px;
  flex-wrap: wrap;
}

.page-btn {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: var(--transition);
}

.page-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-num.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active { transition: opacity 0.2s ease; }
.expand-enter-from,
.expand-leave-to { opacity: 0; }

@media (max-width: 640px) {
  .order-meta-grid { grid-template-columns: 1fr; }
}
</style>
