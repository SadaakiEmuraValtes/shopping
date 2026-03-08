<template>
  <div id="app-root">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<style>
/* ===== CSS Reset & Variables ===== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg-primary: #0f0f13;
  --bg-secondary: #16161f;
  --bg-card: #1e1e2d;
  --bg-card-hover: #252538;
  --text-primary: #f0f0f8;
  --text-secondary: #9090a8;
  --text-muted: #606070;
  --accent: #6c63ff;
  --accent-hover: #5a52e0;
  --accent-ps5: #003791;
  --accent-switch: #e60012;
  --accent-switch2: #cc0010;
  --accent-gold: #f5c518;
  --success: #22c55e;
  --danger: #ef4444;
  --warning: #f59e0b;
  --border: #2a2a3e;
  --border-light: #3a3a50;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  --shadow-hover: 0 8px 32px rgba(0, 0, 0, 0.7);
  --radius: 12px;
  --radius-sm: 8px;
  --radius-xs: 4px;
  --transition: all 0.2s ease;
  --header-height: 64px;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Noto Sans JP', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  font-family: inherit;
  border: none;
  background: none;
}

input, select, textarea {
  font-family: inherit;
}

img {
  max-width: 100%;
}

/* ===== Scrollbar ===== */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}
::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}

/* ===== Layout ===== */
#app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: var(--header-height);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  transition: var(--transition);
  white-space: nowrap;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}
.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}
.btn-secondary:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent);
}

.btn-danger {
  background: var(--danger);
  color: #fff;
}
.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-success {
  background: var(--success);
  color: #fff;
}
.btn-success:hover {
  background: #16a34a;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: var(--accent);
  border: 2px solid var(--accent);
}
.btn-outline:hover {
  background: var(--accent);
  color: #fff;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-lg {
  padding: 14px 28px;
  font-size: 16px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-block {
  width: 100%;
}

/* ===== Form ===== */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 15px;
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-select {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 15px;
  transition: var(--transition);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%239090a8' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

.form-select:focus {
  outline: none;
  border-color: var(--accent);
}

.form-error {
  color: var(--danger);
  font-size: 13px;
  margin-top: 4px;
}

/* ===== Badges / Tags ===== */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--danger);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  font-size: 12px;
  font-weight: 600;
}

.tag-ps5 {
  background: rgba(0, 55, 145, 0.4);
  color: #4d90ff;
  border: 1px solid rgba(0, 55, 145, 0.6);
}

.tag-switch {
  background: rgba(230, 0, 18, 0.2);
  color: #ff6060;
  border: 1px solid rgba(230, 0, 18, 0.4);
}

.tag-switch2 {
  background: rgba(204, 0, 16, 0.2);
  color: #ff4040;
  border: 1px solid rgba(204, 0, 16, 0.4);
}

.tag-limited {
  background: rgba(245, 197, 24, 0.2);
  color: var(--accent-gold);
  border: 1px solid rgba(245, 197, 24, 0.4);
}

.tag-sold-out {
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.4);
}

/* ===== Page heading ===== */
.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  padding: 24px 0 0;
}

/* ===== Spinner ===== */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(108, 99, 255, 0.3);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-sm {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

/* ===== Stars ===== */
.stars {
  color: var(--accent-gold);
  font-size: 13px;
  letter-spacing: 1px;
}

/* ===== Empty state ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: var(--text-muted);
}

.empty-state .empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 20px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

/* ===== Responsive ===== */
@media (max-width: 640px) {
  :root {
    --header-height: 56px;
  }
  .page-title {
    font-size: 20px;
  }
}
</style>
