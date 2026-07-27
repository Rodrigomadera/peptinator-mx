// ============================================================
// PEPTINATOR MX — Configuración de Stripe
// ============================================================
// OPCIÓN RECOMENDADA SIN BACKEND: Stripe Payment Links.
// En tu dashboard de Stripe (https://dashboard.stripe.com):
//   1. Crea un producto por péptido (o uno genérico "Pedido PEPTINATOR").
//   2. Genera su Payment Link y pégalo aquí.
//   3. El botón "Solicitar pedido" abrirá el link del producto.
//
// Mientras los links estén vacíos, el botón lleva a la sección de contacto.

const STRIPE_CONFIG = {
  // Moneda de los Payment Links: "mxn"
  currency: "mxn",

  // Link genérico de respaldo (opcional) — se usa si el producto no tiene link propio
  paymentLinkGenerico: "",

  // Payment Link por producto (id del catálogo → URL del Payment Link)
  paymentLinks: {
    // "bpc-157": "https://buy.stripe.com/XXXX",
    // "retatrutida": "https://buy.stripe.com/XXXX",
  }
};

// Devuelve el Payment Link para un producto, o null si no hay ninguno configurado
function stripeLinkPara(productoId) {
  return STRIPE_CONFIG.paymentLinks[productoId] || STRIPE_CONFIG.paymentLinkGenerico || null;
}
