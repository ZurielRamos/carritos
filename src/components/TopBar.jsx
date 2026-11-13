import { motion } from 'framer-motion'

export default function TopBar({ count, onCart }) {
  return (
    <motion.div
      className="topbar"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.img
        className="topbar-logo"
        src="/logo-sm.png"
        alt="Carritos Comidas Rápidas"
        width="46"
        height="46"
        initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      />
      <span className="topbar-title">Comidas Rápidas</span>
      <motion.button
        className="topbar-cart"
        onClick={onCart}
        whileTap={{ scale: 0.88 }}
        transition={{ duration: 0.1 }}
        aria-label={`Ver pedido, ${count} productos`}
      >
        🛒
        {count > 0 && (
          <motion.span
            key={count}
            className="topbar-count"
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            {count}
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  )
}
