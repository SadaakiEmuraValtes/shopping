<template>
  <div class="home">
    <LoadingOverlay :show="isSearchLoading" />

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">ゲームショップ</h1>
        <p class="hero-sub">NexStation5・FlipDual 2・XVertex の最新タイトルが揃う</p>

        <!-- Search -->
        <form id="search-form" class="search-form" @submit.prevent="handleSearch">
          <input
            id="search-input"
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="ゲームを検索... (タイトル・プラットフォーム)"
            :disabled="isSearchLoading"
            aria-label="ゲームを検索"
          />
          <button id="search-btn" type="submit" class="search-btn" :disabled="isSearchLoading">
            <span v-if="isSearchLoading" class="spinner spinner-sm"></span>
            <span v-else>🔍</span>
          </button>
          <button
            id="search-clear-btn"
            v-if="activeQuery"
            type="button"
            class="search-clear"
            @click="clearSearch"
          >✕ クリア</button>
        </form>
      </div>
    </section>

    <!-- Body: main content + ad sidebar -->
    <div class="home-body container">
      <!-- Main -->
      <div class="home-main">
        <!-- Filter bar -->
        <div id="filter-bar" class="filter-bar">
          <button
            v-for="filter in filters"
            :key="filter.value"
            :id="`filter-${filter.value}`"
            class="filter-btn"
            :class="{ active: activeFilter === filter.value }"
            @click="setFilter(filter.value)"
            :disabled="isFilterLoading"
          >
            {{ filter.label }}
          </button>
          <span id="result-count" class="result-count">{{ filteredProducts.length }}件</span>
        </div>

        <!-- Sort bar -->
        <div id="sort-bar" class="sort-bar">
          <span class="sort-label">並び替え：</span>
          <button
            v-for="s in sortOptions"
            :key="s.value"
            :id="`sort-${s.value}`"
            class="sort-btn"
            :class="{ active: sortOrder === s.value }"
            @click="sortOrder = s.value; currentPage = 1"
          >{{ s.label }}</button>
        </div>

        <!-- Active search info -->
        <div v-if="activeQuery" id="search-info" class="search-info">
          「<strong>{{ activeQuery }}</strong>」の検索結果：{{ filteredProducts.length }}件
        </div>

        <!-- Product grid -->
        <div>
          <div v-if="isFilterLoading" id="filter-loading" class="filter-loading">
            <div class="spinner"></div>
            <span>絞り込み中...</span>
          </div>

          <div v-else-if="displayedProducts.length > 0" id="product-grid" class="product-grid">
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

          <div class="scroll-loading" v-if="isScrollLoading">
            <div class="spinner"></div>
            <span>読み込み中...</span>
          </div>

          <div ref="sentinel" class="sentinel"></div>

          <div v-if="!hasMore && displayedProducts.length > 0" class="all-loaded">
            全 {{ sortedProducts.length }} 件を表示しました
          </div>
        </div>
      </div>

      <!-- Ad sidebar -->
      <aside id="ad-sidebar" class="home-ads">
        <div class="ad-header">PR・広告</div>
        <a
          v-if="currentAd"
          :id="`ad-banner-${currentAd.id}`"
          :href="currentAd.url"
          class="ad-banner"
          :style="{ borderColor: currentAd.color, background: currentAd.color + '18' }"
        >
          <div class="ad-icon">{{ currentAd.icon }}</div>
          <div class="ad-content">
            <div class="ad-title">{{ currentAd.title }}</div>
            <div class="ad-sub">{{ currentAd.sub }}</div>
          </div>
          <div class="ad-arrow">›</div>
        </a>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { store, getStock } from '../store/index.js'
import { reviewsData } from '../data/reviews.js'
import ProductCard from '../components/ProductCard.vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'

const PAGE_SIZE = 12

const searchQuery = ref('')
const activeQuery = ref('')
const activeFilter = ref('all')
const sortOrder = ref('default')
const currentPage = ref(1)
const isSearchLoading = ref(false)
const isFilterLoading = ref(false)
const isScrollLoading = ref(false)
const sentinel = ref(null)
const currentAd = ref(null)

const allAds = [
  { id: 1, icon: '🎮', title: 'ゲーム大特価セール！', sub: '今週限り最大50%OFF', color: '#6c63ff', url: 'https://store.playstation.com/ja-jp/' },
  { id: 2, icon: '🕹️', title: '新作ハード発売中！', sub: 'FlipDual 2 周辺機器が揃う', color: '#e60012', url: 'https://www.nintendo.com/jp/' },
  { id: 3, icon: '⚡', title: '限定版予約受付中！', sub: '在庫僅少、お早めに', color: '#f59e0b', url: 'https://www.xbox.com/ja-JP/' },
  { id: 4, icon: '💳', title: '新規会員500円OFF！', sub: '今すぐ無料会員登録', color: '#22c55e', url: 'https://kakaku.com/game/' },
  { id: 5, icon: '🏆', title: '人気ランキング更新！', sub: '今週の売れ筋TOP10', color: '#3b82f6', url: 'https://www.amazon.co.jp/s?i=videogames' },
]

