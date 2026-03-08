import { reactive, watch } from 'vue'
import { productsData } from '../data/products.js'
import { defaultUsers } from '../data/users.js'

const SESSION_KEY = 'gameshop_v1'

function load() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(s) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      currentUser: s.currentUser,
      cart: s.cart,
      favorites: s.favorites,
      orders: s.orders,
      users: s.users,
      stock: s.stock,
    }))
  } catch { /* quota exceeded etc */ }
}

const saved = load()

export const store = reactive({
  currentUser: saved?.currentUser ?? null,
  cart: saved?.cart ?? [],       // [{ productId, quantity }]
  favorites: saved?.favorites ?? [], // [productId, ...]
  orders: saved?.orders ?? [],   // [{ id, items, shipping, payment, total, createdAt }]
  users: saved?.users ?? JSON.parse(JSON.stringify(defaultUsers)),
  products: productsData,
  stock: saved?.stock ?? Object.fromEntries(productsData.map(p => [p.id, p.stock])),
  lastOrderId: saved?.lastOrderId ?? null,
})

watch(store, () => save(store), { deep: true })

// ---- Helpers ----

export function getProduct(id) {
  return store.products.find(p => p.id === Number(id))
}

export function getStock(productId) {
  return store.stock[productId] ?? 0
}

export function addToCart(productId, quantity = 1) {
  const available = getStock(productId)
  if (available <= 0) return false
  const existing = store.cart.find(i => i.productId === productId)
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, available)
  } else {
    store.cart.push({ productId, quantity: Math.min(quantity, available) })
  }
  return true
}

export function removeFromCart(productId) {
  const idx = store.cart.findIndex(i => i.productId === productId)
  if (idx !== -1) store.cart.splice(idx, 1)
}

export function updateCartQuantity(productId, quantity) {
  const item = store.cart.find(i => i.productId === productId)
  if (item) {
    const available = getStock(productId)
    item.quantity = Math.max(1, Math.min(quantity, available))
  }
}

export function toggleFavorite(productId) {
  const idx = store.favorites.indexOf(productId)
  if (idx !== -1) {
    store.favorites.splice(idx, 1)
  } else {
    store.favorites.push(productId)
  }
}

export function isFavorite(productId) {
  return store.favorites.includes(productId)
}

export function cartCount() {
  return store.cart.reduce((sum, i) => sum + i.quantity, 0)
}

export function cartTotal() {
  return store.cart.reduce((sum, i) => {
    const p = getProduct(i.productId)
    return sum + (p ? p.price * i.quantity : 0)
  }, 0)
}

export function login(email, password) {
  const user = store.users.find(u => u.email === email && u.password === password)
  if (user) {
    store.currentUser = { id: user.id, name: user.name, email: user.email }
    return true
  }
  return false
}

export function logout() {
  store.currentUser = null
}

export function register(name, email, password) {
  if (store.users.find(u => u.email === email)) return false
  const newId = Math.max(0, ...store.users.map(u => u.id)) + 1
  const newUser = {
    id: newId,
    name,
    email,
    password,
    createdAt: new Date().toISOString().split('T')[0],
  }
  store.users.push(newUser)
  store.currentUser = { id: newUser.id, name: newUser.name, email: newUser.email }
  return true
}

export function placeOrder(shipping, payment) {
  const items = store.cart.map(i => ({
    productId: i.productId,
    quantity: i.quantity,
    price: getProduct(i.productId)?.price ?? 0,
    name: getProduct(i.productId)?.name ?? '',
    emoji: getProduct(i.productId)?.emoji ?? '',
  }))

  // reduce stock
  for (const item of store.cart) {
    store.stock[item.productId] = Math.max(0, (store.stock[item.productId] ?? 0) - item.quantity)
  }

  const order = {
    id: Date.now(),
    items,
    shipping,
    payment,
    total: cartTotal(),
    createdAt: new Date().toISOString(),
  }

  store.orders.push(order)
  store.lastOrderId = order.id
  store.cart = []
  return order
}

export function formatPrice(price) {
  return `¥${price.toLocaleString('ja-JP')}`
}
