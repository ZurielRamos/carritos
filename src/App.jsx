import { useMemo, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import TopBar from './components/TopBar'
import MenuItem from './components/MenuItem'
import DrinksSlider from './components/DrinksSlider'
import CartDrawer from './components/CartDrawer'
import { categories, products } from './data/menu'
import { formatPrice } from './config'

const DRINKS = 'Bebidas'

export default function App() {
  const [active, setActive] = useState('Todas')
  const [cart, setCart] = useState({}) // { [id]: qty }
  const [open, setOpen] = useState(false)

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const remove = (id) =>
    setCart((c) => {
      const next = { ...c, [id]: (c[id] || 0) - 1 }
      if (next[id] <= 0) delete next[id]
      return next
    })

  const drinks = useMemo(() => products.filter((p) => p.category === DRINKS), [])

  // En "Todas" las bebidas van en el slider, no en la lista
  const visible = useMemo(
    () =>
      active === 'Todas'
        ? products.filter((p) => p.category !== DRINKS)
        : products.filter((p) => p.category === active),
    [active],
  )

  const showDrinksSlider = active !== DRINKS && drinks.length > 0

  const items = useMemo(
    () => products.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] })),
    [cart],
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
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="pill-label">{c}</span>
                  </motion.button>
                ))}
              </nav>
            </LayoutGroup>

            <div className="items">
              <AnimatePresence mode="popLayout">
                {visible.map((p, i) => (
                  <MenuItem
                    key={p.id}
                    product={p}
                    index={i}
                    qty={cart[p.id] || 0}
                    onAdd={() => add(p.id)}
                    onRemove={() => remove(p.id)}
                  />
                ))}
              </AnimatePresence>
            </div>

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
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="cart-bar-handle" />
            <span className="cart-bar-left">
              <motion.span
                key={count}
                className="cart-bar-count"
                initial={{ scale: 1.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
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
        onClear={() => setCart({})}
      />
    </>
  )
}
