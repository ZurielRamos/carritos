import { memo } from 'react'
import { motion } from 'framer-motion'
import { formatPrice } from '../config'

function DrinksSlider({ drinks, cart, onAdd, onRemove }) {
  return (
    <section className="drinks" aria-label="Bebidas">
      <h3 className="drinks-title">
        Bebidas <span aria-hidden="true">🥤</span>
      </h3>

      <div className="drinks-track">
        {drinks.map((d) => {
          const qty = cart[d.id] || 0
          return (
            <article key={d.id} className="drink">
              <div className="drink-media">
                <img src={d.image} alt={d.name} loading="lazy" decoding="async" draggable={false} width="132" height="132" />
                {d.badge && <span className="drink-badge">{d.badge}</span>}
                <div className="item-action">
                  {qty === 0 ? (
                    <motion.button
                      className="add-btn"
                      onClick={() => onAdd(d.id)}
                      whileTap={{ scale: 0.92 }}
                      transition={{ duration: 0.1 }}
                    >
                      ADD +
                    </motion.button>
                  ) : (
                    <div className="stepper">
                      <motion.button
                        whileTap={{ scale: 0.82 }}
                        transition={{ duration: 0.1 }}
                        onClick={() => onRemove(d.id)}
                        aria-label="Quitar uno"
                      >
                        −
                      </motion.button>
                      <span>{qty}</span>
                      <motion.button
                        whileTap={{ scale: 0.82 }}
                        transition={{ duration: 0.1 }}
                        onClick={() => onAdd(d.id)}
                        aria-label="Agregar uno"
                      >
                        +
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
              <h4 className="drink-name">{d.name}</h4>
              <p className="drink-price">{formatPrice(d.price)}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default memo(DrinksSlider)
