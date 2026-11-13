import { memo } from 'react'
import { motion } from 'framer-motion'
import { formatPrice } from '../config'

// Solo transform y opacity (se animan en la GPU, sin recalcular el layout)
const enter = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

function MenuItem({ product, qty, onAdd, onRemove }) {
  return (
    <motion.article
      className="item"
      variants={enter}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className="item-info">
        <h3 className="item-name">
          {product.name}
          {product.badge && <span className="item-badge">{product.badge}</span>}
        </h3>
        <p className="item-price">{formatPrice(product.price)}</p>
        {product.ingredients.length > 0 && (
          <p className="item-desc">{product.ingredients.join(' · ')}</p>
        )}
      </div>

      <div className="item-media">
        <img src={product.image} alt={product.name} loading="lazy" decoding="async" width="120" height="120" />
        <div className="item-action">
          {qty === 0 ? (
            <motion.button
              className="add-btn"
              onClick={() => onAdd(product.id)}
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
                onClick={() => onRemove(product.id)}
                aria-label="Quitar uno"
              >
                −
              </motion.button>
              <span>{qty}</span>
              <motion.button
                whileTap={{ scale: 0.82 }}
                transition={{ duration: 0.1 }}
                onClick={() => onAdd(product.id)}
                aria-label="Agregar uno"
              >
                +
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default memo(MenuItem)
