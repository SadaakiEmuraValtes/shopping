<template>
  <div id="product-detail-page" class="product-detail" v-if="product">
    <div class="container">
      <!-- Breadcrumb -->
      <nav id="breadcrumb" class="breadcrumb">
        <a href="/" class="bc-link">TOP</a>
        <span class="bc-sep">›</span>
        <span>{{ product.category }}</span>
        <span class="bc-sep">›</span>
        <span class="bc-current">{{ product.name }}</span>
      </nav>

      <div class="detail-layout">
        <!-- Left: Image -->
        <div class="detail-image-wrap">
          <div
            :id="`product-image-${product.id}`"
            class="detail-image"
            :style="{ background: `linear-gradient(135deg, ${product.color}cc, ${product.color}33)` }"
          >
            <span class="detail-emoji">{{ product.emoji }}</span>
            <div v-if="product.limited" class="limited-badge">限定品</div>
          </div>

          <!-- Stock status -->
          <div :id="`stock-info-${product.id}`" class="stock-info">
            <template v-if="stockAmount <= 0">
              <span class="stock-badge sold-out">在庫切れ</span>
            </template>
            <template v-else-if="product.limited">
              <span class="stock-badge limited">限定 残り {{ stockAmount }} 点</span>
            </template>
            <template v-else-if="stockAmount <= 5">
              <span class="stock-badge low">残り {{ stockAmount }} 点</span>
            </template>
            <template v-else>
              <span class="stock-badge in-stock">在庫あり ({{ stockAmount }} 点)</span>
            </template>
          </div>
        </div>

        <!-- Right: Info -->
        <div class="detail-info">
          <div class="detail-tags">
            <span :id="`product-platform-${product.id}`" class="tag" :class="platformTagClass">{{ product.platform }}</span>
            <span :id="`product-category-${product.id}`" class="tag" style="background:rgba(255,255,255,0.1); color:var(--text-secondary)">
              {{ product.category }}
            </span>
            <span v-if="product.limited" class="tag tag-limited">限定品</span>
          </div>

          <h1 :id="`product-name-${product.id}`" class="detail-title">{{ product.name }}</h1>

          <div :id="`product-rating-${product.id}`" class="detail-rating">
            <span class="stars">{{ renderStars(product.rating) }}</span>
            <span class="rating-num">{{ product.rating.toFixed(1) }}</span>
          </div>

          <div :id="`product-price-${product.id}`" class="detail-price">{{ formatPrice(product.price) }}</div>

          <p :id="`product-desc-${product.id}`" class="detail-desc">{{ product.description }}</p>

          <div id="detail-actions" class="detail-actions" v-if="stockAmount > 0">
            <!-- Quantity selector -->
            <div class="qty-row">
              <label class="qty-label">数量</label>
              <div class="qty-control">
                <button id="qty-minus" class="qty-btn" @click="qty = Math.max(1, qty - 1)">−</button>
                <span id="qty-value" class="qty-value">{{ qty }}</span>
                <button id="qty-plus" class="qty-btn" @click="qty = Math.min(stockAmount, qty + 1)">＋</button>
              </div>
              <span class="qty-max">最大 {{ stockAmount }} 点</span>
            </div>

            <!-- Buttons -->
            <div class="action-buttons">
              <button
                id="add-to-cart-btn"
                class="btn btn-secondary btn-lg"
                @click="handleAddToCart"
              >
                {{ cartFlash ? '✓ カートに追加しました' : '🛒 カートに入れる' }}
              </button>

              <button
                id="buy-now-btn"
                class="btn btn-primary btn-lg"
                @click="handleBuyNow"
              >
                今すぐ購入
              </button>
            </div>

            <button
              id="fav-btn-detail"
              class="btn-fav-large"
              :class="{ active: favorited }"
              @click="handleToggleFavorite"
            >
              {{ favorited ? '❤️ お気に入り登録済み' : '🤍 お気に入りに追加' }}
            </button>
          </div>

          <div v-else id="sold-out-section" class="sold-out-message">
            <p>この商品は現在在庫切れです。</p>
            <button
              id="fav-btn-detail"
              class="btn-fav-large"
              :class="{ active: favorited }"
              @click="handleToggleFavorite"
            >
              {{ favorited ? '❤️ お気に入り登録済み' : '🤍 お気に入りに追加して入荷を待つ' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews section (iframe) -->
      <div id="reviews-section" class="reviews-section">
        <h2 class="reviews-heading">レビュー</h2>
        <iframe
          id="reviews-iframe"
          :src="reviewsIframeUrl"
          class="reviews-iframe"
          frameborder="0"
          scrolling="no"
          ref="reviewsIframe"
        ></iframe>
      </div>
    </div>
  </div>

  <div v-else id="product-not-found" class="empty-state">
    <div class="empty-icon">😕</div>
    <h3>商品が見つかりません</h3>
    <a href="/" class="btn btn-primary" style="margin-top:16px">TOPに戻る</a>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProduct, getStock, addToCart, toggleFavorite, isFavorite, formatPrice } from '../store/index.js'

const route = useRoute()
const router = useRouter()

const product = computed(() => getProduct(route.params.id))
const stockAmount = computed(() => product.value ? getStock(product.value.id) : 0)
const favorited = computed(() => product.value ? isFavorite(product.value.id) : false)

const qty = ref(1)
const cartFlash = ref(false)
const reviewsIframe = ref(null)

const reviewsIframeUrl = computed(() => {
  return `${import.meta.env.BASE_URL}#/reviews/${route.params.id}`
})

function onIframeMessage(e) {
  if (e.data?.type === 'iframeHeight' && reviewsIframe.value) {
    reviewsIframe.value.style.height = e.data.height + 'px'
  }
}

onMounted(() => {
  window.addEventListener('message', onIframeMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', onIframeMessage)
})

const platformTagClass = computed(() => {
  if (!product.value) return ''
  const p = product.value.platform
  if (p === 'NexStation5') return 'tag-nexstation5'
  if (p === 'FlipDual2') return 'tag-flipdual2'
  if (p === 'FlipDual') return 'tag-flipdual'
  if (p === 'XVertex') return 'tag-xvertex'
  return 'tag-flipdual'
})

function renderStars(rating) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0))
}

