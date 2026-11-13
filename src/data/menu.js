import { PRODUCTS } from '../config'

// Los productos se editan en el archivo .env (VITE_PRODUCTS)
export const products = PRODUCTS

// Categorías generadas a partir de los productos
export const categories = ['Todas', ...new Set(products.map((p) => p.category))]
