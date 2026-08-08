// Testimonios — configuración
// 1) URL de la aplicación web de Apps Script (recibe testimonios nuevos):
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxA9wfdX2bQODfQ6us5-Ekm_jYikke3Ac28yTivbRqKP_a160vBR6GXc0iER5g1DDLv/exec"; // <-- pegar aquí la URL /exec cuando se active

// 2) (Respaldo) Testimonios manuales por producto — el sitio lee primero la Sheet;
//    estos se usan si la hoja no responde. Formato:
// const TESTIMONIOS = { "bpc-157": [ { nombre: "...", texto: "...", fecha: "..." } ] };
const TESTIMONIOS = {};
