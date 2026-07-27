// ============================================================
// PEPTINATOR MX — Datos de contacto y cobro (PENDIENTES)
// Rellenar cuando se tengan:
const CHECKOUT_CONFIG = {
  whatsapp: "529516383849", // +52 951 638 3849
  clabe: "",           // CLABE interbancaria para transferencias SPEI
  beneficiario: "",    // nombre del titular de la cuenta
};
// ============================================================

// PEPTINATOR MX — Carrito de compras (localStorage) + checkout por WhatsApp
(function () {
  const KEY = "peptinator_cart";
  const fmt = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }

  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const countEls = document.querySelectorAll(".cart-count");

  function save() { localStorage.setItem(KEY, JSON.stringify(cart)); }

  function producto(id) { return PRODUCTS.find(p => p.id === id); }

  function totalItems() { return cart.reduce((a, i) => a + i.qty, 0); }

  function totalPrecio() {
    return cart.reduce((a, i) => {
      const p = producto(i.id);
      return a + (p && p.price !== null ? p.price * i.qty : 0);
    }, 0);
  }

  function renderBadge() {
    const n = totalItems();
    countEls.forEach(el => {
      el.textContent = n;
      el.style.display = n > 0 ? "inline-flex" : "none";
    });
  }

  function render() {
    renderBadge();
    if (!itemsEl) return;
    if (cart.length === 0) {
      itemsEl.innerHTML = '<p class="mono cart-empty">// PEDIDO VACÍO — agrega productos desde el catálogo</p>';
      totalEl.textContent = fmt.format(0);
      return;
    }
    itemsEl.innerHTML = cart.map(i => {
      const p = producto(i.id);
      if (!p) return "";
      const precio = p.price === null ? "POR CONFIRMAR" : fmt.format(p.price * i.qty);
      return `
        <div class="cart-item" data-id="${p.id}">
          <div class="cart-item-info">
            <span class="cart-item-name">${p.name}</span>
            <span class="mono cart-item-spec">${p.spec} · ${p.price === null ? "—" : fmt.format(p.price)}</span>
          </div>
          <div class="qty-ctrl mono">
            <button type="button" data-cart="menos" aria-label="Quitar uno">−</button>
            <span>${i.qty}</span>
            <button type="button" data-cart="mas" aria-label="Agregar uno">+</button>
          </div>
          <span class="cart-item-price">${precio}</span>
          <button class="cart-item-del mono" type="button" data-cart="del" aria-label="Quitar del pedido">✕</button>
        </div>`;
    }).join("");
    totalEl.textContent = fmt.format(totalPrecio());
  }

  function add(id, qty) {
    const item = cart.find(i => i.id === id);
    if (item) item.qty = Math.min(item.qty + qty, 99);
    else cart.push({ id, qty });
    save();
    render();
  }

  function open() { drawer.classList.add("open"); overlay.classList.add("open"); }
  function close() { drawer.classList.remove("open"); overlay.classList.remove("open"); }

  function checkoutWhatsApp() {
    if (!CHECKOUT_CONFIG.whatsapp) {
      alert("El número de WhatsApp aún no está configurado.");
      return;
    }
    const lineas = cart.map(i => {
      const p = producto(i.id);
      if (!p) return "";
      const precio = p.price === null ? "precio por confirmar" : fmt.format(p.price * i.qty);
      return `• ${p.name} ${p.spec} x${i.qty} — ${precio}`;
    }).filter(Boolean);
    const msg = ["PEDIDO PEPTINATOR MX", "", ...lineas, "",
                 `TOTAL: ${fmt.format(totalPrecio())} MXN`, "",
                 "Mi nombre es:"].join("\n");
    window.open(`https://wa.me/${CHECKOUT_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }

  /* ---------- Eventos ---------- */
  document.querySelectorAll(".cart-open").forEach(b => b.addEventListener("click", open));
  if (overlay) overlay.addEventListener("click", close);
  const closeBtn = document.getElementById("cart-close");
  if (closeBtn) closeBtn.addEventListener("click", close);

  const waBtn = document.getElementById("cart-whatsapp");
  if (waBtn) waBtn.addEventListener("click", checkoutWhatsApp);

  if (itemsEl) itemsEl.addEventListener("click", e => {
    const btn = e.target.closest("[data-cart]");
    if (!btn) return;
    const id = btn.closest(".cart-item").dataset.id;
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (btn.dataset.cart === "mas") item.qty = Math.min(item.qty + 1, 99);
    if (btn.dataset.cart === "menos") item.qty = Math.max(item.qty - 1, 1);
    if (btn.dataset.cart === "del") cart = cart.filter(i => i.id !== id);
    save();
    render();
  });

  // API pública para main.js
  window.PeptinatorCart = { add, open, render };

  render();
})();
