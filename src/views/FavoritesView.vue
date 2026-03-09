<template>
  <div class="container">
    <h1 class="page-title">❤️ お気に入り</h1>

    <!-- Skeleton loading -->
    <div v-if="isLoading" class="product-grid">
      <div v-for="n in 8" :key="n" class="skeleton-card">
        <div class="sk sk-image"></div>
        <div class="sk-body">
          <div class="sk sk-badge"></div>
          <div class="sk sk-title"></div>
          <div class="sk sk-title sk-title-short"></div>
          <div class="sk sk-price"></div>
          <div class="sk sk-btn"></div>
        </div>
      </div>
    </div>

    <template v-else>
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
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { store, getProduct } from '../store/index.js'
import ProductCard from '../components/ProductCard.vue'

const isLoading = ref(true)

onMounted(async () => {
  await new Promise(r => setTimeout(r, 800))
  isLoading.value = false
})

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

/* Skeleton */
.skeleton-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.sk {
  background: linear-gradient(90deg, var(--bg-secondary) 25%, rgba(255,255,255,0.05) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.sk-image {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 0;
}

.sk-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sk-badge {
  width: 60px;
  height: 18px;
}

.sk-title {
  width: 100%;
  height: 14px;
}

.sk-title-short {
  width: 70%;
}

.sk-price {
  width: 80px;
  height: 20px;
}

.sk-btn {
  width: 100%;
  height: 36px;
  border-radius: 6px;
  margin-top: 4px;
}

@media (max-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
}
</style>
