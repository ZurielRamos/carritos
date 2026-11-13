import productsData from './data/products.json'
import { slug } from './lib/sheet'

// El número viene del archivo .env (VITE_WHATSAPP_NUMBER)
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')

// Enlace CSV de la hoja de Google Sheets publicada en la web (opcional)
export const SHEET_CSV_URL = (import.meta.env.VITE_SHEET_CSV_URL || '').trim()

export const BUSINESS_NAME = 'Carritos'

// Imagen por defecto si un producto no trae `image`
export const PLACEHOLDER_IMAGE = '/burger.jpg'

// Los productos se editan en src/data/products.json.
// El id sale del nombre (igual que con Google Sheets), así el carrito guardado
// sigue siendo válido aunque el menú cambie de fuente.
const usedIds = new Set()
export const PRODUCTS = productsData.map((p) => {
  let id = slug(p.name) || String(p.id)
  while (usedIds.has(id)) id += '-2'
  usedIds.add(id)
  return {
    ...p,
    id,
    ingredients: p.ingredients ?? [],
    image: p.image || PLACEHOLDER_IMAGE,
  }
})

// 573145058570 -> "+57 314 505 8570"
export function formatPhone(digits) {
  const m = digits.match(/^57(\d{3})(\d{3})(\d{4})$/)
  return m ? `+57 ${m[1]} ${m[2]} ${m[3]}` : digits ? `+${digits}` : ''
}

export const formatPrice = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)

// Datos de la cuenta para pagos por transferencia (se editan en el .env)
export const TRANSFER = {
  bank: (import.meta.env.VITE_TRANSFER_BANK || '').trim(),
  name: (import.meta.env.VITE_TRANSFER_NAME || '').trim(),
  account: (import.meta.env.VITE_TRANSFER_ACCOUNT || '').trim(),
}
