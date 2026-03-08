<template>
  <div class="home">
    <LoadingOverlay :show="isSearchLoading" />

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">ゲームショップ</h1>
        <p class="hero-sub">PlayStation 5・Nintendo Switch 2 の最新タイトルが揃う</p>

        <!-- Search -->
        <form class="search-form" @submit.prevent="handleSearch">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="ゲームを検索... (タイトル・プラットフォーム)"
            :disabled="isSearchLoading"
          />
          <button type="submit" class="search-btn" :disabled="isSearchLoading">
            <span v-if="isSearchLoading" class="spinner spinner-sm"></span>
            <span v-else>🔍</span>
          </button>
          <button
            v-if="activeQuery"
            type="button"
            class="search-clear"
            @click="clearSearch"
          >✕ クリア</button>
        </form>
      </div>
    </section>

    <!-- Filter bar -->
    <div class="filter-bar container">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="filter-btn"
        :class="{ active: activeFilter === filter.value }"
        @click="setFilter(filter.value)"
      >
        {{ filter.label }}
      </button>
      <span class="result-count">{{ filteredProducts.length }}件</span>
    </div>

    <!-- Active search info -->
    <div v-if="activeQuery" class="container search-info">
      「<strong>{{ activeQuery }}</strong>」の検索結果：{{ filteredProducts.length }}件
    </div>

    <!-- Product grid -->
    <div class="container">
      <div v-if="displayedProducts.length > 0" class="product-grid">
        <ProductCard
          v-for="product in displayedProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🎮</div>
        <h3>商品が見つかりません</h3>
        <p>検索条件を変えてお試しください</p>
        <button class="btn btn-primary" style="margin-top:16px" @click="clearSearch">
          すべての商品を表示
        </button>
      </div>

      <!-- Scroll loading -->
      <div class="scroll-loading" v-if="isScrollLoading">
        <div class="spinner"></div>
        <span>読み込み中...</span>
      </div>

      <!-- Sentinel for infinite scroll -->
      <div ref="sentinel" class="sentinel"></div>

      <!-- All loaded message -->
      <div v-if="!hasMore && displayedProducts.length > 0" class="all-loaded">
        全 {{ filteredProducts.length }} 件を表示しました
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { store } from '../store/index.js'
import ProductCard from '../components/ProductCard.vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'

const PAGE_SIZE = 12

const searchQuery = ref('')
const activeQuery = ref('')
const activeFilter = ref('all')
const currentPage = ref(1)
const isSearchLoading = ref(false)
const isScrollLoading = ref(false)
const sentinel = ref(null)

const filters = [
  { value: 'all', label: 'すべて' },
  { value: 'PS5', label: 'PS5' },
  { value: 'Switch', label: 'Switch' },
  { value: 'Switch2', label: 'Switch 2' },
  { value: 'ハードウェア', label: 'ハードウェア' },
  { value: 'ゲームソフト', label: 'ゲームソフト' },
  { value: 'limited', label: '限定品' },
]

const filteredProducts = computed(() => {
  let list = store.products

  // text filter
  if (activeQuery.value) {
    const q = activeQuery.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.platform.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }

  // category/platform filter
  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'limited') {
      list = list.filter(p => p.limited)
    } else if (['PS5', 'Switch', 'Switch2'].includes(activeFilter.value)) {
      list = list.filter(p => p.platform === activeFilter.value)
    } else {
      list = list.filter(p => p.category === activeFilter.value)
    }
  }

  return list
})

const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, currentPage.value * PAGE_SIZE)
})

const hasMore = computed(() => {
  return displayedProducts.value.length < filteredProducts.value.length
})

async function handleSearch() {
  const q = searchQuery.value.trim()
  if (!q) {
    activeQuery.value = ''
    currentPage.value = 1
    return
  }
  isSearchLoading.value = true
  // 5～10 seconds random delay
  const delay = 5000 + Math.random() * 5000
  await new Promise(resolve => setTimeout(resolve, delay))
  activeQuery.value = q
  currentPage.value = 1
  isSearchLoading.value = false
}

function clearSearch() {
  searchQuery.value = ''
  activeQuery.value = ''
  currentPage.value = 1
}

function setFilter(value) {
  activeFilter.value = value
  currentPage.value = 1
}

// Reset page on filter change
watch(activeFilter, () => {
  currentPage.value = 1
})

// Infinite scroll
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && hasMore.value && !isScrollLoading.value && !isSearchLoading.value) {
      isScrollLoading.value = true
      // 2～3 seconds delay
      const delay = 2000 + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
      currentPage.value++
      isScrollLoading.value = false
    }
  }, { rootMargin: '200px', threshold: 0 })

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
/* Hero */
.hero {
  background: linear-gradient(135deg, #0f0f13 0%, #1a1a2e 50%, #16213e 100%);
  padding: 48px 0 36px;
  border-bottom: 1px solid var(--border);
}

.hero-title {
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, var(--accent) 60%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.hero-sub {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 28px;
}

/* Search */
.search-form {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 640px;
}

.search-input {
  flex: 1;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-light);
  border-radius: 100px;
  color: var(--text-primary);
  font-size: 15px;
  transition: var(--transition);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent);
  background: rgba(108, 99, 255, 0.05);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.15);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:disabled {
  opacity: 0.6;
  cursor: wait;
}

.search-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  transition: var(--transition);
  flex-shrink: 0;
}

.search-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: scale(1.05);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.search-clear {
  padding: 8px 14px;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 13px;
  transition: var(--transition);
  white-space: nowrap;
}

.search-clear:hover {
  border-color: var(--danger);
  color: var(--danger);
}

/* Filter bar */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 20px;
  padding-bottom: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-bar::-webkit-scrollbar { display: none; }

.filter-btn {
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  transition: var(--transition);
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.filter-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.result-count {
  margin-left: auto;
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Search info */
.search-info {
  padding: 12px 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.search-info strong {
  color: var(--accent);
}

/* Product grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 20px 0 32px;
}

/* Scroll loading */
.scroll-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.sentinel {
  height: 1px;
}

.all-loaded {
  text-align: center;
  padding: 24px 0 40px;
  color: var(--text-muted);
  font-size: 13px;
  border-top: 1px solid var(--border);
  margin-top: 12px;
}

@media (max-width: 640px) {
  .hero {
    padding: 32px 0 24px;
  }

  .search-form {
    flex-wrap: wrap;
  }

  .search-input {
    min-width: 0;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
}
</style>
