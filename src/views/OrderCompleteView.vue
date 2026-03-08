<template>
  <div class="container order-complete">
    <div class="complete-card">
      <div class="complete-icon">🎉</div>
      <h1 class="complete-title">ご注文ありがとうございます！</h1>
      <p class="complete-sub">注文が正常に完了しました</p>

      <div v-if="order" class="order-detail">
        <div class="order-header">
          <span class="order-id">注文番号: #{{ order.id }}</span>
          <span class="order-date">{{ formatDate(order.createdAt) }}</span>
        </div>

        <div class="order-items">
          <div class="order-item" v-for="item in order.items" :key="item.productId">
            <span class="item-emoji">{{ item.emoji }}</span>
            <span class="item-name">{{ item.name }}</span>
            <span class="item-qty">× {{ item.quantity }}</span>
            <span class="item-price">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>

        <div class="order-totals">
          <div class="order-total-row">
            <span>合計</span>
            <span class="total-amount">{{ formatPrice(order.total) }}</span>
          </div>
        </div>

        <div class="order-info-grid">
          <div class="order-info-section">
            <h4>配送先</h4>
            <p>{{ order.shipping.name }}</p>
            <p>〒{{ order.shipping.postal }}</p>
            <p>{{ order.shipping.prefecture }}{{ order.shipping.address }}</p>
            <p v-if="order.shipping.building">{{ order.shipping.building }}</p>
            <p>{{ order.shipping.phone }}</p>
          </div>
          <div class="order-info-section">
            <h4>お支払い方法</h4>
            <p>{{ order.payment.methodName }}</p>
            <p v-if="order.payment.last4">カード末尾: {{ order.payment.last4 }}</p>
          </div>
        </div>
      </div>

      <div class="complete-actions">
        <RouterLink to="/purchase-history" class="btn btn-secondary">購入履歴を見る</RouterLink>
        <RouterLink to="/" class="btn btn-primary">ショッピングを続ける</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, formatPrice } from '../store/index.js'

const order = computed(() => {
  if (!store.lastOrderId) return null
  return store.orders.find(o => o.id === store.lastOrderId) || null
})

function formatDate(isoStr) {
  return new Date(isoStr).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.order-complete {
  padding: 40px 16px 80px;
  display: flex;
  justify-content: center;
}

.complete-card {
  width: 100%;
  max-width: 640px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 48px 36px;
  text-align: center;
}

.complete-icon {
  font-size: 72px;
  margin-bottom: 16px;
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.complete-title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
}

.complete-sub {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.order-detail {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 20px;
  text-align: left;
  margin-bottom: 28px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.order-id {
  font-weight: 700;
  font-size: 14px;
  color: var(--accent);
}

.order-date {
  font-size: 13px;
  color: var(--text-muted);
}

.order-items {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 12px 0;
  margin-bottom: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
}

.item-emoji {
  font-size: 20px;
}

.item-name {
  flex: 1;
}

.item-qty {
  color: var(--text-muted);
  font-size: 13px;
}

.item-price {
  font-weight: 600;
}

.order-totals {
  margin-bottom: 20px;
}

.order-total-row {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 18px;
}

.total-amount {
  color: var(--accent);
  font-size: 22px;
}

.order-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.order-info-section h4 {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.order-info-section p {
  font-size: 13px;
  margin-bottom: 3px;
  color: var(--text-primary);
}

.complete-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .complete-card {
    padding: 32px 20px;
  }
  .order-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
