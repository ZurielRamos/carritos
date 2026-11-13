import { useEffect, useMemo, useState } from 'react'
import { PRODUCTS, SHEET_CSV_URL } from '../config'
import { fetchSheetProducts } from '../lib/sheet'

const CACHE_KEY = 'carritos:products:v1'

function readCache() {
  try {
    const list = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    return Array.isArray(list) && list.length ? list : null
  } catch {
    return null
  }
}

/**
 * Productos del menú.
 * - Sin VITE_SHEET_CSV_URL: usa src/data/products.json.
 * - Con la URL: muestra al instante la última copia guardada (o el JSON) y
 *   se actualiza cuando llega la hoja de Google Sheets.
 */
export function useProducts() {
  const [products, setProducts] = useState(() => (SHEET_CSV_URL && readCache()) || PRODUCTS)

  useEffect(() => {
    if (!SHEET_CSV_URL) return
    const controller = new AbortController()

    fetchSheetProducts(SHEET_CSV_URL, controller.signal)
      .then((list) => {
        if (!list.length) return
        setProducts(list)
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(list))
        } catch {
          /* almacenamiento lleno o bloqueado: se ignora */
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.warn('Google Sheets:', err.message)
      })

    return () => controller.abort()
  }, [])

  const categories = useMemo(
    () => ['Todas', ...new Set(products.map((p) => p.category))],
    [products],
  )

  return { products, categories }
}
