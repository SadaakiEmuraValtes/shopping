<template>
  <div class="container">
    <h1 class="page-title">❤️ お気に入り</h1>

    <div v-if="favoriteProducts.length === 0" class="empty-state">
      <div class="empty-icon">🤍</div>
      <h3>お気に入りはありません</h3>
      <p>商品ページのハートボタンからお気に入りに追加できます</p>
      <RouterLink to="/" class="btn btn-primary" style="margin-top:16px">商品一覧へ</RouterLink>
    </div>

    <div v-else>
      <p class="fav-count">{{ favoriteProducts.length }}件のお気に入り</p>
      <div class="product-grid">
        <ProductCard
          v-for="product in favoriteProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, getProduct } from '../store/index.js'
import ProductCard from '../components/ProductCard.vue'

const favoriteProducts = computed(() =>
  store.favorites.map(id => getProduct(id)).filter(Boolean)
)
</script>

<style scoped>
.fav-count {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding-bottom: 64px;
}

@media (max-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
}
</style>
