// Genera una imagen cuadrada con el QR del menú, lista para imprimir.
//
// Uso:
//   npm run qr                      -> usa VITE_SITE_URL del .env
//   npm run qr -- https://otro.com  -> usa otra URL
//
// Salida: print/qr-carritos.png (2400 x 2400 px)

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'
import QRCode from 'qrcode'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function readEnvUrl() {
  try {
    const env = fs.readFileSync(path.join(root, '.env'), 'utf8')
    return env.match(/^VITE_SITE_URL=(.+)$/m)?.[1].trim()
  } catch {
    return undefined
  }
}

const url = (process.argv[2] || readEnvUrl() || '').replace(/\/+$/, '') + '/'
if (!/^https?:\/\/.+\..+/.test(url)) {
  console.error('Falta una URL válida. Ej: npm run qr -- https://mi-sitio.com')
  process.exit(1)
}

const chrome =
  process.env.CHROME_PATH ||
  [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => fs.existsSync(p))
if (!chrome) {
  console.error('No encontré Chrome. Define CHROME_PATH con la ruta del ejecutable.')
  process.exit(1)
}

// Nivel H tolera hasta ~30 % de daño: permite el logo al centro y papel gastado
const qrSvg = await QRCode.toString(url, {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 0,
  color: { dark: '#0a2259', light: '#ffffff' },
})

const file = (p) => pathToFileURL(path.join(root, p)).href

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Pacifico&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 1200px; overflow: hidden; }
  body {
    position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: #5e3a20 url('${file('public/wood.jpg')}') center / cover no-repeat;
    font-family: 'Poppins', sans-serif; color: #fff4e0;
  }
  .frame { position: absolute; inset: 28px; border: 6px solid #d2a56c; border-radius: 56px; opacity: .85; }
  .logo { width: 168px; height: 168px; border-radius: 50%; background: #fff; padding: 6px;
    box-shadow: 0 14px 30px rgba(0,0,0,.55), 0 0 0 6px #d2a56c; }
  h1 { margin-top: 24px; font-family: 'Bebas Neue', sans-serif; font-weight: 400; font-size: 112px; line-height: .95;
    letter-spacing: 4px; text-shadow: 0 5px 0 #0a2259, 0 12px 24px rgba(0,0,0,.6); }
  h1 span { color: #f29a2e; }
  .qr-card { position: relative; margin-top: 22px; width: 520px; height: 520px; padding: 34px; background: #fff;
    border-radius: 48px; border: 8px solid #d2a56c; box-shadow: 0 22px 48px rgba(0,0,0,.6); }
  .qr-card svg { display: block; width: 100%; height: 100%; }
  .qr-logo { position: absolute; top: 50%; left: 50%; width: 108px; height: 108px; margin: -54px 0 0 -54px;
    border-radius: 50%; background: #fff; padding: 7px; box-shadow: 0 0 0 6px #fff; }
  .pill { margin-top: 26px; padding: 10px 36px; border-radius: 999px; background: #25d366; color: #fff;
    font-family: 'Bebas Neue', sans-serif; font-size: 40px; line-height: 1.15; letter-spacing: 3px; box-shadow: 0 10px 24px rgba(0,0,0,.5); }
  .script { margin-top: 14px; font-family: 'Pacifico', cursive; font-size: 36px; line-height: 1.4; color: #ecc88f; text-shadow: 0 3px 12px rgba(0,0,0,.7); }
</style></head>
<body>
  <div class="frame"></div>
  <img class="logo" src="${file('public/logo.png')}">
  <h1>ESCANEA <span>Y PIDE</span></h1>
  <div class="qr-card">
    ${qrSvg}
    <img class="qr-logo" src="${file('public/logo.png')}">
  </div>
  <div class="pill">MENÚ DIGITAL · PEDIDOS POR WHATSAPP</div>
  <div class="script">Comidas rápidas con amor</div>
</body></html>`

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'carritos-qr-'))
const htmlFile = path.join(tmp, 'qr.html')
fs.writeFileSync(htmlFile, html)

const outDir = path.join(root, 'print')
fs.mkdirSync(outDir, { recursive: true })
const out = path.join(outDir, 'qr-carritos.png')

try {
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      '--force-device-scale-factor=2',
      '--window-size=1200,1200',
      '--virtual-time-budget=8000',
      `--screenshot=${out}`,
      pathToFileURL(htmlFile).href,
    ],
    { stdio: 'ignore' },
  )
} finally {
  fs.rmSync(tmp, { recursive: true, force: true })
}

console.log(`QR para ${url}\n-> ${path.relative(root, out)}`)
