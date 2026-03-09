<template>
  <div class="container checkout-page">
    <h1 class="page-title">購入手続き</h1>

    <!-- Step indicator -->
    <div class="steps">
      <div
        v-for="(s, i) in stepLabels"
        :key="i"
        class="step"
        :class="{
          active: step === i + 1,
          done: step > i + 1,
        }"
      >
        <div class="step-num">{{ step > i + 1 ? '✓' : i + 1 }}</div>
        <span class="step-label">{{ s }}</span>
      </div>
      <div class="step-line"></div>
    </div>

    <!-- Step 1: Shipping -->
    <div v-if="step === 1" id="step-shipping" class="step-content">
      <h2 class="step-title">配送先情報</h2>
      <form id="shipping-form" @submit.prevent="goStep2">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">お名前 <span class="required">*</span></label>
            <input id="input-name" v-model="shipping.name" type="text" class="form-input" placeholder="山田 太郎" required />
          </div>
          <div class="form-group">
            <label class="form-label">電話番号 <span class="required">*</span></label>
            <input id="input-phone" v-model="shipping.phone" type="tel" class="form-input" placeholder="090-0000-0000" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">郵便番号 <span class="required">*</span></label>
          <div class="postal-row">
            <input
              id="input-postal"
              v-model="shipping.postal"
              type="text"
              class="form-input"
              placeholder="1234567"
              required
              maxlength="8"
              style="max-width:180px"
              @input="onPostalInput"
            />
            <span v-if="postalLoading" class="postal-hint">住所取得中...</span>
            <span v-else-if="postalError" id="postal-error" class="postal-hint postal-error">{{ postalError }}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">都道府県 <span class="required">*</span></label>
          <select id="input-prefecture" v-model="shipping.prefecture" class="form-select" required style="max-width:200px">
            <option value="">選択してください</option>
            <option v-for="p in prefectures" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">市区町村・番地 <span class="required">*</span></label>
          <input id="input-address" v-model="shipping.address" type="text" class="form-input" placeholder="○○市○○町1-2-3" required />
        </div>
        <div class="form-group">
          <label class="form-label">建物名・部屋番号</label>
          <input id="input-building" v-model="shipping.building" type="text" class="form-input" placeholder="○○マンション 101号室" />
        </div>
        <div class="form-group">
          <label class="form-label">配送希望日</label>
          <input
            id="input-delivery-date"
            v-model="shipping.deliveryDate"
            type="date"
            class="form-input"
            :min="minDeliveryDate"
            :max="maxDeliveryDate"
            style="max-width:200px"
          />
        </div>
        <div class="step-btns">
          <RouterLink to="/cart" class="btn btn-secondary">← カートに戻る</RouterLink>
          <button id="btn-to-payment" type="submit" class="btn btn-primary">お支払い方法へ →</button>
        </div>
      </form>
    </div>

    <!-- Step 2: Payment -->
    <div v-if="step === 2" id="step-payment" class="step-content">
      <h2 class="step-title">お支払い方法</h2>

      <div class="payment-methods">
        <label
          v-for="method in paymentMethods"
          :key="method.value"
          class="payment-option"
          :class="{ active: payment.method === method.value }"
        >
          <input type="radio" v-model="payment.method" :value="method.value" style="display:none" />
          <span class="payment-icon">{{ method.icon }}</span>
          <div>
            <div class="payment-name">{{ method.name }}</div>
            <div class="payment-desc">{{ method.desc }}</div>
          </div>
        </label>
      </div>

      <!-- Credit card fields -->
      <div v-if="payment.method === 'credit'" class="card-fields">
        <div class="form-group">
          <label class="form-label">カード番号 <span class="required">*</span></label>
          <input v-model="payment.cardNumber" type="text" class="form-input" placeholder="0000 0000 0000 0000" maxlength="19" @input="formatCardNumber" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">有効期限 <span class="required">*</span></label>
            <input v-model="payment.expiry" type="text" class="form-input" placeholder="MM/YY" maxlength="5" />
          </div>
          <div class="form-group">
            <label class="form-label">セキュリティコード <span class="required">*</span></label>
            <input v-model="payment.cvv" type="text" class="form-input" placeholder="000" maxlength="4" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">カード名義人 <span class="required">*</span></label>
          <input v-model="payment.cardName" type="text" class="form-input" placeholder="TARO YAMADA" />
        </div>
      </div>

      <div v-else-if="payment.method === 'convenience'" class="payment-note">
        <p>🏪 ご注文後、お近くのコンビニエンスストアでお支払いください。</p>
        <p>お支払い番号は注文確認メールにてお送りします。</p>
      </div>

      <div v-else-if="payment.method === 'bank'" class="payment-note">
        <p>🏦 銀行振込先情報は注文確認メールにてお送りします。</p>
        <p>ご入金確認後、発送手続きを開始します。</p>
      </div>

      <div class="step-btns">
        <button id="btn-back-to-shipping" class="btn btn-secondary" @click="step = 1">← 配送先に戻る</button>
        <button id="btn-to-confirm" class="btn btn-primary" @click="goStep3" :disabled="!payment.method">注文確認へ →</button>
      </div>
    </div>

    <!-- Step 3: Confirm -->
    <div v-if="step === 3" id="step-confirm" class="step-content">
      <h2 class="step-title">注文確認</h2>

      <div class="confirm-grid">
        <!-- Shipping -->
        <div class="confirm-section">
          <h3 class="confirm-section-title">配送先</h3>
          <div class="confirm-info">
            <p>{{ shipping.name }}</p>
            <p>〒{{ shipping.postal }}</p>
            <p>{{ shipping.prefecture }}{{ shipping.address }}{{ shipping.building }}</p>
            <p>{{ shipping.phone }}</p>
            <p v-if="shipping.deliveryDate">配送希望日：{{ shipping.deliveryDate }}</p>
          </div>
          <button class="btn-edit" @click="step = 1">変更</button>
        </div>

        <!-- Payment -->
        <div class="confirm-section">
          <h3 class="confirm-section-title">お支払い方法</h3>
          <div class="confirm-info">
            <p>{{ selectedPaymentName }}</p>
            <p v-if="payment.method === 'credit' && payment.cardNumber">
              **** **** **** {{ payment.cardNumber.slice(-4) }}
            </p>
          </div>
          <button class="btn-edit" @click="step = 2">変更</button>
        </div>
      </div>

      <!-- Order items -->
      <div class="confirm-items">
        <h3 class="confirm-section-title">注文商品</h3>
        <div class="order-item" v-for="item in cartItems" :key="item.productId">
          <span class="order-emoji">{{ item.product.emoji }}</span>
          <span class="order-name">{{ item.product.name }}</span>
          <span class="order-qty">× {{ item.quantity }}</span>
          <span class="order-price">{{ formatPrice(item.product.price * item.quantity) }}</span>
        </div>
        <div class="order-total">
          <span>合計</span>
          <span class="order-total-price">{{ formatPrice(totalAmount) }}</span>
        </div>
      </div>

      <p v-if="cardLimitError" id="card-limit-error" class="form-error" style="margin-bottom:12px">{{ cardLimitError }}</p>

      <div class="step-btns">
        <button id="btn-back-to-payment" class="btn btn-secondary" @click="step = 2">← お支払いに戻る</button>
        <button id="btn-place-order" class="btn btn-success btn-lg" @click="handleOrder" :disabled="ordering">
          <span v-if="ordering" class="spinner spinner-sm"></span>
          {{ ordering ? '処理中...' : '注文を確定する' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store, getProduct, cartTotal, placeOrder, formatPrice, getUserDefaultCard } from '../store/index.js'

const router = useRouter()

const step = ref(1)
const ordering = ref(false)
const postalLoading = ref(false)
const postalError = ref('')

const stepLabels = ['配送先', 'お支払い', '確認']

const shipping = ref({
  name: store.currentUser?.name || '',
  phone: '',
  postal: '',
  prefecture: '',
  address: '',
  building: '',
  deliveryDate: '',
})

const payment = ref({
  method: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  cardName: '',
})

const cardLimitError = ref('')

onMounted(() => {
  const card = getUserDefaultCard()
  if (card) {
    payment.value.method = 'credit'
    payment.value.cardNumber = card.number
    payment.value.expiry = card.expiry
    payment.value.cardName = card.cardName
  }
})

const paymentMethods = [
  { value: 'credit', icon: '💳', name: 'クレジットカード', desc: 'Visa / Mastercard / JCB' },
  { value: 'convenience', icon: '🏪', name: 'コンビニ払い', desc: 'セブン・ファミマ・ローソン等' },
  { value: 'bank', icon: '🏦', name: '銀行振込', desc: '各種銀行対応' },
]

const prefectures = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
  '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
]

const minDeliveryDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

const maxDeliveryDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().split('T')[0]
})

const cartItems = computed(() =>
  store.cart.map(item => ({ ...item, product: getProduct(item.productId) })).filter(i => i.product)
)

const totalAmount = computed(() => cartTotal())

const selectedPaymentName = computed(() => {
  const m = paymentMethods.find(p => p.value === payment.value.method)
  return m ? m.name : ''
})

let postalTimer = null

function onPostalInput() {
  postalError.value = ''
  const digits = shipping.value.postal.replace(/\D/g, '')
  if (digits.length !== 7) return
  clearTimeout(postalTimer)
  postalTimer = setTimeout(() => fetchAddress(digits), 400)
}

async function fetchAddress(zipcode) {
  postalLoading.value = true
  postalError.value = ''
  try {
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`)
    const data = await res.json()
    if (data.results && data.results.length > 0) {
      const r = data.results[0]
      shipping.value.prefecture = r.address1
      shipping.value.address = r.address2 + r.address3
    } else {
      postalError.value = '郵便番号が見つかりません'
    }
  } catch {
    postalError.value = '住所取得に失敗しました'
  } finally {
    postalLoading.value = false
  }
}

function formatCardNumber(e) {
  let val = e.target.value.replace(/\D/g, '').substring(0, 16)
  payment.value.cardNumber = val.replace(/(.{4})/g, '$1 ').trim()
}

function goStep2() {
  step.value = 2
}

function goStep3() {
  if (!payment.value.method) return
  if (payment.value.method === 'credit') {
    if (!payment.value.cardNumber || !payment.value.expiry || !payment.value.cvv) {
      alert('カード情報を入力してください')
      return
    }
  }
  step.value = 3
}

async function handleOrder() {
  cardLimitError.value = ''
  // Check card limit
  if (payment.value.method === 'credit') {
    const card = getUserDefaultCard()
    if (card?.cardLimit && totalAmount.value > card.cardLimit) {
      cardLimitError.value = `カードの利用可能額（${formatPrice(card.cardLimit)}）を超えています。別のお支払い方法をお選びください。`
      return
    }
  }
  ordering.value = true
  await new Promise(r => setTimeout(r, 1200))

  const paymentInfo = {
    method: payment.value.method,
    methodName: selectedPaymentName.value,
    ...(payment.value.method === 'credit'
      ? { last4: payment.value.cardNumber.slice(-4) }
      : {}),
  }

  placeOrder({ ...shipping.value }, paymentInfo)
  ordering.value = false
  router.push('/order-complete')
}
</script>

<style scoped>
.checkout-page {
  padding-bottom: 80px;
}

/* Steps */
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 40px;
  position: relative;
}

.step-line {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 100px);
  height: 2px;
  background: var(--border-light);
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  z-index: 1;
}

.step-num {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 2px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  transition: var(--transition);
}

.step.active .step-num {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.step.done .step-num {
  background: var(--success);
  border-color: var(--success);
  color: #fff;
}

.step-label {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.step.active .step-label {
  color: var(--text-primary);
  font-weight: 600;
}

/* Step content */
.step-content {
  max-width: 640px;
  margin: 0 auto;
}

.step-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.required {
  color: var(--danger);
}

.postal-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.postal-hint {
  font-size: 13px;
  color: var(--text-muted);
}

.postal-error {
  color: var(--danger);
}

.step-btns {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 28px;
  flex-wrap: wrap;
}

/* Payment */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
}

.payment-option:hover {
  border-color: var(--border-light);
}

.payment-option.active {
  border-color: var(--accent);
  background: rgba(108, 99, 255, 0.05);
}

.payment-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.payment-name {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 2px;
}

.payment-desc {
  font-size: 13px;
  color: var(--text-muted);
}

.card-fields {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 20px;
  margin-bottom: 16px;
}

.payment-note {
  background: rgba(108, 99, 255, 0.05);
  border: 1px solid rgba(108, 99, 255, 0.2);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin-bottom: 16px;
}

.payment-note p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

/* Confirm */
.confirm-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.confirm-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 16px;
  position: relative;
}

.confirm-section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.confirm-info p {
  font-size: 14px;
  margin-bottom: 3px;
  color: var(--text-primary);
}

.btn-edit {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 12px;
  color: var(--accent);
  text-decoration: underline;
}

.confirm-items {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 20px;
  margin-bottom: 24px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.order-emoji {
  font-size: 24px;
}

.order-name {
  flex: 1;
}

.order-qty {
  color: var(--text-muted);
  font-size: 13px;
}

.order-price {
  font-weight: 600;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  font-weight: 700;
  font-size: 17px;
}

.order-total-price {
  color: var(--accent);
  font-size: 22px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .confirm-grid {
    grid-template-columns: 1fr;
  }
  .steps {
    gap: 0;
  }
  .step-label {
    font-size: 11px;
  }
}
</style>
