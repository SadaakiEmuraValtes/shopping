<template>
  <div class="product-card" :class="{ 'sold-out': stockAmount <= 0 }">
    <!-- Clickable area → new tab -->
    <a :href="productUrl" target="_blank" rel="noopener" class="card-link">
      <!-- Image placeholder -->
      <div class="product-image" :style="{ background: `linear-gradient(135deg, ${product.color}cc, ${product.color}44)` }">
        <span class="product-emoji">{{ product.emoji }}</span>
        <div v-if="product.limited" class="limited-ribbon">限定</div>
        <div v-if="stockAmount <= 0" class="sold-out-overlay">SOLD OUT</div>
      </div>

      <!-- Info -->
      <div class="card-body">
        <div class="card-tags">
          <span class="tag" :class="platformTagClass">{{ product.platform }}</span>
          <span v-if="product.limited" class="tag tag-limited">限定品</span>
          <span v-if="stockAmount <= 0" class="tag tag-sold-out">在庫切れ</span>
          <span v-else-if="stockAmount <= 3" class="tag tag-limited">残り{{ stockAmount }}点</span>
        </div>

        <h3 class="card-title">{{ product.name }}</h3>

        <div class="card-rating">
          <span class="stars">{{ renderStars(product.rating) }}</span>
          <span class="rating-num">{{ product.rating.toFixed(1) }}</span>
        </div>

        <div class="card-price">{{ formatPrice(product.price) }}</div>
      </div>
    </a>

    <!-- Actions -->
    <div class="card-actions">
      <button
        class="btn-fav"
        :class="{ active: favorited }"
        @click.prevent="handleToggleFavorite"
        :title="favorited ? 'お気に入りから削除' : 'お気に入りに追加'"
      >
        {{ favorited ? '❤️' : '🤍' }}
      </button>

      <button
        class="btn btn-primary btn-sm cart-btn"
        :disabled="stockAmount <= 0"
        @click.prevent="handleAddToCart"
      >
        {{ addedFlash ? '✓ 追加済み' : '🛒 カートに入れる' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store, addToCart, toggleFavorite, isFavorite, getStock, formatPrice } from '../store/index.js'

const props = defineProps({
  product: { type: Object, required: true },
})

const router = useRouter()
const addedFlash = ref(false)

const productUrl = computed(() => router.resolve({ name: 'product', params: { id: props.product.id } }).href)
const stockAmount = computed(() => getStock(props.product.id))
const favorited = computed(() => isFavorite(props.product.id))

const platformTagClass = computed(() => {
  if (props.product.platform === 'PS5') return 'tag-ps5'
  if (props.product.platform === 'Switch2') return 'tag-switch2'
  return 'tag-switch'
})

function renderStars(rating) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0))
}

function handleToggleFavorite() {
  toggleFavorite(props.product.id)
}

function handleAddToCart() {
  const ok = addToCart(props.product.id, 1)
  if (ok) {
    addedFlash.value = true
    setTimeout(() => { addedFlash.value = false }, 1800)
  }
}
</script>

<style scoped>
.product-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  overflow: hidden;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: var(--border-light);
}

.product-card.sold-out {
  opacity: 0.7;
}

.card-link {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-decoration: none;
  color: inherit;
}

/* Image */
.product-image {
  position: relative;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-emoji {
  font-size: 64px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
  transition: transform 0.2s ease;
}

.product-card:hover .product-emoji {
  transform: scale(1.1);
}

.limited-ribbon {
  position: absolute;
  top: 12px;
  right: -24px;
  background: var(--accent-gold);
  color: #000;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 32px;
  transform: rotate(45deg);
  transform-origin: center;
}

.sold-out-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: var(--danger);
  letter-spacing: 3px;
}

/* Body */
.card-body {
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stars {
  font-size: 12px;
  color: var(--accent-gold);
}

.rating-num {
  font-size: 12px;
  color: var(--text-muted);
}

.card-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

/* Actions */
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--border);
}

.btn-fav {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  transition: var(--transition);
  flex-shrink: 0;
}

.btn-fav:hover {
  border-color: #e45a8a;
  background: rgba(228, 90, 138, 0.1);
  transform: scale(1.1);
}

.cart-btn {
  flex: 1;
  font-size: 12px;
  padding: 8px 10px;
}
</style>
