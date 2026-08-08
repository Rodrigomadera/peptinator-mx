// Dashboard de inversionistas — lee la hoja de Google (pestañas "ventas" y "repartos")
// Contraseña de acceso (cámbiala cuando quieras):
const INV_PASSWORD = "peptiva2026";
// URL base de la hoja (la misma del stock):
const SHEET_BASE = "https://docs.google.com/spreadsheets/d/1EFK3XeOig1J8VEntEz6QEFVpFKdPpZA19ZwUvT5Iuxk/gviz/tq?tqx=out:csv";

// Costo por vial en MXN (cotización de proveedor) para estimar utilidad:
const COSTO = {
  "retatrutida": 92, "ghk-cu": 34, "tesamorelin": 296, "ipamorelin": 40,
  "bpc-157": 40, "tb-500": 119, "kpv": 46, "epithalon": 43, "selank": 40,
  "mots-c": 89, "nad": 149, "semax": 37, "ipa-cjc": 145, "bpc-tb": 119,
  "glow": 335, "klow": 341, "melanotan-1": 60, "melanotan-2": 60,
  "5amino1mq": 46, "agua-bac": 11, "tirzepatida": 103, "semaglutida-5": 66,
  "semaglutida-10": 80, "ghk-cu-100": 57, "ipamorelin-10": 69,
  "bpc-tb-20": 309, "oxitocina-5": 46, "oxitocina-10": 107
};

const fmt = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

(function () {
  const gate = document.getElementById("inv-gate");
  const dash = document.getElementById("inv-dash");
  const err = document.getElementById("inv-error");

  function entrar() {
    const val = document.getElementById("inv-pass").value;
    if (val === INV_PASSWORD) {
      sessionStorage.setItem("inv_ok", "1");
      mostrar();
    } else {
      err.style.display = "block";
    }
  }

  function mostrar() {
    gate.style.display = "none";
    dash.style.display = "block";
    cargar();
  }

  if (sessionStorage.getItem("inv_ok") === "1") {
    gate.style.display = "none";
    dash.style.display = "block";
    cargar();
  }
  document.getElementById("inv-entrar").addEventListener("click", entrar);
  document.getElementById("inv-pass").addEventListener("keydown", e => { if (e.key === "Enter") entrar(); });

  function csv(tab) {
    return fetch(`${SHEET_BASE}&sheet=${tab}`).then(r => r.text()).then(t =>
      t.trim().split(/\r?\n/).map(l => l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(c => c.replace(/^"|"$/g, "").trim()))
    );
  }

  function cargar() {
    Promise.all([csv("ventas").catch(() => []), csv("repartos").catch(() => [])])
      .then(([ventas, repartos]) => {
        // ventas: fecha | marca | producto_id | cantidad | total_mxn | metodo | notas
        let ingresos = 0, unidades = 0, utilidad = 0;
        const filas = [];
        ventas.slice(1).forEach(v => {
          if (!v[0] || v[0] === "fecha") return;
          const qty = parseInt(v[3]) || 0;
          const tot = parseFloat(String(v[4]).replace(/[^0-9.]/g, "")) || 0;
          const costo = (COSTO[v[2]] || 0) * qty;
          ingresos += tot; unidades += qty; utilidad += tot - costo;
          filas.push(v);
        });
        // repartos: fecha | inversionista | empresa | notas
        let repInv = 0, repEmp = 0;
        const filasR = [];
        repartos.slice(1).forEach(r => {
          if (!r[0] || r[0] === "fecha") return;
          const ri = parseFloat(String(r[1]).replace(/[^0-9.]/g, "")) || 0;
          const re = parseFloat(String(r[2]).replace(/[^0-9.]/g, "")) || 0;
          repInv += ri; repEmp += re;
          filasR.push(r);
        });

        const fondo = Math.max(utilidad * 0.5 - repInv - repEmp, 0);

        document.getElementById("k-ingresos").textContent = fmt.format(ingresos);
        document.getElementById("k-unidades").textContent = unidades;
        document.getElementById("k-utilidad").textContent = fmt.format(utilidad);
        document.getElementById("k-fondo").textContent = fmt.format(fondo);
        document.getElementById("k-repartido").textContent = fmt.format(repInv);

        document.getElementById("inv-ventas-body").innerHTML = filas.length
          ? filas.map(v => `<tr>${v.slice(0, 6).map(c => `<td>${c}</td>`).join("")}</tr>`).join("")
          : '<tr><td colspan="6">Sin ventas registradas aún.</td></tr>';
        document.getElementById("inv-repartos-body").innerHTML = filasR.length
          ? filasR.map(r => `<tr>${[r[0], r[1], r[3]].map(c => `<td>${c||""}</td>`).join("")}</tr>`).join("")
          : '<tr><td colspan="4">Sin repartos registrados aún.</td></tr>';
      });
  }
})();
