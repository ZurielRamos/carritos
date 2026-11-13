import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TRANSFER } from '../config'

export const PAYMENTS = [
  { id: 'efectivo', label: 'Efectivo', icon: '💵' },
  { id: 'transferencia', label: 'Transferencia', icon: '🏦' },
]

// 50000 -> "50.000"
export const dots = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const BILLS = [10000, 20000, 50000, 100000]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Respaldo para navegadores sin Clipboard API
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <motion.button type="button" className="copy-btn" onClick={copy} whileTap={{ scale: 0.92 }} transition={{ duration: 0.1 }}>
      {copied ? '¡Copiado!' : 'Copiar'}
    </motion.button>
  )
}

export default function PaymentSection({ payment, onPayment, cash, onCash, total }) {
  // Sugerencias de billete: el pago justo y los billetes que cubren el total
  const quick = [total, ...BILLS.filter((b) => b > total).slice(0, 3)]

  return (
    <div className="pay">
      <p className="pay-question">¿Cómo vas a pagar?</p>

      <div className="mode-toggle" role="radiogroup" aria-label="Forma de pago">
        {PAYMENTS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={payment === p.id}
            className={`mode-btn ${payment === p.id ? 'active' : ''}`}
            onClick={() => onPayment(p.id)}
          >
            {payment === p.id && (
              <motion.span
                layoutId="pay-bg"
                className="mode-bg"
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            )}
            <span className="mode-label">
              <span aria-hidden="true">{p.icon}</span> {p.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {payment === 'efectivo' && (
          <motion.div
            key="cash"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden' }}
          >
            <label className="field">
              <span>¿Con cuánto vas a pagar? (para llevarte la vuelta) *</span>
              <div className="money-input">
                <b aria-hidden="true">$</b>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cash ? dots(cash) : ''}
                  onChange={(e) => onCash(e.target.value.replace(/\D/g, '').slice(0, 7))}
                  placeholder="Ej: 50.000"
                  aria-label="Monto con el que vas a pagar"
                />
              </div>
            </label>
            <div className="bills">
              {quick.map((v, i) => (
                <button
                  key={v}
                  type="button"
                  className={`bill ${Number(cash) === v ? 'active' : ''}`}
                  onClick={() => onCash(String(v))}
                >
                  {i === 0 ? 'Justo' : `$${dots(v)}`}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {payment === 'transferencia' && (
          <motion.div
            key="transfer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden' }}
          >
            {TRANSFER.account ? (
              <div className="pay-card">
                <p className="pay-card-title">Datos para transferir</p>
                {TRANSFER.bank && <p className="pay-bank">{TRANSFER.bank}</p>}
                {TRANSFER.name && <p className="pay-name">{TRANSFER.name}</p>}
                <div className="pay-account">
                  <strong>{TRANSFER.account}</strong>
                  <CopyButton text={TRANSFER.account} />
                </div>
                <p className="pay-note">Envía el comprobante por WhatsApp después de pedir.</p>
              </div>
            ) : (
              <p className="pay-note">Te enviaremos los datos de la cuenta por WhatsApp.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
