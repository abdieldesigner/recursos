// Genera abdiel-css.css (en vivo, sin comentarios) desde abdiel-css.fuente.css.
// Conserva solo el primer comentario (aviso de propiedad). Uso: node quitar-comentarios-css.js
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/abdiel-css.fuente.css', 'utf8');
let out = '', i = 0, primero = true;
while (i < src.length) {
  const c = src[i];
  if (c === '"' || c === "'") {            // texto entre comillas: copiar tal cual
    let j = i + 1;
    while (j < src.length && src[j] !== c) j += src[j] === '\\' ? 2 : 1;
    out += src.slice(i, j + 1); i = j + 1;
  } else if (c === '/' && src[i + 1] === '*') {
    const fin = src.indexOf('*/', i + 2) + 2;
    if (primero) { out += src.slice(i, fin); primero = false; }
    i = fin;
  } else { out += c; i++; }
}
out = out.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n');
fs.writeFileSync(__dirname + '/abdiel-css.css', out.trim() + '\n');
console.log('abdiel-css.css generado:', Buffer.byteLength(out), 'bytes');
