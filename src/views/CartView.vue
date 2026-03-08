<template>
  <div class="container">
    <h1 class="page-title">🛒 ショッピングカート</h1>

    <div v-if="store.cart.length === 0" class="empty-state">
      <div class="empty-icon">🛒</div>
      <h3>カートは空です</h3>
      <p>商品を追加してみましょう</p>
      <RouterLink to="/" class="btn btn-primary" style="margin-top:16px">商品一覧へ</RouterLink>
    </div>

    <div v-else class="cart-layout">
      <!-- Cart items -->
      <div class="cart-items">
        <div
          v-for="item in cartItems"
          :key="item.productId"
          class="cart-item"
        >
          <a :href="productUrl(item.product)" target="_blank" rel="noopener" class="item-image-link">
            <div
              class="item-image"
              :style="{ background: `linear-gradient(135deg, ${item.product.color}cc, ${item.product.color}33)` }"
            >
              <span>{{ item.product.emoji }}</span>
            </div>
          </a>

          <div class="item-info">
            <a :href="productUrl(item.product)" target="_blank" rel="noopener" class="item-name">
              {{ item.product.name }}
            </a>
            <div class="item-meta">
              <span class="tag" :class="platformTagClass(item.product)">{{ item.product.platform }}</span>
              <span v-if="item.product.limited" class="tag tag-limited">限定品</span>
            </div>
            <div class="item-unit-price">{{ formatPrice(item.product.price) }} / 点</div>
          </div>

          <div class="item-controls">
            <div class="qty-control">
              <button class="qty-btn" @click="decreaseQty(item)" :disabled="item.quantity <= 1">−</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button class="qty-btn" @click="increaseQty(item)" :disabled="item.quantity >= getStock(item.productId)">＋</button>
            </div>
            <div class="item-subtotal">{{ formatPrice(item.product.price * item.quantity) }}</div>
            <button class="remove-btn" @click="handleRemove(item.productId)" title="削除">🗑️</button>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="cart-summary">
        <h2 class="summary-title">注文サマリー</h2>

        <div class="summary-rows">
          <div class="summary-row" v-for="item in cartItems" :key="item.productId">
            <span class="summary-row-name">{{ item.product.name.slice(0, 20) }}{{ item.product.name.length > 20 ? '...' : '' }} ×{{ item.quantity }}</span>
            <span>{{ formatPrice(item.product.price * item.quantity) }}</span>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-total">
          <span>合計</span>
          <span class="total-price">{{ formatPrice(totalAmount) }}</span>
        </div>

        <p class="summary-tax">※ 税込価格</p>

        <button class="btn btn-primary btn-lg btn-block" @click="handleCheckout">
          購入手続きへ
        </button>

        <RouterLink to="/" class="btn btn-secondary btn-block" style="margin-top:12px; text-align:center">
          ショッピングを続ける
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store, removeFromCart, updateCartQuantity, getStock, getProduct, cartTotal, formatPrice } from '../store/index.js'

const router = useRouter()

const cartItems = computed(() =>
  store.cart
    .map(item => ({ ...item, product: getProduct(item.productId) }))
    .filter(item => item.product)
)

const totalAmount = computed(() => cartTotal())

function productUrl(product) {
  return `/product/${product.id}`
}

function platformTagClass(product) {
  if (product.platform === 'PS5') return 'tag-ps5'
  if (product.platform === 'Switch2') return 'tag-switch2'
  return 'tag-switch'
}

function decreaseQty(item) {
  if (item.quantity > 1) {
    updateCartQuantity(item.productId, item.quantity - 1)
  }
}

function increaseQty(item) {
  const max = getStock(item.productId)
  if (item.quantity < max) {
    updateCartQuantity(item.productId, item.quantity + 1)
  }
}

function handleRemove(productId) {
  removeFromCart(productId)
}

function handleCheckout() {
  if (!store.currentUser) {
    router.push({ name: 'login', query: { redirect: '/checkout' } })
  } else {
    router.push('/checkout')
  }
}
</script>

<style scoped>
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
  padding-bottom: 64px;
}

/* Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  gap: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  align-items: center;
  transition: var(--transition);
}

.cart-item:hover {
  border-color: var(--border-light);
}

.item-image-link {
  flex-shrink: 0;
}

.item-image {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-name:hover {
  color: var(--accent);
}

.item-meta {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.item-unit-price {
  font-size: 13px;
  color: var(--text-muted);
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.qty-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: var(--transition);
}

.qty-btn:hover:not(:disabled) {
  background: var(--accent);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  min-width: 36px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  background: var(--bg-card);
}

.item-subtotal {
  font-size: 16px;
  font-weight: 700;
}

.remove-btn {
  font-size: 18px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.remove-btn:hover {
  opacity: 1;
}

/* Summary */
.cart-summary {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  position: sticky;
  top: calc(var(--header-height) + 24px);
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
  gap: 8px;
}

.summary-row-name {
  flex: 1;
  min-width: 0;
}

.summary-divider {
  height: 1px;
  background: var(--border);
  margin: 12px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.total-price {
  color: var(--accent);
  font-size: 22px;
}

.summary-tax {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
  .cart-summary {
    position: static;
  }
}

@media (max-width: 600px) {
  .cart-item {
    flex-wrap: wrap;
  }
  .item-controls {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
