<template>
  <div class="container">
    <h1 class="page-title">📦 購入履歴</h1>

    <div v-if="store.orders.length === 0" class="empty-state">
      <div class="empty-icon">📦</div>
      <h3>購入履歴がありません</h3>
      <p>まだ注文が完了していません</p>
      <RouterLink to="/" class="btn btn-primary" style="margin-top:16px">ショッピングへ</RouterLink>
    </div>

    <div v-else class="history-list">
      <div
        v-for="order in reversedOrders"
        :key="order.id"
        class="order-card"
        :class="{ open: expandedId === order.id }"
      >
        <!-- Order header -->
        <div class="order-head" @click="toggleExpand(order.id)">
          <div class="order-head-left">
            <span class="order-num">#{{ order.id }}</span>
            <span class="order-date">{{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="order-head-right">
            <span class="order-total-label">{{ formatPrice(order.total) }}</span>
            <span class="expand-icon">{{ expandedId === order.id ? '▲' : '▼' }}</span>
          </div>
        </div>

        <!-- Order items preview (always visible) -->
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, formatPrice } from '../store/index.js'

const expandedId = ref(null)

const reversedOrders = computed(() => [...store.orders].reverse())

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
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
.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 64px;
}

.order-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color 0.2s;
}

.order-card.open {
  border-color: var(--accent);
}

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

.order-head:hover {
  background: var(--bg-card-hover);
}

.order-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.order-num {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
}

.order-date {
  font-size: 13px;
  color: var(--text-muted);
}

.order-head-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-total-label {
  font-weight: 700;
  font-size: 16px;
}

.expand-icon {
  font-size: 11px;
  color: var(--text-muted);
}

.order-preview {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 20px 14px;
}

.preview-emoji {
  font-size: 22px;
}

.preview-more {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
}

.preview-count {
  margin-left: auto;
  font-size: 13px;
  color: var(--text-muted);
}

/* Body */
.order-body {
  border-top: 1px solid var(--border);
  padding: 20px;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-emoji {
  font-size: 28px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
}

.item-unit {
  font-size: 13px;
  color: var(--text-muted);
}

.item-subtotal {
  font-weight: 700;
  font-size: 14px;
}

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

.order-meta-section p {
  font-size: 13px;
  margin-bottom: 3px;
}

.order-total-row {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 17px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.order-final {
  color: var(--accent);
  font-size: 20px;
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .order-meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
