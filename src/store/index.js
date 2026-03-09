import { reactive, watch } from 'vue'
import { productsData } from '../data/products.js'
import { defaultUsers } from '../data/users.js'

const SESSION_KEY = 'gameshop_v2'

function initUserProfiles() {
  const profiles = {}
  for (const user of defaultUsers) {
    profiles[user.id] = {
      favorites: [...(user.presetFavorites || [])],
      orders: user.presetOrders ? JSON.parse(JSON.stringify(user.presetOrders)) : [],
    }
  }
  return profiles
}

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
      userProfiles: s.userProfiles,
      users: s.users,
      stock: s.stock,
      lastOrderId: s.lastOrderId,
      userRatings: s.userRatings,
    }))
  } catch { /* quota exceeded etc */ }
}

const saved = load()

export const store = reactive({
  currentUser: saved?.currentUser ?? null,
  cart: saved?.cart ?? [],
  favorites: saved?.favorites ?? [],
  orders: saved?.orders ?? [],
  userProfiles: saved?.userProfiles ?? initUserProfiles(),
  users: saved?.users ?? JSON.parse(JSON.stringify(defaultUsers)),
  products: productsData,
  stock: saved?.stock ?? Object.fromEntries(productsData.map(p => [p.id, p.stock])),
  lastOrderId: saved?.lastOrderId ?? null,
  userRatings: saved?.userRatings ?? {},
})

watch(store, () => save(store), { deep: true, flush: 'sync' })

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
    // Save current user's data before switching
    if (store.currentUser) {
      store.userProfiles[store.currentUser.id] = {
        favorites: [...store.favorites],
        orders: [...store.orders],
      }
    }
    store.currentUser = { id: user.id, name: user.name, email: user.email }
    // Load new user's profile
    const profile = store.userProfiles[user.id]
    if (profile) {
      store.favorites = [...profile.favorites]
      store.orders = [...profile.orders]
    } else {
      store.favorites = [...(user.presetFavorites || [])]
      store.orders = user.presetOrders ? JSON.parse(JSON.stringify(user.presetOrders)) : []
    }
    return true
  }
  return false
}

export function logout() {
  if (store.currentUser) {
    store.userProfiles[store.currentUser.id] = {
      favorites: [...store.favorites],
      orders: [...store.orders],
    }
  }
  store.currentUser = null
  store.favorites = []
  store.orders = []
  store.lastOrderId = null
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
    presetFavorites: [],
    presetOrders: [],
  }
  store.users.push(newUser)
  if (store.currentUser) {
    store.userProfiles[store.currentUser.id] = {
      favorites: [...store.favorites],
      orders: [...store.orders],
    }
  }
  store.currentUser = { id: newUser.id, name: newUser.name, email: newUser.email }
  store.userProfiles[newUser.id] = { favorites: [], orders: [] }
  store.favorites = []
  store.orders = []
  return true
}

function generateOrderId() {
  const now = new Date()
  const pad = (n, d = 2) => String(n).padStart(d, '0')
  const datePart = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('')
  const rand = pad(Math.floor(Math.random() * 10000), 4)
  return `GS${datePart}${rand}`
}

export function placeOrder(shipping, payment) {
  const items = store.cart.map(i => ({
    productId: i.productId,
    quantity: i.quantity,
    price: getProduct(i.productId)?.price ?? 0,
    name: getProduct(i.productId)?.name ?? '',
    emoji: getProduct(i.productId)?.emoji ?? '',
  }))

  for (const item of store.cart) {
    store.stock[item.productId] = Math.max(0, (store.stock[item.productId] ?? 0) - item.quantity)
  }

  const order = {
    id: generateOrderId(),
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

export function getUserRating(productId) {
  if (!store.currentUser) return null
  const data = store.userRatings[store.currentUser.id]?.[productId]
  if (data == null) return null
  return typeof data === 'object' ? data.stars : data
}

export function getUserRatingData(productId) {
  if (!store.currentUser) return null
  const data = store.userRatings[store.currentUser.id]?.[productId]
  if (data == null) return null
  return typeof data === 'object' ? data : { stars: data, comment: '' }
}

export function setUserRating(productId, stars, comment = '') {
  if (!store.currentUser) return
  if (!store.userRatings[store.currentUser.id]) {
    store.userRatings[store.currentUser.id] = {}
  }
  store.userRatings[store.currentUser.id][productId] = { stars, comment }
}

export function getUserDefaultCard() {
  if (!store.currentUser) return null
  return store.users.find(u => u.id === store.currentUser.id)?.defaultCard ?? null
}
