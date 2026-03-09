<template>
  <div
    :id="`product-card-${product.id}`"
    class="product-card"
    :class="{ 'sold-out': stockAmount <= 0 }"
  >
    <a :href="productUrl" target="_blank" rel="noopener" class="card-link" :id="`product-link-${product.id}`">
      <div class="product-image" :style="{ background: `linear-gradient(135deg, ${product.color}cc, ${product.color}44)` }">
        <span class="product-emoji">{{ product.emoji }}</span>
        <div v-if="product.limited" class="limited-ribbon">限定</div>
        <div v-if="stockAmount <= 0" class="sold-out-overlay">SOLD OUT</div>
      </div>

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
        <div class="card-price" :id="`product-price-${product.id}`">{{ formatPrice(product.price) }}</div>
      </div>
    </a>

    <div class="card-actions">
      <button
        :id="`fav-btn-${product.id}`"
        class="btn-fav"
        :class="{ active: favorited, popping: isPopping }"
        @click.prevent="handleToggleFavorite"
        :title="favorited ? 'お気に入りから削除' : 'お気に入りに追加'"
        :aria-label="favorited ? 'お気に入りから削除' : 'お気に入りに追加'"
      >
        <span class="fav-icon">{{ favorited ? '❤️' : '🤍' }}</span>
      </button>

      <button
        :id="`cart-btn-${product.id}`"
        class="btn btn-primary btn-sm cart-btn"
        :disabled="stockAmount <= 0"
        @click.prevent="handleAddToCart"
        :aria-label="`${product.name}をカートに追加`"
      >
        {{ addedFlash ? '✓ 追加済み' : '🛒 カートに入れる' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { addToCart, toggleFavorite, isFavorite, getStock, formatPrice } from '../store/index.js'

const props = defineProps({
  product: { type: Object, required: true },
})

const router = useRouter()
const addedFlash = ref(false)
const isPopping = ref(false)

const productUrl = computed(() => router.resolve({ name: 'product', params: { id: props.product.id } }).href)
const stockAmount = computed(() => getStock(props.product.id))
const favorited = computed(() => isFavorite(props.product.id))

const platformTagClass = computed(() => {
  const p = props.product.platform
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

function handleToggleFavorite() {
  isPopping.value = true
  toggleFavorite(props.product.id)
  setTimeout(() => { isPopping.value = false }, 500)
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
.product-card.sold-out { opacity: 0.7; }

.card-link {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-decoration: none;
  color: inherit;
}

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
.product-card:hover .product-emoji { transform: scale(1.1); }

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
}
.sold-out-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: var(--danger);
  letter-spacing: 3px;
}

.card-body {
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.card-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}
.card-rating { display: flex; align-items: center; gap: 6px; }
.stars { font-size: 12px; color: var(--accent-gold); }
.rating-num { font-size: 12px; color: var(--text-muted); }
.card-price { font-size: 18px; font-weight: 700; }

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--border);
}

/* Favorite button */
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
  transition: border-color 0.2s, background 0.2s;
  flex-shrink: 0;
  cursor: pointer;
}
.btn-fav:hover {
  border-color: #e45a8a;
  background: rgba(228, 90, 138, 0.1);
}
.btn-fav.active {
  border-color: #e45a8a;
  background: rgba(228, 90, 138, 0.08);
}

.fav-icon {
  display: inline-block;
  line-height: 1;
}

/* Heart pop animation */
@keyframes heartPop {
  0%   { transform: scale(1); }
  20%  { transform: scale(1.7) rotate(-15deg); }
  45%  { transform: scale(1.2) rotate(8deg); }
  65%  { transform: scale(1.5) rotate(-5deg); }
  100% { transform: scale(1) rotate(0deg); }
}
@keyframes heartRing {
  0%   { box-shadow: 0 0 0 0 rgba(228, 90, 138, 0.55); }
  70%  { box-shadow: 0 0 0 12px rgba(228, 90, 138, 0); }
  100% { box-shadow: 0 0 0 0 rgba(228, 90, 138, 0); }
}

.btn-fav.popping .fav-icon {
  animation: heartPop 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
.btn-fav.popping {
  animation: heartRing 0.5s ease;
}

.cart-btn {
  flex: 1;
  font-size: 12px;
  padding: 8px 10px;
}
</style>
