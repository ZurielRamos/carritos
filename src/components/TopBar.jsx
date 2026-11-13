import { motion } from 'framer-motion'

export default function TopBar({ count, onCart }) {
  return (
    <motion.div
      className="topbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
    >
      <motion.img
        className="topbar-logo"
        src="/logo.png"
        alt="Carritos Comidas Rápidas"
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', delay: 0.2, stiffness: 90 }}
        whileHover={{ rotate: 12, scale: 1.1 }}
      />
      <span className="topbar-title">Comidas Rápidas</span>
      <motion.button
        className="topbar-cart"
        onClick={onCart}
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.08 }}
        aria-label={`Ver pedido, ${count} productos`}
      >
        🛒
        {count > 0 && (
          <motion.span
            key={count}
            className="topbar-count"
            initial={{ scale: 2 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            {count}
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  )
}