function handleAddToCart() {
  const ok = addToCart(product.value.id, qty.value)
  if (ok) {
    cartFlash.value = true
    setTimeout(() => { cartFlash.value = false }, 2000)
  }
}

function handleBuyNow() {
  addToCart(product.value.id, qty.value)
  router.push('/checkout')
}

function handleToggleFavorite() {
  toggleFavorite(product.value.id)
}
</script>

<style scoped>
.product-detail {
  padding: 24px 0 64px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.bc-link {
  color: var(--accent);
}
.bc-link:hover {
  text-decoration: underline;
}
.bc-sep {
  opacity: 0.4;
}
.bc-current {
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

/* Image */
.detail-image-wrap {
  position: sticky;
  top: calc(var(--header-height) + 24px);
}

.detail-image {
  border-radius: var(--radius);
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.detail-emoji {
  font-size: 120px;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.5));
}

.limited-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--accent-gold);
  color: #000;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-xs);
}

.stock-info {
  margin-top: 12px;
  text-align: center;
}

.stock-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
}

.stock-badge.in-stock {
  background: rgba(34, 197, 94, 0.15);
  color: var(--success);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.stock-badge.low {
  background: rgba(245, 158, 11, 0.15);
  color: var(--warning);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.stock-badge.limited {
  background: rgba(245, 197, 24, 0.15);
  color: var(--accent-gold);
  border: 1px solid rgba(245, 197, 24, 0.3);
}

.stock-badge.sold-out {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Info */
.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.detail-title {
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 12px;
}

.detail-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.stars {
  font-size: 20px;
  color: var(--accent-gold);
}

.rating-num {
  font-size: 16px;
  color: var(--text-secondary);
}

.detail-price {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.detail-desc {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 28px;
}

/* Actions */
.qty-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.qty-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.qty-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: var(--transition);
}

.qty-btn:hover {
  background: var(--accent);
}

.qty-value {
  min-width: 44px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  padding: 0 8px;
  background: var(--bg-card);
}

.qty-max {
  font-size: 12px;
  color: var(--text-muted);
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.action-buttons .btn {
  flex: 1;
  min-width: 140px;
}

.btn-fav-large {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: none;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: var(--transition);
  width: 100%;
  justify-content: center;
}

.btn-fav-large:hover {
  border-color: #e45a8a;
  color: #e45a8a;
  background: rgba(228, 90, 138, 0.08);
}

.btn-fav-large.active {
  border-color: #e45a8a;
  color: #e45a8a;
  background: rgba(228, 90, 138, 0.1);
}

.sold-out-message {
  padding: 24px;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius);
  text-align: center;
}

.sold-out-message p {
  color: var(--danger);
  margin-bottom: 12px;
}

/* Reviews */
.reviews-section {
  margin-top: 48px;
  border-top: 1px solid var(--border);
  padding-top: 32px;
}

.reviews-heading {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.reviews-iframe {
  width: 100%;
  min-height: 300px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: #f8f8fc;
}

@media (max-width: 768px) {
  .detail-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .detail-image-wrap {
    position: static;
  }

  .detail-emoji {
    font-size: 80px;
  }
}
</style>
