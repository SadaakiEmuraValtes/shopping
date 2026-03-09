import { createRouter, createWebHashHistory } from 'vue-router'
import { store } from '../store/index.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('../views/ProductDetailView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/order-complete',
    name: 'order-complete',
    component: () => import('../views/OrderCompleteView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-page',
    name: 'my-page',
    component: () => import('../views/MyPageView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../views/FavoritesView.vue'),
  },
  {
    path: '/purchase-history',
    name: 'purchase-history',
    component: () => import('../views/PurchaseHistoryView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reviews/:id',
    name: 'reviews',
    component: () => import('../views/ReviewsView.vue'),
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('../views/HelpView.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

let initialNavigationDone = false

router.beforeEach((to, from, next) => {
  // Force full browser load on every navigation after the initial page load
  if (initialNavigationDone) {
    window.location.href = import.meta.env.BASE_URL + '?_t=' + Date.now() + '#' + to.fullPath
    next(false)
    return
  }
  if (to.meta.requiresAuth && !store.currentUser) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

router.afterEach(() => {
  initialNavigationDone = true
})

export default router