const filters = [
  { value: 'all', label: 'すべて' },
  { value: 'NexStation5', label: 'NexStation5' },
  { value: 'FlipDual', label: 'FlipDual' },
  { value: 'FlipDual2', label: 'FlipDual 2' },
  { value: 'XVertex', label: 'XVertex' },
  { value: 'ハードウェア', label: 'ハードウェア' },
  { value: 'ゲームソフト', label: 'ゲームソフト' },
  { value: 'limited', label: '限定品' },
  { value: 'outofstock', label: '在庫切れ' },
]

const sortOptions = [
  { value: 'default', label: '標準' },
  { value: 'popular', label: '人気順' },
  { value: 'rating', label: '評価順' },
  { value: 'newest', label: '新着順' },
]

const filteredProducts = computed(() => {
  let list = store.products

  if (activeQuery.value) {
    const q = activeQuery.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.platform.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }

  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'limited') {
      list = list.filter(p => p.limited)
    } else if (activeFilter.value === 'outofstock') {
      list = list.filter(p => getStock(p.id) === 0)
    } else if (['NexStation5', 'FlipDual', 'FlipDual2', 'XVertex'].includes(activeFilter.value)) {
      list = list.filter(p => p.platform === activeFilter.value)
    } else {
      list = list.filter(p => p.category === activeFilter.value)
    }
  }

  return list
})

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value]
  switch (sortOrder.value) {
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return list.sort((a, b) => b.id - a.id)
    case 'popular':
      return list.sort((a, b) => (reviewsData[b.id]?.length || 0) - (reviewsData[a.id]?.length || 0))
    default:
      return list
  }
})

const displayedProducts = computed(() => {
  return sortedProducts.value.slice(0, currentPage.value * PAGE_SIZE)
})

const hasMore = computed(() => {
  return displayedProducts.value.length < sortedProducts.value.length
})

async function handleSearch() {
  const q = searchQuery.value.trim()
  if (!q) {
    activeQuery.value = ''
    currentPage.value = 1
    return
  }
  isSearchLoading.value = true
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

async function setFilter(value) {
  if (activeFilter.value === value) return
  isFilterLoading.value = true
  await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000))
  activeFilter.value = value
  currentPage.value = 1
  isFilterLoading.value = false
}

watch(activeFilter, () => {
  currentPage.value = 1
})

let observer = null

onMounted(() => {
  // Pick one random ad
  currentAd.value = allAds[Math.floor(Math.random() * allAds.length)]

  // Infinite scroll
  observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && hasMore.value && !isScrollLoading.value && !isSearchLoading.value) {
      isScrollLoading.value = true
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

.search-input::placeholder { color: var(--text-muted); }
.search-input:disabled { opacity: 0.6; cursor: wait; }

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

.search-btn:hover:not(:disabled) { background: var(--accent-hover); transform: scale(1.05); }
.search-btn:disabled { opacity: 0.7; cursor: wait; }

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

.search-clear:hover { border-color: var(--danger); color: var(--danger); }

/* Home body layout */
.home-body {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.home-main {
  flex: 1;
  min-width: 0;
}

/* Ad sidebar */
.home-ads {
  width: 190px;
  flex-shrink: 0;
  position: sticky;
  top: calc(var(--header-height) + var(--notice-height) + 12px);
  padding-top: 20px;
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ad-header {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
  margin-bottom: 2px;
}

.ad-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  text-decoration: none;
  transition: var(--transition);
  cursor: pointer;
}

.ad-banner:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
}

.ad-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.ad-content {
  flex: 1;
  min-width: 0;
}

.ad-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 2px;
}

.ad-sub {
  font-size: 10px;
  color: var(--text-muted);
  line-height: 1.3;
}

.ad-arrow {
  font-size: 14px;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* Sort bar */
.sort-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 10px;
  padding-bottom: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}
.sort-bar::-webkit-scrollbar { display: none; }

.sort-label {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.sort-btn {
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  transition: var(--transition);
  white-space: nowrap;
}
.sort-btn:hover { border-color: var(--accent); color: var(--accent); }
.sort-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }

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
.filter-btn:hover { border-color: var(--accent); color: var(--accent); }
.filter-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }

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
.search-info strong { color: var(--accent); }

/* Product grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px 0 32px;
}

/* Filter loading */
.filter-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
  color: var(--text-secondary);
  font-size: 14px;
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

.sentinel { height: 1px; }

.all-loaded {
  text-align: center;
  padding: 24px 0 40px;
  color: var(--text-muted);
  font-size: 13px;
  border-top: 1px solid var(--border);
  margin-top: 12px;
}

@media (max-width: 1100px) {
  .home-ads { display: none; }
}

@media (max-width: 640px) {
  .hero { padding: 32px 0 24px; }
  .search-form { flex-wrap: wrap; }
  .search-input { min-width: 0; }
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
}
</style>
