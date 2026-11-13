import { motion } from 'framer-motion'
import { WHATSAPP_NUMBER, formatPhone } from '../config'

const HELLO = 'Hola Carritos! 🍔 Quisiera hacer una consulta.'

export default function Footer() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(HELLO)}`

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <img className="footer-logo" src="/logo-sm.png" alt="" width="64" height="64" loading="lazy" />
      <p className="footer-kicker">¿Tienes dudas o quieres pedir?</p>

      {WHATSAPP_NUMBER && (
        <motion.a
          className="footer-wa"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.1 }}
          aria-label={`Escribir por WhatsApp al ${formatPhone(WHATSAPP_NUMBER)}`}
        >
          <span className="footer-wa-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1a14 14 0 0 1-5.4-3.3 10 10 0 0 1-2-3.3c-.3-1-.1-1.9.5-2.6.2-.2.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.1.3 0 .5.5.9 1.2 1.6 2 2.2.8.5 1.3.8 1.7 1 .2.1.4.1.5-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.8-.1 1.2Z" />
            </svg>
          </span>
          <span className="footer-wa-text">
            <small>Escríbenos por WhatsApp</small>
            <strong>{formatPhone(WHATSAPP_NUMBER)}</strong>
          </span>
        </motion.a>
      )}

      <p className="footer-brand">Carritos · Comidas Rápidas</p>
    </motion.footer>
  )
}
