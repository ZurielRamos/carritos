import { AnimatePresence, motion } from 'framer-motion'
import { formatPrice } from '../config'

export default function MenuItem({ product, qty, onAdd, onRemove, index }) {
  return (
    <motion.article
      layout
      className="item"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 130, damping: 18, delay: (index % 4) * 0.05 }}
    >
      <div className="item-info">
        <h3 className="item-name">
          {product.name}
          {product.badge && <span className="item-badge">{product.badge}</span>}
        </h3>
        <motion.p
          className="item-price"
          key={product.price}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          {formatPrice(product.price)}
        </motion.p>
        {product.ingredients.length > 0 && (
          <p className="item-desc">{product.ingredients.join(' · ')}</p>
        )}
      </div>

      <div className="item-media">
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          whileHover={{ scale: 1.06, rotate: -2 }}
          whileTap={{ scale: 0.97 }}
        />
        <div className="item-action">
          <AnimatePresence mode="wait" initial={false}>
            {qty === 0 ? (
              <motion.button
                key="add"
                className="add-btn"
                onClick={onAdd}
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
                <motion.button whileTap={{ scale: 0.75 }} onClick={onRemove} aria-label="Quitar uno">
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
                <motion.button whileTap={{ scale: 0.75 }} onClick={onAdd} aria-label="Agregar uno">
                  +
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  )
}
