import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BUSINESS_NAME, WHATSAPP_NUMBER, formatPrice } from '../config'

const MODES = [
  { id: 'mesa', label: 'En mesa', icon: '🍽️' },
  { id: 'domicilio', label: 'Domicilio', icon: '🛵' },
]

export function buildWhatsAppUrl({ items, name, notes, mode, address, phone }) {
  const lines = items.map((i) => {
    const comment = i.comment?.trim()
    return comment ? `• ${i.qty} x ${i.name}\n   💬 ${comment}` : `• ${i.qty} x ${i.name}`
  })
  const modeLabel = MODES.find((m) => m.id === mode)
  const message = [
    `Hola ${BUSINESS_NAME}! 🍔 Quiero hacer un pedido:`,
    '',
    ...lines,
    '',
    modeLabel ? `${modeLabel.icon} *Tipo de pedido:* ${modeLabel.label}` : null,
    mode === 'domicilio' && address ? `📍 *Dirección:* ${address}` : null,
    mode === 'domicilio' && phone ? `📞 *Teléfono:* ${phone}` : null,
    name ? `👤 *Nombre:* ${name}` : null,
    notes ? `📝 *Notas:* ${notes}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n')

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function CartLine({ item, onAdd, onRemove, onComment }) {
  const [editing, setEditing] = useState(false)
  const hasComment = item.comment.trim().length > 0

  return (
    <motion.li
      layout
      className="cart-item"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60, height: 0 }}
    >
      <div className="cart-row">
        <img src={item.image} alt="" />
        <div className="cart-item-info">
          <strong>{item.name}</strong>
          <small>{formatPrice(item.price * item.qty)}</small>
        </div>
        <div className="qty small">
          <button onClick={() => onRemove(item.id)} aria-label="Quitar uno">
            −
          </button>
          <span>{item.qty}</span>
          <button onClick={() => onAdd(item.id)} aria-label="Agregar uno">
            +
          </button>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            className="comment-edit"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              autoFocus
              maxLength={120}
              value={item.comment}
              onChange={(e) => onComment(item.id, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
              placeholder="Ej: sin cebolla, salsa aparte…"
              aria-label={`Comentario para ${item.name}`}
            />
            <button type="button" onClick={() => setEditing(false)}>
              Listo
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="view"
            type="button"
            className={`comment-btn ${hasComment ? 'has' : ''}`}
            onClick={() => setEditing(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span aria-hidden="true">💬</span> {hasComment ? item.comment : 'Agregar comentario'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export default function CartDrawer({ open, onClose, items, total, onAdd, onRemove, onComment, onClear }) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [mode, setMode] = useState(null) // 'mesa' | 'domicilio'
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')

  const needsAddress = mode === 'domicilio'
  const phoneOk = phone.replace(/\D/g, '').length >= 7
  const canSend = mode !== null && (!needsAddress || (address.trim().length > 0 && phoneOk))

  let hint = null
  if (!mode) hint = 'Elige si es en mesa o a domicilio'
  else if (needsAddress && !address.trim()) hint = 'Escribe la dirección para el domicilio'
  else if (needsAddress && !phoneOk) hint = 'Escribe un teléfono de contacto válido'

  const send = () => {
    if (!canSend) return
    window.open(
      buildWhatsAppUrl({
        items,
        name: name.trim(),
        notes: notes.trim(),
        mode,
        address: address.trim(),
        phone: phone.trim(),
      }),
      '_blank',
      'noopener',
    )
    onClear()
    setNotes('')
    setMode(null)
    setAddress('')
    setPhone('')
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
                    <CartLine
                      key={it.id}
                      item={it}
                      onAdd={onAdd}
                      onRemove={onRemove}
                      onComment={onComment}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {items.length > 0 && (
              <div className="drawer-foot">
                <div className="mode-toggle" role="radiogroup" aria-label="Tipo de pedido">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={mode === m.id}
                      className={`mode-btn ${mode === m.id ? 'active' : ''}`}
                      onClick={() => setMode(m.id)}
                    >
                      {mode === m.id && (
                        <motion.span
                          layoutId="mode-bg"
                          className="mode-bg"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="mode-label">
                        <span aria-hidden="true">{m.icon}</span> {m.label}
                      </span>
                    </button>
                  ))}
                </div>

                <AnimatePresence initial={false}>
                  {needsAddress && (
                    <motion.label
                      key="address"
                      className="field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <span>Dirección de entrega *</span>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Calle, número, barrio, referencia"
                        autoComplete="street-address"
                      />
                    </motion.label>
                  )}
                  {needsAddress && (
                    <motion.label
                      key="phone"
                      className="field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <span>Teléfono de contacto *</span>
                      <input
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s()-]/g, ''))}
                        placeholder="Ej: 300 123 4567"
                        autoComplete="tel"
                        maxLength={20}
                      />
                    </motion.label>
                  )}
                </AnimatePresence>

                <label className="field">
                  <span>Tu nombre</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Carlos" />
                </label>
                <label className="field">
                  <span>Notas (sin cebolla, salsas, etc.)</span>
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
                {hint && <p className="hint">{hint}</p>}
                <motion.button
                  className="btn-wa"
                  onClick={send}
                  disabled={!canSend}
                  whileHover={canSend ? { scale: 1.03 } : undefined}
                  whileTap={canSend ? { scale: 0.96 } : undefined}
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
