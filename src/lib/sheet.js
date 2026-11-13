// Lee el menú desde una hoja de Google Sheets "Publicada en la web" como CSV.
// No usa Google Cloud ni llaves de API.

const DEFAULT_CATEGORY = 'Comidas'
const DEFAULT_IMAGE = '/burger.jpg'
const DEFAULT_DRINK_IMAGE = '/bebida.webp'

/** Parser CSV mínimo: soporta comillas, comas y saltos de línea dentro de celdas. */
export function parseCSV(text) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false
  const src = text.replace(/^\uFEFF/, '')

  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (inQuotes) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        cell += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else {
      cell += ch
    }
  }
  if (cell !== '' || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

// Nombres de columna aceptados (sin tildes, en minúscula)
const COLUMNS = {
  name: ['producto', 'nombre'],
  price: ['precio'],
  ingredients: ['contiene', 'ingredientes'],
  category: ['categoria'],
  badge: ['etiqueta', 'badge'],
  image: ['imagen', 'foto', 'image'],
}

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

const slug = (s) =>
  normalize(s)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Convierte las filas del CSV en productos para el menú. */
export function rowsToProducts(rows) {
  if (rows.length < 2) return []

  const header = rows[0].map(normalize)
  const col = {}
  for (const [key, aliases] of Object.entries(COLUMNS)) {
    col[key] = header.findIndex((h) => aliases.includes(h))
  }
  if (col.name === -1 || col.price === -1) {
    throw new Error('La hoja necesita las columnas PRODUCTO y PRECIO')
  }

  const get = (row, key) => (col[key] >= 0 ? (row[col[key]] ?? '').trim() : '')
  const usedIds = new Set()
  const products = []

  for (const row of rows.slice(1)) {
    const name = get(row, 'name')
    const price = parseInt(get(row, 'price').replace(/\D/g, ''), 10)
    if (!name || Number.isNaN(price)) continue // fila vacía o sin precio

    let id = slug(name) || `item-${products.length}`
    while (usedIds.has(id)) id += '-2'
    usedIds.add(id)

    const category = get(row, 'category') || DEFAULT_CATEGORY
    const badge = get(row, 'badge')
    const image =
      get(row, 'image') || (normalize(category) === 'bebidas' ? DEFAULT_DRINK_IMAGE : DEFAULT_IMAGE)

    products.push({
      id,
      category,
      name,
      ingredients: get(row, 'ingredients')
        .split(/[,;\n]/)
        .map((s) => capitalize(s.trim()))
        .filter(Boolean),
      price,
      ...(badge && { badge }),
      image,
    })
  }
  return products
}

export async function fetchSheetProducts(url, signal) {
  const res = await fetch(url, { signal, cache: 'no-store' })
  if (!res.ok) throw new Error(`No se pudo leer la hoja (HTTP ${res.status})`)
  return rowsToProducts(parseCSV(await res.text()))
}
