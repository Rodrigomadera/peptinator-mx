// Testimonios — configuración
// 1) URL de la aplicación web de Apps Script (recibe testimonios nuevos):
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxUY-TmRUvufz7rRFg95NCrY2DFwCi3qXO7IZsZjVRFODXlLzmjr6xZVYORt_5PReX/exec"; // <-- pegar aquí la URL /exec cuando se active

// 2) (Respaldo) Testimonios manuales por producto — el sitio lee primero la Sheet;
//    estos se usan si la hoja no responde. Formato:
// const TESTIMONIOS = { "bpc-157": [ { nombre: "...", texto: "...", fecha: "..." } ] };
const TESTIMONIOS = {};
