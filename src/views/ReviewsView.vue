<template>
  <div id="reviews-page" class="reviews-page">
    <div v-if="latestReviews.length > 0" id="reviews-container">
      <div id="reviews-list" class="reviews-list">
        <div
          v-for="review in latestReviews"
          :key="review.id"
          :id="`review-${review.id}`"
          class="review-item"
        >
          <div class="review-top">
            <span :id="`review-user-${review.id}`" class="reviewer-name">{{ review.userName }}</span>
            <span :id="`review-rating-${review.id}`" class="review-stars">{{ renderStars(review.rating) }}</span>
            <span :id="`review-date-${review.id}`" class="review-date">{{ review.date }}</span>
          </div>
          <p :id="`review-comment-${review.id}`" class="review-comment">{{ review.comment }}</p>
        </div>
      </div>
    </div>

    <div v-else id="no-reviews" class="no-reviews">
      まだレビューがありません
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { reviewsData } from '../data/reviews.js'

const route = useRoute()

const allReviews = computed(() => {
  const id = Number(route.params.id)
  return reviewsData[id] || []
})

const latestReviews = computed(() => {
  return [...allReviews.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

function renderStars(rating) {
  const full = Math.floor(rating)
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}

function sendHeight() {
  const h = document.body.scrollHeight
  window.parent.postMessage({ type: 'iframeHeight', height: h }, '*')
}

onMounted(() => {
  sendHeight()
  new ResizeObserver(sendHeight).observe(document.body)
})
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', sans-serif;
  background: #f8f8fc;
  color: #1a1a2e;
  font-size: 14px;
}
</style>

<style scoped>
.reviews-page {
  padding: 12px;
  background: #f8f8fc;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.review-item {
  background: #fff;
  border: 1px solid #e0e0f0;
  border-radius: 8px;
  padding: 12px 14px;
}

.review-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.reviewer-name {
  font-weight: 600;
  font-size: 13px;
  color: #333;
}

.review-stars {
  color: #f5c518;
  font-size: 12px;
}

.review-date {
  font-size: 11px;
  color: #aaa;
  margin-left: auto;
}

.review-comment {
  font-size: 13px;
  color: #444;
  line-height: 1.6;
}

.no-reviews {
  text-align: center;
  padding: 40px;
  color: #aaa;
}

.not-found {
  text-align: center;
  padding: 40px;
  color: #aaa;
}
</style>
