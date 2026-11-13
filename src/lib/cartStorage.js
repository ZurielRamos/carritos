// Guarda el pedido en el navegador hasta que se envíe por WhatsApp.
const KEY = 'carritos:cart:v1'

const EMPTY = { cart: {}, comments: {} }

export function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!raw || typeof raw !== 'object') return EMPTY

    // Se valida todo: el contenido del almacenamiento no es de confianza
    const cart = {}
    for (const [id, qty] of Object.entries(raw.cart || {})) {
      const n = Number(qty)
      if (Number.isInteger(n) && n > 0 && n < 100) cart[id] = n
    }
    const comments = {}
    for (const [id, text] of Object.entries(raw.comments || {})) {
      if (cart[id] && typeof text === 'string') comments[id] = text.slice(0, 120)
    }
    return { cart, comments }
  } catch {
    return EMPTY
  }
}

export function saveCart(cart, comments) {
  try {
    if (Object.keys(cart).length === 0) localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, JSON.stringify({ cart, comments }))
  } catch {
    /* almacenamiento lleno o bloqueado: el pedido sigue funcionando en memoria */
  }
}
