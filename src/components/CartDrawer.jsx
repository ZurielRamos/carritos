import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BUSINESS_NAME, WHATSAPP_NUMBER, formatPrice } from '../config'

export function buildWhatsAppUrl({ items, total, name, notes }) {
  const lines = items.map(
    (i) => `• ${i.qty} x ${i.name} — ${formatPrice(i.price * i.qty)}`,
  )
  const message = [
    `Hola ${BUSINESS_NAME}! 🍔 Quiero hacer un pedido:`,
    '',
    ...lines,
    '',
    `*Total: ${formatPrice(total)}*`,
    name ? `Nombre: ${name}` : null,
    notes ? `Notas: ${notes}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n')

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export default function CartDrawer({ open, onClose, items, total, onAdd, onRemove, onClear }) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  const send = () => {
    window.open(buildWhatsAppUrl({ items, total, name: name.trim(), notes: notes.trim() }), '_blank', 'noopener')
    onClear()
    setNotes('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="drawer"
            role="dialog"
            aria-label="Tu pedido"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <div className="drawer-head">
              <h2>TU PEDIDO</h2>
              <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <div className="empty">
                <motion.span
                  className="big"
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🍔
                </motion.span>
                Aún no has agregado nada. ¡Elige tu hamburguesa favorita!
              </div>
            ) : (
              <ul className="drawer-list">
                <AnimatePresence initial={false}>
                  {items.map((it) => (
                    <motion.li
                      key={it.id}
                      layout
                      className="cart-item"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60, height: 0 }}
                    >
                      <img src={it.image} alt="" />
                      <div className="cart-item-info">
                        <strong>{it.name}</strong>
                        <small>{formatPrice(it.price * it.qty)}</small>
                      </div>
                      <div className="qty small">
                        <button onClick={() => onRemove(it.id)} aria-label="Quitar uno">
                          −
                        </button>
                        <span>{it.qty}</span>
                        <button onClick={() => onAdd(it.id)} aria-label="Agregar uno">
                          +
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {items.length > 0 && (
              <div className="drawer-foot">
                <label className="field">
                  <span>Tu nombre</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Carlos" />
                </label>
                <label className="field">
                  <span>Notas (sin cebolla, dirección, etc.)</span>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Opcional"
                  />
                </label>
                <div className="total">
                  TOTAL
                  <motion.strong key={total} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>
                    {formatPrice(total)}
                  </motion.strong>
                </div>
                <motion.button
                  className="btn-wa"
                  onClick={send}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1a14 14 0 0 1-5.4-3.3 10 10 0 0 1-2-3.3c-.3-1-.1-1.9.5-2.6.2-.2.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.1.3 0 .5.5.9 1.2 1.6 2 2.2.8.5 1.3.8 1.7 1 .2.1.4.1.5-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.8-.1 1.2Z" />
                  </svg>
                  PEDIR POR WHATSAPP
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
