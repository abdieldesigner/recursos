// Genera abdiel-css.css (en vivo) desde abdiel-css.fuente.css: sin comentarios y minificado.
// Conserva solo el primer comentario (aviso de propiedad). Uso: node quitar-comentarios-css.js
// No reordena ni fusiona reglas: solo quita comentarios y espacios innecesarios.
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/abdiel-css.fuente.css', 'utf8');
const guardados = [];                       // textos entre comillas y url() sin comillas: se protegen tal cual
const guardar = (t) => '\u0000' + (guardados.push(t) - 1) + '\u0000';
let out = '', aviso = '', i = 0, primero = true;
while (i < src.length) {
  const c = src[i];
  if (c === '"' || c === "'") {
    let j = i + 1;
    while (j < src.length && src[j] !== c) j += src[j] === '\\' ? 2 : 1;
    out += guardar(src.slice(i, j + 1)); i = j + 1;
  } else if (c === '/' && src[i + 1] === '*') {
    const fin = src.indexOf('*/', i + 2) + 2;
    if (primero) { aviso = src.slice(i, fin); primero = false; }
    i = fin;
  } else if (/^url\(\s*[^"'\s)]/i.test(src.slice(i, i + 8))) {
    const fin = src.indexOf(')', i) + 1;
    out += guardar(src.slice(i, fin)); i = fin;
  } else { out += c; i++; }
}
out = out
  .replace(/\s+/g, ' ')
  .replace(/ ?([{};,]) ?/g, '$1')           // alrededor de { } ; ,
  .replace(/: /g, ':')                       // despues de ":" (nunca antes: ".a :is()" es otro selector)
  .replace(/\( /g, '(').replace(/ \)/g, ')')
  .replace(/ !important/g, '!important')
  .replace(/;}/g, '}')
  .trim();
let prof = 0, lineas = '';                  // un salto de linea tras cada regla de primer nivel (el editor no colorea lineas muy largas)
for (const ch of out) {
  lineas += ch;
  if (ch === '{') prof++;
  else if (ch === '}' && --prof === 0) lineas += '\n';
}
out = lineas.trim();
out = out.replace(/\u0000(\d+)\u0000/g, (_, n) => guardados[+n]);
const final = aviso.replace(/\r\n/g, '\n') + '\n' + out + '\n';
fs.writeFileSync(__dirname + '/abdiel-css.css', final);
console.log('abdiel-css.css generado:', Buffer.byteLength(final), 'bytes');
