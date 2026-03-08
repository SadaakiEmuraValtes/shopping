<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="search-overlay" role="status" aria-live="polite">
        <div class="overlay-content">
          <div class="overlay-spinner"></div>
          <p class="overlay-text">検索中...</p>
          <p class="overlay-sub">少々お待ちください</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
})
</script>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 10, 16, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: wait;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  pointer-events: none;
}

.overlay-spinner {
  width: 64px;
  height: 64px;
  border: 4px solid rgba(108, 99, 255, 0.25);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.overlay-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.overlay-sub {
  font-size: 14px;
  color: var(--text-secondary);
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
