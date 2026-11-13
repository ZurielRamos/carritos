import productsData from './data/products.json'

// El número viene del archivo .env (VITE_WHATSAPP_NUMBER)
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')

// Enlace CSV de la hoja de Google Sheets publicada en la web (opcional)
export const SHEET_CSV_URL = (import.meta.env.VITE_SHEET_CSV_URL || '').trim()

export const BUSINESS_NAME = 'Carritos'

// Imagen por defecto si un producto no trae `image`
export const PLACEHOLDER_IMAGE = '/burger.jpg'

// Los productos se editan en src/data/products.json
export const PRODUCTS = productsData.map((p) => ({
  ...p,
  ingredients: p.ingredients ?? [],
  image: p.image || PLACEHOLDER_IMAGE,
}))

export const formatPrice = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
