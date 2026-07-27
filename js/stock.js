// ============================================================
// PEPTINATOR MX — Existencia por producto (base de datos de stock)
// ============================================================
// Ajusta estos números a tu existencia real. El sitio:
//   - Muestra "EN EXISTENCIA: N" o "AGOTADO" en la ficha del producto
//   - Bloquea agregar al pedido cuando stock = 0
//   - Limita la cantidad del carrito al stock disponible (anti-sobreventa)
// NOTA: al ser sitio estático, este archivo se edita y se sube con git push.
// Para editar stock sin tocar código (p.ej. desde Google Sheets), avísanos
// y migramos la lectura a una hoja de cálculo.

const STOCK = {
  "retatrutida":  10,
  "ghk-cu":       15,
  "tesamorelin":  8,
  "ipamorelin":   12,
  "bpc-157":      20,
  "tb-500":       14,
  "kpv":          9,
  "epithalon":    11,
  "ahk-cu":       7,
  "selank":       10,
  "mots-c":       10,
  "nad":          6,
  "semax":        10,
  "ipa-cjc":      8,
  "bpc-tb":       9,
  "glow":         5,
  "klow":         4,
  "melanotan-1":  8,
  "melanotan-2":  8,
  "5amino1mq":    10,
  "agua-bac":     25
};

// Devuelve la existencia de un producto (0 si no está listado)
function stockDe(productoId) {
  return STOCK[productoId] || 0;
}
