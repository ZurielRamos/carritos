import { AnimatePresence, motion } from 'framer-motion'
import { formatPrice } from '../config'

export default function DrinksSlider({ drinks, cart, onAdd, onRemove }) {
  return (
    <motion.section
      className="drinks"
      aria-label="Bebidas"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 110, damping: 16 }}
    >
      <h3 className="drinks-title">
        Bebidas <span aria-hidden="true">🥤</span>
      </h3>

      <div className="drinks-track">
        {drinks.map((d, i) => {
          const qty = cart[d.id] || 0
          return (
            <motion.article
              key={d.id}
              className="drink"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 130, damping: 16, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <div className="drink-media">
                <img src={d.image} alt={d.name} loading="lazy" draggable={false} />
                {d.badge && <span className="drink-badge">{d.badge}</span>}
                <div className="item-action">
                  <AnimatePresence mode="wait" initial={false}>
                    {qty === 0 ? (
                      <motion.button
                        key="add"
                        className="add-btn"
                        onClick={() => onAdd(d.id)}
                        initial={{ opacity: 0, y: 8, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.8 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ADD +
                      </motion.button>
                    ) : (
                      <motion.div
                        key="qty"
                        className="stepper"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                      >
                        <motion.button whileTap={{ scale: 0.75 }} onClick={() => onRemove(d.id)} aria-label="Quitar uno">
                          −
                        </motion.button>
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={qty}
                            initial={{ y: -12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 12, opacity: 0 }}
                          >
                            {qty}
                          </motion.span>
                        </AnimatePresence>
                        <motion.button whileTap={{ scale: 0.75 }} onClick={() => onAdd(d.id)} aria-label="Agregar uno">
                          +
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <h4 className="drink-name">{d.name}</h4>
              <p className="drink-price">{formatPrice(d.price)}</p>
            </motion.article>
          )
        })}
      </div>
    </motion.section>
  )
}
