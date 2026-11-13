import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import TopBar from './components/TopBar'
import MenuItem from './components/MenuItem'
import DrinksSlider from './components/DrinksSlider'
import CartDrawer from './components/CartDrawer'
import { useProducts } from './hooks/useProducts'
import { formatPrice } from './config'

const DRINKS = 'Bebidas'

export default function App() {
  const { products, categories } = useProducts()
  const [active, setActive] = useState('Todas')

  // Si la hoja cambia y la categoría elegida ya no existe, vuelve a "Todas"
  useEffect(() => {
    if (!categories.includes(active)) setActive('Todas')
  }, [categories, active])
  const [cart, setCart] = useState({}) // { [id]: qty }
  const [open, setOpen] = useState(false)

  const [comments, setComments] = useState({}) // { [id]: string }

  // Callbacks estables: así las tarjetas memorizadas no se re-renderizan al agregar un producto
  const add = useCallback((id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 })), [])
  const remove = useCallback(
    (id) =>
      setCart((c) => {
        const next = { ...c, [id]: (c[id] || 0) - 1 }
        if (next[id] <= 0) delete next[id]
        return next
      }),
    [],
  )
  const setComment = useCallback((id, text) => setComments((c) => ({ ...c, [id]: text })), [])

  // Si un producto sale del pedido, también se borra su comentario
  useEffect(() => {
    setComments((c) => {
      const stale = Object.keys(c).filter((id) => !cart[id])
      if (!stale.length) return c
      const next = { ...c }
      stale.forEach((id) => delete next[id])
      return next
    })
  }, [cart])

  const drinks = useMemo(() => products.filter((p) => p.category === DRINKS), [products])

  // En "Todas" las bebidas van en el slider, no en la lista
  const visible = useMemo(
    () =>
      active === 'Todas'
        ? products.filter((p) => p.category !== DRINKS)
        : products.filter((p) => p.category === active),
    [active, products],
  )

  const showDrinksSlider = active !== DRINKS && drinks.length > 0

  const items = useMemo(
    () =>
      products
        .filter((p) => cart[p.id])
        .map((p) => ({ ...p, qty: cart[p.id], comment: comments[p.id] || '' })),
    [cart, comments, products],
  )
  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.qty * i.price, 0)

  return (
    <>
      <div className="wood-bg" aria-hidden="true" />

      <div className="app">
        <TopBar count={count} onCart={() => setOpen(true)} />

        <div className="app-content">
          <section className="menu-sheet" aria-label="Menú">
            <h2 className="menu-title">
              Menú
              <motion.span
                className="menu-underline"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
            </h2>

            <LayoutGroup>
              <nav className="chips-row" aria-label="Categorías">
                {categories.map((c) => (
                  <motion.button
                    key={c}
                    className={`pill ${active === c ? 'active' : ''}`}
                    onClick={() => setActive(c)}
                    whileTap={{ scale: 0.92 }}
                  >
                    {active === c && (
                      <motion.span
                        layoutId="pill-bg"
                        className="pill-bg"
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                      />
                    )}
                    <span className="pill-label">{c}</span>
                  </motion.button>
                ))}
              </nav>
            </LayoutGroup>

            <motion.div
              key={active}
              className="items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}
            >
              {visible.map((p) => (
                <MenuItem
                  key={p.id}
                  product={p}
                  qty={cart[p.id] || 0}
                  onAdd={add}
                  onRemove={remove}
                />
              ))}
            </motion.div>

            {showDrinksSlider && (
              <DrinksSlider drinks={drinks} cart={cart} onAdd={add} onRemove={remove} />
            )}
          </section>

          <footer className="footer">
            <p>Carritos · Comidas Rápidas</p>
            <p>Pedidos directos por WhatsApp</p>
          </footer>
        </div>
      </div>

      <AnimatePresence>
        {count > 0 && !open && (
          <motion.button
            className="cart-bar"
            onClick={() => setOpen(true)}
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="cart-bar-handle" />
            <span className="cart-bar-left">
              <motion.span
                key={count}
                className="cart-bar-count"
                initial={{ scale: 1.35 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                {count}
              </motion.span>
              {count === 1 ? 'producto' : 'productos'}
            </span>
            <span className="cart-bar-right">
              VER PEDIDO · {formatPrice(total)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        total={total}
        onAdd={add}
        onRemove={remove}
        onComment={setComment}
        onClear={() => {
          setCart({})
          setComments({})
        }}
      />
    </>
  )
}
