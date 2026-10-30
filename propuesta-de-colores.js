/* ============================================================
   Librería "Propuesta de colores" — motor compartido.

   Cómo se usa en cada proyecto (ver snippet en
   Extras/invocar-propuesta-de-colores.html):

   <script>
     window.KCM_PALETTES = { ...tus paletas de ese cliente... };
     window.KCM_PALETTE_LABELS = { ...nombre bonito por paleta... };
     window.KCM_DEFAULT_THEME = 'dark'; // opcional, 'dark' por defecto
   </script>
   <script src="RUTA/A/propuesta-de-colores.js"></script>

   Este archivo NO trae ninguna paleta propia — las lee de
   window.KCM_PALETTES, así cada cliente pone las suyas sin tocar
   este archivo. Todo lo demás (Default, degradados A→B, el mix
   ±100, clonar/crear/eliminar paletas personalizadas, tipografía,
   tamaños, radius, descargar) funciona exactamente igual que en
   propuesta-de-colores-editable.html.
   ============================================================ */
(function () {

  /* ---------- CSS base de la barra y el panel ---------- */
  var CSS_TEXT = `
@import url('https://fonts.googleapis.com/css2?family=Economica:wght@400;700&family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Darker+Grotesque:wght@400;600;700&family=Manrope:wght@300;400;500;600;700&family=Jost:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Orbitron:wght@400;700;900&family=Bebas+Neue&family=Caveat:wght@400;600;700&family=Great+Vibes&family=Parisienne&family=Covered+By+Your+Grace&display=swap');

/* Fuente propia (no es de Google Fonts) */
@font-face {
  font-family: 'Garet Book';
  src: url('https://assets.cdn.filesafe.space/wjOtIjL0cLPNxQiK9YtU/media/6a727363ee7ca3d1c422e9a4.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

.kcm-ts { position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%); z-index: 99999;
  display: flex; gap: 12px; align-items: center; padding: 10px 14px; border-radius: 999px;
  background: rgba(15,15,18,.72); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.14);
  font-family: system-ui, sans-serif;
  zoom: 0.8;  }
@media (max-width: 768px) {
  .kcm-ts {
    max-width: 94vw;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .kcm-ts > * {
    flex-shrink: 0;
  }
}
/* Escritorio angosto (laptops chicas, ventana no maximizada): la barra se
   encoge completa (tipografías, paddings, swatches, todo vía zoom) para no
   desbordarse del ancho de la pantalla. No toca el comportamiento en móvil
   (bloque de arriba, que usa scroll horizontal en vez de encogerse). */
@media (min-width: 769px) and (max-width: 1100px) {
  .kcm-ts { zoom: 0.65; }
}
@media (min-width: 769px) and (max-width: 900px) {
  .kcm-ts { zoom: 0.5; }
}
.kcm-ts__sep { width: 1px; height: 26px; background: rgba(255,255,255,.18); }
.kcm-ts__btn { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; padding: 0; position: relative;
  border: 2px solid rgba(255,255,255,.35); transition: transform .25s ease, border-color .25s ease; }
.kcm-ts__btn:hover { transform: translateY(-4px) scale(1.08); }
.kcm-ts__btn.is-active { border-color: #fff; }
.kcm-ts__tip { position: absolute; bottom: 130%; left: 50%; transform: translateX(-50%); white-space: nowrap;
  background: #111; color: #fff; font-size: 11px; padding: 5px 9px; border-radius: 6px; opacity: 0;
  pointer-events: none; transition: opacity .25s ease; }
.kcm-ts__btn:hover .kcm-ts__tip { opacity: 1; }
.kcm-ts__field { display: flex; align-items: center; gap: 6px; position: relative; }
.kcm-ts__label { color: rgba(255,255,255,.7); font-size: 10px; text-transform: uppercase; letter-spacing: .07em; }
.kcm-ts__select, .kcm-ts__num { background: rgba(255,255,255,.08); color: #fff; border: 1px solid rgba(255,255,255,.2);
  border-radius: 8px; font-size: 12px; padding: 6px 8px; font-family: system-ui, sans-serif; cursor: pointer; }
.kcm-ts__num { width: 58px; text-align: center; }
.kcm-ts__select option, .kcm-ts__select optgroup { color: #111; }
/* Campo compacto: etiqueta arriba, número abajo, poco margen (para no ensanchar la barra) */
.kcm-ts__field-stack { display: flex; flex-direction: column; align-items: center; gap: 1px; position: relative; }
.kcm-ts__field-stack .kcm-ts__label { font-size: 8px; line-height: 1; }
.kcm-ts__field-stack .kcm-ts__num { width: 38px; padding: 3px 2px; font-size: 11px; }
/* Engranaje de opciones extra (hoy: peso de fuente) por campo H2/H2-2/H3/P */
.kcm-ts__gear { position: absolute; top: -8px; right: -6px; background: none; border: none;
  color: rgba(255,255,255,.7); font-size: 14px; cursor: pointer; padding: 0; line-height: 1; }
.kcm-ts__gear:hover { color: #fff; }
.kcm-ts__popover { display: none; position: absolute; bottom: 130%; left: 50%; transform: translateX(-50%);
  background: rgba(15,15,18,.95); border: 1px solid rgba(255,255,255,.18); border-radius: 10px;
  padding: 8px 10px; white-space: nowrap; z-index: 100001; }
.kcm-ts__popover.is-open { display: block; }
.kcm-ts__popover label { display: flex; flex-direction: column; gap: 2px; color: rgba(255,255,255,.7);
  font-size: 9px; text-transform: uppercase; letter-spacing: .05em; }
.kcm-ts__popover input { width: 50px; background: rgba(255,255,255,.08); color: #fff;
  border: 1px solid rgba(255,255,255,.2); border-radius: 6px; font-size: 11px; padding: 3px 4px; text-align: center; }
/* Buscador de tipografías (cualquier fuente de Google Fonts, no solo las precargadas) */
.kcm-ts__fontsearch-btn { background: none; border: none; color: rgba(255,255,255,.7);
  font-size: 12px; cursor: pointer; padding: 0 2px; line-height: 1; }
.kcm-ts__fontsearch-btn:hover { color: #fff; }
.kcm-ts__fontsearch { width: 190px; white-space: normal; }
.kcm-ts__fontsearch input { width: 100%; box-sizing: border-box; background: rgba(255,255,255,.08); color: #fff;
  border: 1px solid rgba(255,255,255,.2); border-radius: 6px; font-size: 11px; padding: 5px 7px; margin-bottom: 6px; cursor: text; }
.kcm-ts__fontsearch-results { max-height: 160px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
.kcm-ts__fontsearch-item { padding: 4px 6px; border-radius: 5px; font-size: 11px; color: #fff; cursor: pointer; text-align: left; }
.kcm-ts__fontsearch-item:hover { background: rgba(255,255,255,.14); }
.kcm-ts__fontsearch-empty { font-size: 10px; color: rgba(255,255,255,.5); padding: 2px 6px; }
/* Botones de ícono (+ y descargar): sin degradado, solo un glifo centrado */
.kcm-ts__btn--icon { background: rgba(255,255,255,.1); display: flex; align-items: center;
  justify-content: center; font-size: 16px; color: #fff; line-height: 1; }
/* Insignias de editar/eliminar: viven DENTRO del círculo "Custom" al que pertenecen,
   y solo se muestran cuando ese círculo está activo (misma clase .is-active de siempre).
   Los círculos originales nunca las tienen, así que ahí nunca aparece nada. */
.kcm-ts__badge { display: none; position: absolute; width: 16px; height: 16px; border-radius: 50%;
  background: #111; color: #fff; font-size: 10px; align-items: center; justify-content: center;
  cursor: pointer; border: 1px solid rgba(255,255,255,.45); z-index: 2; }
.kcm-ts__btn.is-active .kcm-ts__badge { display: flex; }
.kcm-ts__badge--edit { top: -6px; left: -6px; }
.kcm-ts__badge--delete { top: -6px; right: -6px; }
.kcm-ts__badge:hover { background: #333; }
/* Panel lateral de edición manual de colores */
.kcm-panel { position: fixed; left: 20px; top: 50%; transform: translateY(-50%); z-index: 100000;
  background: rgba(15,15,18,.9); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,.14);
  border-radius: 14px; padding: 14px 16px; width: 210px; display: none;
  max-height: 80vh; flex-direction: column;
  font-family: system-ui, sans-serif; }
.kcm-panel.is-open { display: flex; }
/* El header con la "X" se queda fijo arriba; solo el contenido de abajo
   scrollea en pantallas cortas (laptops chicas), para no taparse ni
   perder acceso al botón de cerrar */
.kcm-panel__body { overflow-y: auto; min-height: 0; }
.kcm-panel__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
  color: #fff; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; flex: none; }
.kcm-panel__close { background: none; border: none; color: #fff; font-size: 18px; line-height: 1;
  cursor: pointer; padding: 0 4px; }
.kcm-panel__row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.kcm-panel__label { flex: 1 1 auto; color: rgba(255,255,255,.75); font-size: 11px; }
.kcm-panel__swatch { width: 26px; height: 26px; padding: 0; border: 1px solid rgba(255,255,255,.25);
  border-radius: 6px; background: none; cursor: pointer; }
.kcm-panel__hex { width: 68px; background: rgba(255,255,255,.08); color: #fff; border: 1px solid rgba(255,255,255,.2);
  border-radius: 6px; font-size: 11px; padding: 4px 6px; text-align: center; font-family: system-ui, sans-serif; }
/* Sección de degradados editables (--degradado-texto / --degradado-fondo) */
.kcm-panel__divider { color: rgba(255,255,255,.5); font-size: 10px; text-transform: uppercase;
  letter-spacing: .06em; margin: 10px 0 6px; border-top: 1px solid rgba(255,255,255,.15); padding-top: 8px; }
.kcm-panel__gradrow { margin-bottom: 10px; }
.kcm-panel__gradlabel { color: rgba(255,255,255,.8); font-size: 11px; margin-bottom: 4px; }
.kcm-panel__gradslots { display: flex; flex-direction: column; gap: 4px; }
.kcm-panel__slot { display: flex; align-items: center; gap: 4px; }
.kcm-panel__select { flex: 1 1 auto; min-width: 0; background: rgba(255,255,255,.08); color: #fff;
  border: 1px solid rgba(255,255,255,.2); border-radius: 6px; font-size: 10px; padding: 3px 4px; cursor: pointer; }
.kcm-panel__select option { color: #111; }
.kcm-panel__swatch--sm { width: 20px; height: 20px; flex: 0 0 auto; }
.kcm-panel__hex--sm { width: 48px; flex: 0 0 auto; }
.kcm-panel__mix { width: 36px; flex: 0 0 auto; background: rgba(255,255,255,.08); color: #fff;
  border: 1px solid rgba(255,255,255,.2); border-radius: 6px; font-size: 10px; padding: 3px 2px; text-align: center; }
.kcm-panel__preview { width: 14px; height: 14px; border-radius: 4px; flex: 0 0 auto;
  border: 1px solid rgba(255,255,255,.35); }
`;

  /* ---------- Markup de la barra y el panel ----------
     Igual que el HTML estático del archivo original, salvo que los
     círculos de paleta (teal, naranja, etc.) ya NO van aquí fijos:
     se generan más abajo a partir de window.KCM_PALETTES. */
  var HTML_TEXT = `
<div class="kcm-ts" role="group" aria-label="Theme switcher">
  <button class="kcm-ts__btn" data-pal="default" id="kcmDefaultPal" aria-label="Page's current colors">
    <span class="kcm-ts__tip">Default</span></button>
  <button class="kcm-ts__btn kcm-ts__btn--icon" id="kcmCancelPal" aria-label="Quitar todo y ver la web real">
    <span class="kcm-ts__tip">Ver mi web real (cancelar)</span>✕</button>
  <button class="kcm-ts__btn kcm-ts__btn--icon" id="kcmAddPal" aria-label="Create custom palette from the active one">
    <span class="kcm-ts__tip">Crear paleta personalizada</span>+</button>
  <span class="kcm-ts__sep"></span>
  <button class="kcm-ts__btn" id="kcmSolid" aria-label="Toggle solid / gradient">
    <span class="kcm-ts__tip">Solid / Gradient</span></button>
  <span class="kcm-ts__sep"></span>
  <div class="kcm-ts__field">
    <span class="kcm-ts__label">Title</span>
    <select class="kcm-ts__select" id="kcmFont">
      <optgroup label="Basics (sans)">
        <option value="Economica" style="font-family:'Economica'">Economica</option>
        <option value="Montserrat" style="font-family:'Montserrat'">Montserrat</option>
        <option value="Garet Book" style="font-family:'Garet Book'">Garet Book</option>
        <option value="Jost" style="font-family:'Jost'">Jost</option>
      </optgroup>
      <optgroup label="Decorated (serif / display)">
        <option value="Playfair Display" style="font-family:'Playfair Display'">Playfair Display</option>
        <option value="Darker Grotesque" style="font-family:'Darker Grotesque'">Darker Grotesque</option>
        <option value="Libre Baskerville" style="font-family:'Libre Baskerville'">Libre Baskerville</option>
        <option value="Orbitron" style="font-family:'Orbitron'">Orbitron</option>
        <option value="Bebas Neue" style="font-family:'Bebas Neue'">Bebas Neue</option>
        <option value="Caveat" style="font-family:'Caveat'">Caveat</option>
      </optgroup>
    </select>
    <button class="kcm-ts__fontsearch-btn" id="kcmFontSearchBtn" type="button" aria-label="Buscar en Google Fonts">🔍</button>
    <div class="kcm-ts__popover kcm-ts__fontsearch" id="kcmFontSearchPopover">
      <input type="text" id="kcmFontSearchInput" placeholder="Buscar en Google Fonts...">
      <div class="kcm-ts__fontsearch-results" id="kcmFontSearchResults"></div>
    </div>
  </div>
  <div class="kcm-ts__field">
    <span class="kcm-ts__label">Content</span>
    <select class="kcm-ts__select" id="kcmFontContent">
      <optgroup label="Basics (sans)">
        <option value="Manrope" style="font-family:'Manrope'">Manrope</option>
        <option value="Montserrat" style="font-family:'Montserrat'">Montserrat</option>
        <option value="Economica" style="font-family:'Economica'">Economica</option>
        <option value="Garet Book" style="font-family:'Garet Book'">Garet Book</option>
        <option value="Jost" style="font-family:'Jost'">Jost</option>
      </optgroup>
      <optgroup label="Decorated (serif / display)">
        <option value="Playfair Display" style="font-family:'Playfair Display'">Playfair Display</option>
        <option value="Darker Grotesque" style="font-family:'Darker Grotesque'">Darker Grotesque</option>
        <option value="Libre Baskerville" style="font-family:'Libre Baskerville'">Libre Baskerville</option>
        <option value="Orbitron" style="font-family:'Orbitron'">Orbitron</option>
        <option value="Bebas Neue" style="font-family:'Bebas Neue'">Bebas Neue</option>
        <option value="Caveat" style="font-family:'Caveat'">Caveat</option>
      </optgroup>
    </select>
    <button class="kcm-ts__fontsearch-btn" id="kcmFontContentSearchBtn" type="button" aria-label="Buscar en Google Fonts">🔍</button>
    <div class="kcm-ts__popover kcm-ts__fontsearch" id="kcmFontContentSearchPopover">
      <input type="text" id="kcmFontContentSearchInput" placeholder="Buscar en Google Fonts...">
      <div class="kcm-ts__fontsearch-results" id="kcmFontContentSearchResults"></div>
    </div>
  </div>
  <div class="kcm-ts__field">
    <span class="kcm-ts__label">Extra</span>
    <select class="kcm-ts__select" id="kcmFontExtra">
      <option value="" selected>— Vacío (hereda Título) —</option>
      <optgroup label="Script">
        <option value="Caveat" style="font-family:'Caveat'">Caveat</option>
        <option value="Great Vibes" style="font-family:'Great Vibes'">Great Vibes</option>
        <option value="Parisienne" style="font-family:'Parisienne'">Parisienne</option>
        <option value="Covered By Your Grace" style="font-family:'Covered By Your Grace'">Covered By Your Grace</option>
      </optgroup>
      <optgroup label="Decorated (serif / display)">
        <option value="Cormorant Garamond" style="font-family:'Cormorant Garamond'">Cormorant Garamond</option>
        <option value="Playfair Display" style="font-family:'Playfair Display'">Playfair Display</option>
        <option value="Darker Grotesque" style="font-family:'Darker Grotesque'">Darker Grotesque</option>
        <option value="Libre Baskerville" style="font-family:'Libre Baskerville'">Libre Baskerville</option>
        <option value="Orbitron" style="font-family:'Orbitron'">Orbitron</option>
        <option value="Bebas Neue" style="font-family:'Bebas Neue'">Bebas Neue</option>
      </optgroup>
      <optgroup label="Basics (sans)">
        <option value="Manrope" style="font-family:'Manrope'">Manrope</option>
        <option value="Montserrat" style="font-family:'Montserrat'">Montserrat</option>
        <option value="Economica" style="font-family:'Economica'">Economica</option>
        <option value="Garet Book" style="font-family:'Garet Book'">Garet Book</option>
        <option value="Jost" style="font-family:'Jost'">Jost</option>
      </optgroup>
    </select>
    <button class="kcm-ts__fontsearch-btn" id="kcmFontExtraSearchBtn" type="button" aria-label="Buscar en Google Fonts">🔍</button>
    <div class="kcm-ts__popover kcm-ts__fontsearch" id="kcmFontExtraSearchPopover">
      <input type="text" id="kcmFontExtraSearchInput" placeholder="Buscar en Google Fonts...">
      <div class="kcm-ts__fontsearch-results" id="kcmFontExtraSearchResults"></div>
    </div>
  </div>
  <span class="kcm-ts__sep"></span>
  <div class="kcm-ts__field-stack">
    <span class="kcm-ts__label">H2</span>
    <input class="kcm-ts__num" id="kcmH2" type="number" min="10" max="120" step="1">
    <button class="kcm-ts__gear" id="kcmH2Gear" type="button" aria-label="Más opciones H2">⚙</button>
    <div class="kcm-ts__popover" id="kcmH2Popover">
      <label>Peso<input type="number" id="kcmH2Weight" min="100" max="900" step="100" placeholder="auto"></label>
    </div>
  </div>
  <div class="kcm-ts__field-stack">
    <span class="kcm-ts__label">H2-2</span>
    <input class="kcm-ts__num" id="kcmH2b" type="number" min="10" max="120" step="1">
    <button class="kcm-ts__gear" id="kcmH2bGear" type="button" aria-label="Más opciones H2-2">⚙</button>
    <div class="kcm-ts__popover" id="kcmH2bPopover">
      <label>Peso<input type="number" id="kcmH2bWeight" min="100" max="900" step="100" placeholder="auto"></label>
    </div>
  </div>
  <div class="kcm-ts__field-stack">
    <span class="kcm-ts__label">H3</span>
    <input class="kcm-ts__num" id="kcmH3" type="number" min="10" max="80" step="1">
    <button class="kcm-ts__gear" id="kcmH3Gear" type="button" aria-label="Más opciones H3">⚙</button>
    <div class="kcm-ts__popover" id="kcmH3Popover">
      <label>Peso<input type="number" id="kcmH3Weight" min="100" max="900" step="100" placeholder="auto"></label>
    </div>
  </div>
  <div class="kcm-ts__field-stack">
    <span class="kcm-ts__label">P</span>
    <input class="kcm-ts__num" id="kcmP" type="number" min="10" max="40" step="1">
    <button class="kcm-ts__gear" id="kcmPGear" type="button" aria-label="Más opciones P">⚙</button>
    <div class="kcm-ts__popover" id="kcmPPopover">
      <label>Peso<input type="number" id="kcmPWeight" min="100" max="900" step="100" placeholder="auto"></label>
    </div>
  </div>
  <span class="kcm-ts__sep"></span>
  <div class="kcm-ts__field-stack">
    <span class="kcm-ts__label">Radius</span>
    <input class="kcm-ts__num" id="kcmRadius" type="number" min="0" max="100" step="1">
  </div>
  <span class="kcm-ts__sep"></span>
  <button class="kcm-ts__btn kcm-ts__btn--icon" id="kcmDownload" aria-label="Download current configuration">
    <span class="kcm-ts__tip">Descargar valores</span>⬇</button>
</div>

<div class="kcm-panel" id="kcmPanel">
  <div class="kcm-panel__header">
    <span>Editar paleta</span>
    <button class="kcm-panel__close" id="kcmPanelClose" aria-label="Cerrar">×</button>
  </div>
  <div class="kcm-panel__body" id="kcmPanelBody"></div>
</div>
`;

  var styleTag = document.createElement('style');
  styleTag.id = 'kcm-base-style';
  styleTag.textContent = CSS_TEXT;
  document.head.appendChild(styleTag);
  document.body.insertAdjacentHTML('beforeend', HTML_TEXT);

  /* ---------- Paletas: vienen del proyecto, no de esta librería ---------- */
  var PALETTES = {};
  var CONFIG_PALETTES = window.KCM_PALETTES || {};
  for (var pk in CONFIG_PALETTES) PALETTES[pk] = CONFIG_PALETTES[pk];
  var PALETTE_LABELS = window.KCM_PALETTE_LABELS || {};

  /* ---------- Lectura dinámica de los valores reales de la página ---------- */

  /* Resuelve una variable de longitud (font-size, border-radius, etc.) a un número en px,
     dejando que el navegador haga la cascada + el cálculo de clamp()/vw por su cuenta. */
  function resolvePx(cssProp, varName, fallback) {
    var probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    probe.style[cssProp] = 'var(' + varName + ', ' + fallback + 'px)';
    document.body.appendChild(probe);
    var resolved = parseFloat(getComputedStyle(probe)[cssProp]);
    document.body.removeChild(probe);
    return isNaN(resolved) ? fallback : Math.round(resolved);
  }

  /* Lee el nombre real de una variable de fuente (quita comillas si las tiene) */
  function resolveFontName(varName, fallback) {
    var raw = getComputedStyle(document.body).getPropertyValue(varName).trim();
    raw = raw.replace(/^['"]|['"]$/g, '');
    return raw || fallback;
  }

  /* Selecciona una fuente en el <select>; si no está en la lista, la agrega
     sobre la marcha (ej. una fuente propia de esa página que no conocíamos) */
  function applyFontSelection(selectEl, value) {
    if (!value) return;
    var exists = Array.prototype.some.call(selectEl.options, function (o) { return o.value === value; });
    if (!exists) {
      var opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value + ' (detectada)';
      selectEl.appendChild(opt);
    }
    selectEl.value = value;
  }

  /* Arma la paleta "default" leyendo los colores reales que la página ya tiene */
  function readCurrentPalette() {
    return {
      '--primary-color-custom':   resolveFontName('--primary-color-custom', '#000000'),
      '--secondary-color-custom': resolveFontName('--secondary-color-custom', '#000000'),
      '--accent-color-custom':    resolveFontName('--accent-color-custom', '#ffffff'),
      '--accent-color-custom-2':  resolveFontName('--accent-color-custom-2', '#ffffff'),
      '--bg-p-d': resolveFontName('--bg-p-d', '#000000'),
      '--bg-s-d': resolveFontName('--bg-s-d', '#111111'),
      '--bg-p-l': resolveFontName('--bg-p-l', '#ffffff'),
      '--bg-s-l': resolveFontName('--bg-s-l', '#f0f0f0'),
      '--text-l': resolveFontName('--text-l', '#ffffff'),
      '--text-d': resolveFontName('--text-d', '#000000')
    };
  }

  /* Lee los degradados reales que la página ya tiene declarados (tal cual,
     sin intentar descomponerlos en 2 variables). Sirve para que "Default"
     no invente una combinación propia — usa la de siempre hasta que el
     usuario la edite a mano en el panel. */
  function readCurrentGradients() {
    return {
      texto: resolveFontName('--degradado-texto', ''),
      texto2: resolveFontName('--degradado-texto-2', ''),
      boton: resolveFontName('--degradado-boton', ''),
      botonMenu: resolveFontName('--degradado-boton-menu', ''),
      fondo: resolveFontName('--degradado-fondo', '')
    };
  }

  var box = document.querySelector('.kcm-ts'); if (!box) return;
  document.body.appendChild(box);
  var styleEl = document.getElementById('kcm-pal-style');
  if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'kcm-pal-style'; document.head.appendChild(styleEl); }
  var current = null; /* null = todavía no se tocaron los colores reales de la página */
  var solid = false;
  /* 'dark' = el sitio es oscuro sin ningún data-theme (estado normal).
     'light' = el sitio es claro por defecto. Se configura por proyecto
     con window.KCM_DEFAULT_THEME; si no se define, asume 'dark'. */
  var defaultTheme = window.KCM_DEFAULT_THEME || 'dark';
  var DEFAULT_GRADIENTS = readCurrentGradients(); /* degradados reales de la página, capturados una sola vez */
  /* ---------- Receta editable de Texto/Botón/Fondo ----------
     Por defecto, Texto/Botón usan la fórmula automática de contraste y Fondo
     usa Secondary+BG Dark. Cada paleta puede cambiar qué 2 variables forman
     cada degradado, o salirse del esquema con un color "Custom" libre. Se
     guarda aparte de PALETTES para no interferir con el for..in que arma las
     variables base en buildCss(). */
  var GRADIENT_RECIPES = {};
  function defaultGradientRecipe() {
    return {
      texto: { a: '--primary-color-custom', b: '--accent-color-custom', aCustom: '#ffffff', bCustom: '#ffffff', aMix: 0, bMix: 0 },
      boton: { a: '--accent-color-custom', b: '--primary-color-custom', aCustom: '#ffffff', bCustom: '#ffffff', aMix: 0, bMix: 0 },
      fondo: { a: '--secondary-color-custom', b: '--bg-p-d', aCustom: '#ffffff', bCustom: '#ffffff', aMix: 0, bMix: 0 }
    };
  }
  function getRecipe(key) {
    if (!GRADIENT_RECIPES[key]) GRADIENT_RECIPES[key] = defaultGradientRecipe();
    return GRADIENT_RECIPES[key];
  }
  /* Copia un slot de degradado (texto/boton/fondo) tal cual: si apunta a una
     variable o usa un color "Custom" suelto, y si estaba editado a mano o no */
  function cloneGradientSlot(slot) {
    return { a: slot.a, b: slot.b, aCustom: slot.aCustom, bCustom: slot.bCustom,
      aMix: slot.aMix || 0, bMix: slot.bMix || 0, edited: slot.edited };
  }

  var KNOWN_RECIPE_VARS = ['--primary-color-custom','--secondary-color-custom','--accent-color-custom',
    '--accent-color-custom-2','--bg-p-d','--bg-s-d','--bg-p-l','--bg-s-l','--text-l','--text-d'];

  /* Busca "varName" en "text" exigiendo que sea la variable COMPLETA, no solo un
     prefijo (ej. "--accent-color-custom" es literalmente el inicio de
     "--accent-color-custom-2", así que un indexOf simple confundiría una con otra).
     Se valida que justo después del nombre no siga otra letra/dígito/guion. */
  function hasExactVar(text, varName) {
    var idx = text.indexOf(varName);
    while (idx !== -1) {
      var nextChar = text.charAt(idx + varName.length);
      if (!/[A-Za-z0-9_-]/.test(nextChar)) return true;
      idx = text.indexOf(varName, idx + 1);
    }
    return false;
  }

  /* Separa los argumentos de nivel superior de un linear-gradient(...), sin
     cortar comas que estén DENTRO de funciones anidadas como color-mix() */
  function splitTopLevelArgs(str) {
    var parts = [], depth = 0, last = 0;
    for (var i = 0; i < str.length; i++) {
      var ch = str[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (ch === ',' && depth === 0) { parts.push(str.slice(last, i)); last = i + 1; }
    }
    parts.push(str.slice(last));
    return parts.map(function (s) { return s.trim(); });
  }

  /* De una parada de degradado (ej. "color-mix(in srgb, var(--primary-color-custom)
     75%, black 25%)") extrae la variable base si aparece, IGNORANDO el color-mix
     que la envuelve — así se mantiene el vínculo dinámico con esa variable en vez
     de congelar un color fijo. Si no hay ninguna variable reconocible, cae a un
     hex o palabra clave (white/black/transparent) como color "Custom". Si el stop
     viene envuelto en color-mix(..., white|black N%), también extrae ese N% como
     "mix" (positivo = blanco, negativo = negro) para clonar la mezcla exacta. */
  function resolveGradientStop(stopText) {
    var mix = 0;
    var searchText = stopText;
    var mixMatch = stopText.match(/color-mix\(([\s\S]*)\)/i);
    if (mixMatch) {
      searchText = mixMatch[1];
      var pctMatch = searchText.match(/\b(white|black)\s+(\d+(?:\.\d+)?)%/i);
      if (pctMatch) {
        var pct = Math.round(parseFloat(pctMatch[2]));
        mix = /white/i.test(pctMatch[1]) ? pct : -pct;
      }
    }
    for (var i = 0; i < KNOWN_RECIPE_VARS.length; i++) {
      if (hasExactVar(searchText, KNOWN_RECIPE_VARS[i])) {
        return { value: KNOWN_RECIPE_VARS[i], custom: '#ffffff', mix: mix };
      }
    }
    var hexMatch = searchText.match(/#[0-9a-f]{3,8}/i);
    if (hexMatch) return { value: 'custom', custom: hexMatch[0], mix: mix };
    if (!mixMatch) {
      var kwMatch = searchText.match(/\b(white|black|transparent)\b/i);
      if (kwMatch) return { value: 'custom', custom: kwMatch[0].toLowerCase(), mix: 0 };
    }
    return { value: 'custom', custom: '#ffffff', mix: mix };
  }

  /* Convierte un degradado REAL (string tal cual lo devuelve la página, ej. de
     DEFAULT_GRADIENTS) en una receta A→B editable. Si el degradado real tiene
     3+ colores, se queda solo con el primero y el último (limitación conocida
     del sistema A→B, que solo soporta 2 paradas). */
  function parseGradientToRecipe(gradientStr) {
    if (!gradientStr) return null;
    var inner = gradientStr.replace(/^[a-z-]+gradient\(/i, '').replace(/\)\s*$/, '');
    var parts = splitTopLevelArgs(inner);
    if (parts.length && /^(\d+(\.\d+)?deg|to\s+\w+(\s+\w+)?)$/i.test(parts[0])) parts.shift();
    if (!parts.length) return null;
    var a = resolveGradientStop(parts[0]);
    var b = resolveGradientStop(parts[parts.length - 1]);
    return { a: a.value, b: b.value, aCustom: a.custom, bCustom: b.custom, aMix: a.mix, bMix: b.mix, edited: true };
  }

  /* getComputedStyle() devuelve una variable CSS YA RESUELTA: si tu CSS real
     dice var(--accent-color-custom), lo que llega aquí es directamente el
     hex final (ej. #C8102E) — el navegador sustituye la variable antes de
     que podamos leerla, y ese rastro se pierde. Para conservar la variable
     real hay que leer el texto TAL CUAL está escrito en la hoja de estilos
     (sin resolver), buscando directo en document.styleSheets la regla que
     realmente aplica a <body> en este momento (respeta @media y selectores
     tipo [data-theme="..."] vía .matches()). Se ignoran nuestras propias
     hojas inyectadas (#kcm-pal-style y #kcm-base-style) para no leernos a
     nosotros mismos. */
  function findRawBodyValue(varName) {
    var found = null;
    function scanRules(rules) {
      for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (rule.type === CSSRule.MEDIA_RULE) {
          if (window.matchMedia(rule.media.mediaText).matches) scanRules(rule.cssRules);
          continue;
        }
        if (rule.type !== CSSRule.STYLE_RULE) continue;
        var raw = rule.style.getPropertyValue(varName);
        if (!raw) continue;
        try {
          if (!document.body.matches(rule.selectorText)) continue;
        } catch (e) { continue; }
        found = raw.trim(); /* la última regla que coincide gana, como en la cascada real */
      }
    }
    for (var s = 0; s < document.styleSheets.length; s++) {
      var sheet = document.styleSheets[s];
      if (sheet.ownerNode && (sheet.ownerNode.id === 'kcm-pal-style' || sheet.ownerNode.id === 'kcm-base-style')) continue;
      var rules;
      try { rules = sheet.cssRules || sheet.rules; } catch (e) { continue; }
      if (rules) scanRules(rules);
    }
    return found;
  }

  function resolveSlotValue(slot, customValue, mixPercent) {
    var base = slot === 'custom' ? customValue : 'var(' + slot + ')';
    var pct = Math.round(parseFloat(mixPercent)) || 0;
    if (!pct) return base;
    var abs = Math.min(Math.abs(pct), 100);
    var mixWith = pct > 0 ? 'white' : 'black';
    return 'color-mix(in srgb,' + base + ' ' + (100 - abs) + '%,' + mixWith + ' ' + abs + '%)';
  }

  function buildCss(name) {
    var p = PALETTES[name]; if (!p) return '';
    var css = 'html body{';
    for (var k in p) css += k + ':' + p[k] + ';';
    css += '--resplandor-boton:0 0 3rem var(--accent-color-custom);';

    var recipe = getRecipe(name);
    var isDefault = (name === 'default');
    var fondoVal, textoVal, texto2Val, botonVal, botonMenuVal;

    /* "Default" sin editar ESTE degradado puntual: mantiene tu valor real
       leído de la página (sea cual sea su fórmula/colores), en vez de caer
       en la receta/fórmula genérica — así ajustar UNO solo (ej. Texto) no
       te cambia de golpe los otros (ej. Fondo) que quizás usan algo
       distinto a la receta base (Accent+Accent-2, hexadecimales sueltos). */
    if (solid) {
      fondoVal = 'linear-gradient(105deg,var(--bg-p-d),var(--bg-p-d))';
    } else if (isDefault && !recipe.fondo.edited && DEFAULT_GRADIENTS.fondo) {
      fondoVal = DEFAULT_GRADIENTS.fondo;
    } else {
      fondoVal = 'linear-gradient(105deg,' + resolveSlotValue(recipe.fondo.a, recipe.fondo.aCustom, recipe.fondo.aMix) + ',' + resolveSlotValue(recipe.fondo.b, recipe.fondo.bCustom, recipe.fondo.bMix) + ')';
    }
    css += '--degradado-fondo:' + fondoVal + ';';

    if (solid) {
      textoVal = texto2Val = botonVal = botonMenuVal = 'linear-gradient(105deg,var(--accent-color-custom),var(--accent-color-custom))';
    } else {
      /* Regla de contraste modo oscuro/claro: el degradado "normal" (--degradado-texto,
         el que se ve en el estado por defecto) debe ACLARAR con white si el sitio es
         oscuro por defecto (contrasta mejor contra fondo oscuro). El que usa el toggle
         al activar modo claro (--degradado-texto-2) debe OSCURECER con black (contrasta
         mejor contra fondo claro). Si el sitio fuera claro por defecto, es al revés —
         por eso se decide con "defaultTheme", configurado por proyecto. --degradado-boton y
         --degradado-boton-menu siguen esta misma lógica, A MENOS que se editen a mano
         en el panel (recipe.texto.edited / recipe.boton.edited). */
      var mixColorTexto = defaultTheme === 'dark' ? 'white' : 'black';
      var mixColorTexto2 = defaultTheme === 'dark' ? 'black' : 'white';

      texto2Val = (isDefault && !recipe.texto.edited && DEFAULT_GRADIENTS.texto2)
        ? DEFAULT_GRADIENTS.texto2
        : 'linear-gradient(105deg,var(--accent-color-custom-2),color-mix(in srgb,var(--accent-color-custom-2) 75%,' + mixColorTexto2 + ' 25%))';

      if (recipe.texto.edited) {
        textoVal = 'linear-gradient(105deg,' + resolveSlotValue(recipe.texto.a, recipe.texto.aCustom, recipe.texto.aMix) + ',' + resolveSlotValue(recipe.texto.b, recipe.texto.bCustom, recipe.texto.bMix) + ')';
      } else if (isDefault && DEFAULT_GRADIENTS.texto) {
        textoVal = DEFAULT_GRADIENTS.texto;
      } else {
        textoVal = 'linear-gradient(105deg,var(--accent-color-custom),color-mix(in srgb,var(--accent-color-custom) 75%,' + mixColorTexto + ' 25%))';
      }

      if (recipe.boton.edited) {
        botonVal = 'linear-gradient(105deg,' + resolveSlotValue(recipe.boton.a, recipe.boton.aCustom, recipe.boton.aMix) + ',' + resolveSlotValue(recipe.boton.b, recipe.boton.bCustom, recipe.boton.bMix) + ')';
      } else if (isDefault && DEFAULT_GRADIENTS.boton) {
        botonVal = DEFAULT_GRADIENTS.boton;
      } else {
        botonVal = textoVal;
      }

      botonMenuVal = (isDefault && !recipe.boton.edited && DEFAULT_GRADIENTS.botonMenu) ? DEFAULT_GRADIENTS.botonMenu : botonVal;
    }
    css += '--degradado-texto:' + textoVal + ';';
    css += '--degradado-texto-2:' + texto2Val + ';';
    css += '--degradado-boton:' + botonVal + ';';
    css += '--degradado-boton-menu:' + botonMenuVal + ';';
    css += '}';
    /* .theme-lock fija estas variables (texto y colores de marca) con más
       especificidad que html body; se repiten aquí con la misma paleta
       para que .theme-lock también cambie de tema, sin tocar tu archivo real. */
    css += 'body[data-theme="dark"] .theme-lock,body[data-theme="light"] .theme-lock{';
    css += '--text-l:' + p['--text-l'] + ' !important;--text-d:' + p['--text-d'] + ' !important;';
    css += '--primary-color-custom:' + p['--primary-color-custom'] + ' !important;';
    css += '--secondary-color-custom:' + p['--secondary-color-custom'] + ' !important;';
    css += '--accent-color-custom:' + p['--accent-color-custom'] + ' !important;';
    css += '--accent-color-custom-2:' + p['--accent-color-custom-2'] + ' !important;';
    css += '--degradado-texto:' + textoVal + ' !important;';
    css += '--degradado-texto-2:' + texto2Val + ' !important;';
    css += '--degradado-boton:' + botonVal + ' !important;';
    css += '}';
    /* Solo --degradado-texto-2 y --degradado-fondo van aquí: --degradado-texto-2
       es la "fuente" a la que apuntan tus propias redirecciones (--degradado-texto,
       --degradado-boton, --degradado-boton-2, etc. en modo claro/oscuro), así que
       basta con que ESTA tenga el color correcto — si además forzáramos aquí
       --degradado-texto/--degradado-boton, bloquearíamos tu propia redirección y
       se quedarían fijos en vez de cambiar al activar el modo contrario. */
    css += 'body[data-theme="dark"],body[data-theme="light"]{';
    css += '--degradado-fondo:' + fondoVal + ' !important;';
    css += '--degradado-texto-2:' + texto2Val + ' !important;';
    css += '}';
    return css;
  }
  var solidBtn = document.getElementById('kcmSolid');
  function updateSolidBtn() {
    solidBtn.style.background = solid
      ? 'var(--accent-color-custom)'
      : 'linear-gradient(105deg,var(--accent-color-custom),var(--primary-color-custom))';
    solidBtn.classList.toggle('is-active', solid);
  }
  function apply(name) {
    current = name;
    styleEl.textContent = buildCss(name);
    document.body.setAttribute('data-pal', name);
    box.querySelectorAll('.kcm-ts__btn[data-pal]').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.pal === name);
    });
    updateSolidBtn();
  }
  /* Selecciona una paleta y, si el panel de edición ya está abierto, lo mantiene
     sincronizado: si la nueva paleta es personalizada, el panel pasa a editarla;
     si es una de las paletas fijas (no editables), el panel se cierra solo. */
  function selectPalette(key) {
    apply(key);
    if (panel && panel.classList.contains('is-open')) {
      if (key.indexOf('custom') === 0) {
        openPanel(key);
      } else {
        panel.classList.remove('is-open');
        editingKey = null;
      }
    }
  }

  function swatchGradient(p) {
    return 'conic-gradient(' +
      p['--primary-color-custom'] + ' 0 25%,' +
      p['--secondary-color-custom'] + ' 25% 50%,' +
      p['--accent-color-custom'] + ' 50% 75%,' +
      p['--accent-color-custom-2'] + ' 75% 100%)';
  }

  /* ---------- Círculos de paleta configurados por el proyecto ----------
     Se generan aquí, antes del "+", a partir de window.KCM_PALETTES — no
     son fijos como en la versión de un solo archivo, porque cada cliente
     puede traer una cantidad distinta de paletas. */
  var addBtnRef = document.getElementById('kcmAddPal');
  Object.keys(PALETTES).forEach(function (key) {
    var labelText = PALETTE_LABELS[key] || key;
    var btn = document.createElement('button');
    btn.className = 'kcm-ts__btn';
    btn.dataset.pal = key;
    btn.setAttribute('aria-label', labelText);
    btn.style.background = swatchGradient(PALETTES[key]);
    var tip = document.createElement('span');
    tip.className = 'kcm-ts__tip';
    tip.textContent = labelText;
    btn.appendChild(tip);
    addBtnRef.parentNode.insertBefore(btn, addBtnRef);
  });

  /* Los perfiles de color siguen siendo 100% manuales (esto lo decide el
     proyecto vía window.KCM_PALETTES, no se lee de la página) */
  box.querySelectorAll('.kcm-ts__btn[data-pal]').forEach(function (b) {
    b.addEventListener('click', function () { selectPalette(b.dataset.pal); });
  });
  solidBtn.addEventListener('click', function () {
    solid = !solid;
    if (current) apply(current); /* si aún no se eligió paleta, no hay nada que reconstruir */
  });

  /* Tipografía: arranca leyendo lo que la página ya tiene declarado */
  var fontSel = document.getElementById('kcmFont');
  var fontContentSel = document.getElementById('kcmFontContent');
  var fontExtraSel = document.getElementById('kcmFontExtra');
  applyFontSelection(fontSel, resolveFontName('--headlinefont', 'Economica'));
  applyFontSelection(fontContentSel, resolveFontName('--contentfont', 'Manrope'));
  applyFontSelection(fontExtraSel, resolveFontName('--extrafont', ''));
  fontSel.addEventListener('change', function () {
    document.body.style.setProperty('--headlinefont', "'" + fontSel.value + "'");
  });
  fontContentSel.addEventListener('change', function () {
    document.body.style.setProperty('--contentfont', "'" + fontContentSel.value + "'");
  });
  fontExtraSel.addEventListener('change', function () {
    if (fontExtraSel.value) {
      document.body.style.setProperty('--extrafont', "'" + fontExtraSel.value + "'");
    } else {
      document.body.style.removeProperty('--extrafont'); /* "Vacío" = vuelve a heredar del Título */
    }
  });

  /* Buscador de tipografías: catálogo completo de Google Fonts (solo nombres, para
     autocompletar). Al elegir una, se inyecta su <link> y se agrega al <select>
     correspondiente como si ya la conociéramos — todo dura solo la sesión. */
  var GOOGLE_FONTS_FAMILIES = ["ABeeZee", "ADLaM Display", "AR One Sans", "Abel", "Abhaya Libre", "Aboreto", "Abril Fatface", "Abyssinica SIL", "Aclonica", "Acme", "Actor", "Adamina", "Advent Pro", "Afacad", "Afacad Flux", "Agbalumo", "Agdasima", "Agu Display", "Aguafina Script", "Akatab", "Akaya Kanadaka", "Akaya Telivigala", "Akronim", "Akshar", "Akt", "Aladin", "Alan Sans", "Alata", "Alatsi", "Albert Sans", "Aldrich", "Alef", "Alegreya", "Alegreya SC", "Alegreya Sans", "Alegreya Sans SC", "Aleo", "Alex Brush", "Alexandria", "Alfa Slab One", "Alice", "Alien Block", "Alike", "Alike Angular", "Alkalami", "Alkatra", "Allan", "Allerta", "Allerta Stencil", "Allison", "Allkin", "Allura", "Almarai", "Almendra", "Almendra Display", "Almendra SC", "Alumni Sans", "Alumni Sans Collegiate One", "Alumni Sans Inline One", "Alumni Sans Pinstripe", "Alumni Sans SC", "Alyamama", "Amarante", "Amaranth", "Amarna", "Amatic SC", "Amethysta", "Amiko", "Amiri", "Amiri Quran", "Amita", "Anaheim", "Ancizar Sans", "Ancizar Serif", "Andada Pro", "Andika", "Anek Bangla", "Anek Devanagari", "Anek Gujarati", "Anek Gurmukhi", "Anek Kannada", "Anek Latin", "Anek Malayalam", "Anek Odia", "Anek Tamil", "Anek Telugu", "Angkor", "Annapurna SIL", "Annie Use Your Telescope", "Anonymous Pro", "Anta", "Antic", "Antic Didone", "Antic Slab", "Anton", "Anton SC", "Antonio", "Anuphan", "Anybody", "Aoboshi One", "Arapey", "Arbutus", "Arbutus Slab", "Architects Daughter", "Archivo", "Archivo Black", "Archivo Narrow", "Are You Serious", "Aref Ruqaa", "Aref Ruqaa Ink", "Arima", "Arimo", "Arizonia", "Armata", "Arsenal", "Arsenal SC", "Artifika", "Arvo", "Arya", "Asap", "Asap Condensed", "Asap Sharp", "Asar", "Asimovian", "Asset", "Assistant", "Asta Sans", "Astloch", "Asul", "Athiti", "Atkinson Hyperlegible", "Atkinson Hyperlegible Mono", "Atkinson Hyperlegible Next", "Atma", "Atomic Age", "Aubrey", "Audiowide", "Autour One", "Average", "Average Sans", "Averia Gruesa Libre", "Averia Libre", "Averia Sans Libre", "Averia Serif Libre", "Azeret Mono", "B612", "B612 Mono", "BBH Bartle", "BBH Bogle", "BBH Hegarty", "BIZ UDGothic", "BIZ UDMincho", "BIZ UDPGothic", "BIZ UDPMincho", "BJCree", "Babylonica", "Bacasime Antique", "Bad Script", "Badeen Display", "Bagel Fat One", "Bahiana", "Bahianita", "Bai Jamjuree", "Bakbak One", "Ballet", "Baloo 2", "Baloo Bhai 2", "Baloo Bhaijaan 2", "Baloo Bhaina 2", "Baloo Chettan 2", "Baloo Da 2", "Baloo Paaji 2", "Baloo Tamma 2", "Baloo Tammudu 2", "Baloo Thambi 2", "Balsamiq Sans", "Balthazar", "Bangers", "Barlow", "Barlow Condensed", "Barlow Semi Condensed", "Barriecito", "Barrio", "Basic", "Baskervville", "Baskervville SC", "Battambang", "Baumans", "Bayon", "Be Vietnam Pro", "Beau Rivage", "Bebas Neue", "Beiruti", "Belanosima", "Belgrano", "Bellefair", "Belleza", "Bellota", "Bellota Text", "BenchNine", "Benne", "Bentham", "Berkshire Swash", "Besley", "Betania Patmos", "Betania Patmos GDL", "Betania Patmos In", "Betania Patmos In GDL", "Beth Ellen", "Bevan", "BhuTuka Expanded One", "Big Shoulders", "Big Shoulders Inline", "Big Shoulders Stencil", "Bigelow Rules", "Bigshot One", "Bilbo", "Bilbo Swash Caps", "BioRhyme", "BioRhyme Expanded", "Birthstone", "Birthstone Bounce", "Biryani", "Bitcount", "Bitcount Grid Double", "Bitcount Grid Double Ink", "Bitcount Grid Single", "Bitcount Grid Single Ink", "Bitcount Ink", "Bitcount Prop Double", "Bitcount Prop Double Ink", "Bitcount Prop Single", "Bitcount Prop Single Ink", "Bitcount Single", "Bitcount Single Ink", "Bitter", "Black And White Picture", "Black Han Sans", "Black Ops One", "Blaka", "Blaka Hollow", "Blaka Ink", "Blinker", "Bodoni Moda", "Bodoni Moda SC", "Bokor", "Boldonse", "Bona Nova", "Bona Nova SC", "Bonbon", "Bonheur Royale", "Boogaloo", "Borel", "Bowlby One", "Bowlby One SC", "Bpmf Huninn", "Bpmf Iansui", "Bpmf Zihi Kai Std", "Braah One", "Brawler", "Bree Serif", "Bricolage Grotesque", "Bruno Ace", "Bruno Ace SC", "Brygada 1918", "Bubblegum Sans", "Bubbler One", "Buda", "Buenard", "Bungee", "Bungee Hairline", "Bungee Inline", "Bungee Outline", "Bungee Shade", "Bungee Spice", "Bungee Tint", "Butcherman", "Butterfly Kids", "Bytesized", "Caacupe One", "Cabin", "Cabin Condensed", "Cabin Sketch", "Cactus Classical Serif", "Caesar Dressing", "Cagliostro", "Cairo", "Cairo Play", "Cal Sans", "Caladea", "Calistoga", "Calligraffitti", "Cambay", "Cambo", "Candal", "Cantarell", "Cantata One", "Cantora One", "Caprasimo", "Capriola", "Caramel", "Carattere", "Cardo", "Carlito", "Carme", "Carrois Gothic", "Carrois Gothic SC", "Carter One", "Cascadia Code", "Cascadia Mono", "Castoro", "Castoro Titling", "Catamaran", "Caudex", "Cause", "Caveat", "Caveat Brush", "Cedarville Cursive", "Ceviche One", "Chakra Petch", "Changa", "Changa One", "Chango", "Charis SIL", "Charm", "Charmonman", "Chathura", "Chau Philomene One", "Chela One", "Chelsea Market", "Chenla", "Cherish", "Cherry Bomb One", "Cherry Cream Soda", "Cherry Swash", "Chewy", "Chicle", "Chilanka", "Chiron GoRound TC", "Chiron Hei HK", "Chiron Sung HK", "Chivo", "Chivo Mono", "Chocolate Classical Sans", "Chokokutai", "Chonburi", "Cinzel", "Cinzel Decorative", "Clarity City", "Clicker Script", "Climate Crisis", "Coda", "Codystar", "Coiny", "Combo", "Comfortaa", "Comforter", "Comforter Brush", "Comic Neue", "Comic Relief", "Coming Soon", "Comme", "Commissioner", "Concert One", "Condiment", "Content", "Contrail One", "Convergence", "Cookie", "Copse", "Coral Pixels", "Corben", "Corinthia", "Cormorant", "Cormorant Garamond", "Cormorant Infant", "Cormorant SC", "Cormorant Unicase", "Cormorant Upright", "Cossette Texte", "Cossette Titre", "Courgette", "Courier Prime", "Cousine", "Coustard", "Covered By Your Grace", "Crafty Girls", "Creepster", "Crete Round", "Crimson Pro", "Crimson Text", "Croissant One", "Crushed", "Cuprum", "Cute Font", "Cutive", "Cutive Mono", "DM Mono", "DM Sans", "DM Serif Display", "DM Serif Text", "Dai Banna SIL", "Damion", "Dancing Script", "Danfo", "Dangrek", "Darker Grotesque", "Darumadrop One", "Datatype", "David Libre", "Dawning of a New Day", "Days One", "Dekko", "Dela Gothic One", "Delicious Handrawn", "Delius", "Delius Swash Caps", "Delius Unicase", "Della Respira", "Denk One", "Devonshire", "Dhurjati", "Didact Gothic", "Diphylleia", "Diplomata", "Diplomata SC", "Do Hyeon", "Dokdo", "Domine", "Donegal One", "Dongle", "Doppio One", "Dorsa", "Dosis", "DotGothic16", "Doto", "Dr Sugiyama", "Duru Sans", "DynaPuff", "Dynalight", "EB Garamond", "Eagle Lake", "East Sea Dokdo", "Eater", "Economica", "Eczar", "Edu AU VIC WA NT Arrows", "Edu AU VIC WA NT Dots", "Edu AU VIC WA NT Guides", "Edu AU VIC WA NT Hand", "Edu AU VIC WA NT Pre", "Edu NSW ACT Cursive", "Edu NSW ACT Foundation", "Edu NSW ACT Hand Pre", "Edu QLD Beginner", "Edu QLD Hand", "Edu SA Beginner", "Edu SA Hand", "Edu TAS Beginner", "Edu VIC WA NT Beginner", "Edu VIC WA NT Hand", "Edu VIC WA NT Hand Pre", "El Messiri", "Electrolize", "Elms Sans", "Elsie", "Elsie Swash Caps", "Emblema One", "Emilys Candy", "Encode Sans", "Encode Sans Condensed", "Encode Sans Expanded", "Encode Sans SC", "Encode Sans Semi Condensed", "Encode Sans Semi Expanded", "Engagement", "Englebert", "Enriqueta", "Ephesis", "Epilogue", "Epunda Sans", "Epunda Slab", "Erica One", "Esteban", "Estedad", "Estonia", "Euphoria Script", "Ewert", "Exile", "Exo", "Exo 2", "Expletus Sans", "Explora", "Faculty Glyphic", "Fahkwang", "Familjen Grotesk", "Fanwood Text", "Farro", "Farsan", "Fascinate", "Fascinate Inline", "Faster One", "Fasthand", "Fauna One", "Faustina", "Federant", "Federo", "Felipa", "Fenix", "Festive", "Figtree", "Finger Paint", "Finlandica Headline", "Finlandica Text", "Fira Code", "Fira Mono", "Fira Sans", "Fira Sans Condensed", "Fira Sans Extra Condensed", "Fjalla One", "Fjord One", "Flamenco", "Flavors", "Fleur De Leah", "Flow Block", "Flow Circular", "Flow Rounded", "Foldit", "Fondamento", "Fontdiner Swanky", "Forum", "Fragment Mono", "Francois One", "Frank Ruhl Libre", "Fraunces", "Freckle Face", "Fredericka the Great", "Fredoka", "Freehand", "Freeman", "Fresca", "Frijole", "Fruktur", "Fugaz One", "Fuggles", "Funnel Display", "Funnel Sans", "Fustat", "Fuzzy Bubbles", "GFS Didot", "GFS Neohellenic", "Ga Maamli", "Gabarito", "Gabriela", "Gaegu", "Gafata", "Gajraj One", "Galada", "Galdeano", "Galindo", "Gamja Flower", "Gantari", "Gasoek One", "Gayathri", "Geist", "Geist Mono", "Geist Pixel", "Gelasio", "Gemunu Libre", "Genos", "Gentium Book Plus", "Gentium Plus", "Geo", "Geologica", "Geom", "Geomini", "Georama", "Geostar", "Geostar Fill", "Germania One", "Gideon Roman", "Gidole", "Gidugu", "Gilda Display", "Girassol", "Give You Glory", "Glass Antiqua", "Glegoo", "Gloock", "Gloria Hallelujah", "Glory", "Gluten", "Goblin One", "Gochi Hand", "Goldman", "Golos Text", "Google Sans", "Google Sans Code", "Google Sans Flex", "Gorditas", "Gothic A1", "Gotu", "Goudy Bookletter 1911", "Gowun Batang", "Gowun Dodum", "Graduate", "Grand Hotel", "Grandiflora One", "Grandstander", "Grape Nuts", "Gravitas One", "Great Vibes", "Grechen Fuemen", "Grenze", "Grenze Gotisch", "Grey Qo", "Griffy", "Gruppo", "Gudea", "Gugi", "Gulzar", "Gupter", "Gurajada", "Gveret Levin", "Gwendolyn", "Habibi", "Hachi Maru Pop", "Hahmlet", "Halant", "Hammersmith One", "Hanalei", "Hanalei Fill", "Handjet", "Handlee", "Hanken Grotesk", "Hanuman", "Happy Monkey", "Harmattan", "Headland One", "Hedvig Letters Sans", "Hedvig Letters Serif", "Heebo", "Henny Penny", "Hepta Slab", "Herr Von Muellerhoff", "Hi Melody", "Hibur Mono", "Hina Mincho", "Hind", "Hind Guntur", "Hind Madurai", "Hind Mysuru", "Hind Siliguri", "Hind Vadodara", "Holtwood One SC", "Homemade Apple", "Homenaje", "Honk", "Host Grotesk", "Hubballi", "Hubot Sans", "Huninn", "Hurricane", "IBM Plex Mono", "IBM Plex Sans", "IBM Plex Sans Arabic", "IBM Plex Sans Condensed", "IBM Plex Sans Devanagari", "IBM Plex Sans Hebrew", "IBM Plex Sans JP", "IBM Plex Sans KR", "IBM Plex Sans Thai", "IBM Plex Sans Thai Looped", "IBM Plex Serif", "IM Fell DW Pica", "IM Fell DW Pica SC", "IM Fell Double Pica", "IM Fell Double Pica SC", "IM Fell English", "IM Fell English SC", "IM Fell French Canon", "IM Fell French Canon SC", "IM Fell Great Primer", "IM Fell Great Primer SC", "Iansui", "Ibarra Real Nova", "Iceberg", "Iceland", "Idiqlat", "Imbue", "Imperial Script", "Imprima", "Inclusive Sans", "Inconsolata", "Inder", "Indie Flower", "Ingrid Darling", "Inika", "Inknut Antiqua", "Inria Sans", "Inria Serif", "Inspiration", "Instrument Sans", "Instrument Serif", "Intel One Mono", "Inter", "Inter Tight", "Iosevka Charon", "Iosevka Charon Mono", "Irish Grover", "Island Moments", "Isometra", "Istok Web", "Italiana", "Italianno", "Itim", "Jacquard 12", "Jacquard 12 Charted", "Jacquard 24", "Jacquard 24 Charted", "Jacquarda Bastarda 9", "Jacquarda Bastarda 9 Charted", "Jacques Francois", "Jacques Francois Shadow", "Jaini", "Jaini Purva", "Jaldi", "Jaro", "Jersey 10", "Jersey 10 Charted", "Jersey 15", "Jersey 15 Charted", "Jersey 20", "Jersey 20 Charted", "Jersey 25", "Jersey 25 Charted", "JetBrains Mono", "Jim Nightshade", "Joan", "Jockey One", "Jolly Lodger", "Jomhuria", "Jomolhari", "Josefin Sans", "Josefin Slab", "Jost", "Joti One", "Jua", "Judson", "Julee", "Julius Sans One", "Junge", "Jura", "Just Another Hand", "Just Me Again Down Here", "K2D", "Kablammo", "Kadwa", "Kaisei Decol", "Kaisei HarunoUmi", "Kaisei Opti", "Kaisei Tokumin", "Kalam", "Kalnia", "Kalnia Glaze", "Kameron", "Kanchenjunga", "Kanit", "Kantumruy Pro", "Kapakana", "Karantina", "Karla", "Karla Tamil Inclined", "Karla Tamil Upright", "Karma", "Katibeh", "Kaushan Script", "Kavivanar", "Kavoon", "Kay Pho Du", "Kdam Thmor Pro", "Keania One", "Kedebideri", "Kelly Slab", "Kenia", "Khand", "Khmer", "Khula", "Kings", "Kirang Haerang", "Kite One", "Kiwi Maru", "Klee One", "Knewave", "KoHo", "Kodchasan", "Kode Mono", "Koh Santepheap", "Kolker Brush", "Konkhmer Sleokchher", "Kosugi", "Kosugi Maru", "Kotta One", "Koulen", "Kranky", "Kreon", "Kripa", "Kristi", "Krona One", "Krub", "Kufam", "Kulim Park", "Kumar One", "Kumar One Outline", "Kumbh Sans", "Kurale", "LINE Seed JP", "LXGW Marker Gothic", "LXGW WenKai Mono TC", "LXGW WenKai TC", "La Belle Aurore", "Labrada", "Lacquer", "Laila", "Lakki Reddy", "Lalezar", "Lancelot", "Langar", "Lateef", "Lato", "Lavishly Yours", "League Gothic", "League Script", "League Spartan", "Leckerli One", "Ledger", "Lekton", "Lemon", "Lemonada", "Lexend", "Lexend Deca", "Lexend Exa", "Lexend Giga", "Lexend Mega", "Lexend Peta", "Lexend Tera", "Lexend Zetta", "Libertinus Keyboard", "Libertinus Math", "Libertinus Mono", "Libertinus Sans", "Libertinus Serif", "Libertinus Serif Display", "Libre Barcode 128", "Libre Barcode 128 Text", "Libre Barcode 39", "Libre Barcode 39 Extended", "Libre Barcode 39 Extended Text", "Libre Barcode 39 Text", "Libre Barcode EAN13 Text", "Libre Baskerville", "Libre Bodoni", "Libre Caslon Condensed", "Libre Caslon Display", "Libre Caslon Text", "Libre Franklin", "Licorice", "Life Savers", "Lilex", "Lilita One", "Lily Script One", "Limelight", "Linden Hill", "Linefont", "Lisu Bosa", "Liter", "Literata", "Liu Jian Mao Cao", "Livvic", "Lobster", "Lobster Two", "Londrina Outline", "Londrina Shadow", "Londrina Sketch", "Londrina Solid", "Long Cang", "Lora", "Love Light", "Love Ya Like A Sister", "Loved by the King", "Lovers Quarrel", "Luckiest Guy", "Lugrasimo", "Lumanosimo", "Lunasima", "Lusitana", "Lustria", "Luxurious Roman", "Luxurious Script", "M PLUS 1", "M PLUS 1 Code", "M PLUS 1p", "M PLUS 2", "M PLUS Code Latin", "M PLUS Rounded 1c", "M PLUS U", "Ma Shan Zheng", "Macondo", "Macondo Swash Caps", "Mada", "Madimi One", "Magra", "Maiden Orange", "Maitree", "Major Mono Display", "Mako", "Mali", "Mallanna", "Maname", "Mandali", "Manjari", "Manrope", "Mansalva", "Manuale", "Manufacturing Consent", "Marcellus", "Marcellus SC", "Marck Script", "Margarine", "Marhey", "Markazi Text", "Marko One", "Marmelad", "Martel", "Martel Sans", "Martian Mono", "Marvel", "Matangi", "Mate", "Mate SC", "Matemasie", "Maven Pro", "McLaren", "Mea Culpa", "Meddon", "MedievalSharp", "Medula One", "Meera Inimai", "Megrim", "Meie Script", "Menbere", "Meow Script", "Merienda", "Merriweather", "Merriweather Sans", "Metal", "Metal Mania", "Metamorphous", "Metrophobic", "Michroma", "Micro 5", "Micro 5 Charted", "Milonga", "Miltonian", "Miltonian Tattoo", "Mina", "Mingzat", "Miniver", "Miranda Sans", "Miriam Libre", "Mirza", "Miss Fajardose", "Mitr", "Mochiy Pop One", "Mochiy Pop P One", "Modak", "Modern Antiqua", "Moderustic", "Mogra", "Mohave", "Moirai One", "Molengo", "Molle", "Momo Signature", "Momo Trust Display", "Momo Trust Sans", "Mona Sans", "Monda", "Monofett", "Monomakh", "Monomaniac One", "Monoton", "Monsieur La Doulaise", "Montaga", "Montagu Slab", "MonteCarlo", "Montenegrin Gothic One", "Montez", "Montserrat", "Montserrat Alternates", "Montserrat Underline", "Moo Lah Lah", "Mooli", "Moon Dance", "Moul", "Moulpali", "Mountains of Christmas", "Mouse Memoirs", "Mozilla Headline", "Mozilla Text", "Mr Bedfort", "Mr Dafoe", "Mr De Haviland", "Mrs Saint Delafield", "Mrs Sheppards", "Ms Madi", "Mukta", "Mukta Mahee", "Mukta Malar", "Mukta Vaani", "Mulish", "Murecho", "MuseoModerno", "My Soul", "Mynerve", "Mystery Quest", "NTR", "Nabla", "Namdhinggo", "Nanum Brush Script", "Nanum Gothic", "Nanum Gothic Coding", "Nanum Myeongjo", "Nanum Pen Script", "Narnoor", "Nata Sans", "National Park", "Neonderthaw", "Nerko One", "Neucha", "Neuton", "New Amsterdam", "New Rocker", "New Tegomin", "News Cycle", "Newsreader", "Niconne", "Niramit", "Nixie One", "Nobile", "Nokora", "Norican", "Nosifer", "Notable", "Nothing You Could Do", "Noticia Text", "Noto Color Emoji", "Noto Emoji", "Noto Kufi Arabic", "Noto Music", "Noto Naskh Arabic", "Noto Nastaliq Urdu", "Noto Rashi Hebrew", "Noto Sans", "Noto Sans Adlam", "Noto Sans Adlam Unjoined", "Noto Sans Anatolian Hieroglyphs", "Noto Sans Arabic", "Noto Sans Armenian", "Noto Sans Avestan", "Noto Sans Balinese", "Noto Sans Bamum", "Noto Sans Bassa Vah", "Noto Sans Batak", "Noto Sans Bengali", "Noto Sans Bhaiksuki", "Noto Sans Brahmi", "Noto Sans Buginese", "Noto Sans Buhid", "Noto Sans Canadian Aboriginal", "Noto Sans Carian", "Noto Sans Caucasian Albanian", "Noto Sans Chakma", "Noto Sans Cham", "Noto Sans Cherokee", "Noto Sans Chorasmian", "Noto Sans Coptic", "Noto Sans Cuneiform", "Noto Sans Cypriot", "Noto Sans Cypro Minoan", "Noto Sans Deseret", "Noto Sans Devanagari", "Noto Sans Display", "Noto Sans Duployan", "Noto Sans Egyptian Hieroglyphs", "Noto Sans Elbasan", "Noto Sans Elymaic", "Noto Sans Ethiopic", "Noto Sans Georgian", "Noto Sans Glagolitic", "Noto Sans Gothic", "Noto Sans Grantha", "Noto Sans Gujarati", "Noto Sans Gunjala Gondi", "Noto Sans Gurmukhi", "Noto Sans HK", "Noto Sans Hanifi Rohingya", "Noto Sans Hanunoo", "Noto Sans Hatran", "Noto Sans Hebrew", "Noto Sans Imperial Aramaic", "Noto Sans Indic Siyaq Numbers", "Noto Sans Inscriptional Pahlavi", "Noto Sans Inscriptional Parthian", "Noto Sans JP", "Noto Sans Javanese", "Noto Sans KR", "Noto Sans Kaithi", "Noto Sans Kannada", "Noto Sans Kawi", "Noto Sans Kayah Li", "Noto Sans Kharoshthi", "Noto Sans Khmer", "Noto Sans Khojki", "Noto Sans Khudawadi", "Noto Sans Lao", "Noto Sans Lao Looped", "Noto Sans Lepcha", "Noto Sans Limbu", "Noto Sans Linear A", "Noto Sans Linear B", "Noto Sans Lisu", "Noto Sans Lycian", "Noto Sans Lydian", "Noto Sans Mahajani", "Noto Sans Malayalam", "Noto Sans Mandaic", "Noto Sans Manichaean", "Noto Sans Marchen", "Noto Sans Masaram Gondi", "Noto Sans Math", "Noto Sans Mayan Numerals", "Noto Sans Medefaidrin", "Noto Sans Meetei Mayek", "Noto Sans Mende Kikakui", "Noto Sans Meroitic", "Noto Sans Miao", "Noto Sans Modi", "Noto Sans Mongolian", "Noto Sans Mono", "Noto Sans Mro", "Noto Sans Multani", "Noto Sans Myanmar", "Noto Sans NKo", "Noto Sans NKo Unjoined", "Noto Sans Nabataean", "Noto Sans Nag Mundari", "Noto Sans Nandinagari", "Noto Sans New Tai Lue", "Noto Sans Newa", "Noto Sans Nushu", "Noto Sans Ogham", "Noto Sans Ol Chiki", "Noto Sans Old Hungarian", "Noto Sans Old Italic", "Noto Sans Old North Arabian", "Noto Sans Old Permic", "Noto Sans Old Persian", "Noto Sans Old Sogdian", "Noto Sans Old South Arabian", "Noto Sans Old Turkic", "Noto Sans Oriya", "Noto Sans Osage", "Noto Sans Osmanya", "Noto Sans Pahawh Hmong", "Noto Sans Palmyrene", "Noto Sans Pau Cin Hau", "Noto Sans PhagsPa", "Noto Sans Phoenician", "Noto Sans Psalter Pahlavi", "Noto Sans Rejang", "Noto Sans Runic", "Noto Sans SC", "Noto Sans Samaritan", "Noto Sans Saurashtra", "Noto Sans Sharada", "Noto Sans Shavian", "Noto Sans Siddham", "Noto Sans SignWriting", "Noto Sans Sinhala", "Noto Sans Sogdian", "Noto Sans Sora Sompeng", "Noto Sans Soyombo", "Noto Sans Sundanese", "Noto Sans Sunuwar", "Noto Sans Syloti Nagri", "Noto Sans Symbols", "Noto Sans Symbols 2", "Noto Sans Syriac", "Noto Sans Syriac Eastern", "Noto Sans Syriac Western", "Noto Sans TC", "Noto Sans Tagalog", "Noto Sans Tagbanwa", "Noto Sans Tai Le", "Noto Sans Tai Tham", "Noto Sans Tai Viet", "Noto Sans Takri", "Noto Sans Tamil", "Noto Sans Tamil Supplement", "Noto Sans Tangsa", "Noto Sans Telugu", "Noto Sans Thaana", "Noto Sans Thai", "Noto Sans Thai Looped", "Noto Sans Tifinagh", "Noto Sans Tirhuta", "Noto Sans Ugaritic", "Noto Sans Vai", "Noto Sans Vithkuqi", "Noto Sans Wancho", "Noto Sans Warang Citi", "Noto Sans Yi", "Noto Sans Zanabazar Square", "Noto Serif", "Noto Serif Ahom", "Noto Serif Armenian", "Noto Serif Balinese", "Noto Serif Bengali", "Noto Serif Devanagari", "Noto Serif Display", "Noto Serif Dives Akuru", "Noto Serif Dogra", "Noto Serif Ethiopic", "Noto Serif Georgian", "Noto Serif Grantha", "Noto Serif Gujarati", "Noto Serif Gurmukhi", "Noto Serif HK", "Noto Serif Hebrew", "Noto Serif Hentaigana", "Noto Serif JP", "Noto Serif KR", "Noto Serif Kannada", "Noto Serif Khitan Small Script", "Noto Serif Khmer", "Noto Serif Khojki", "Noto Serif Lao", "Noto Serif Makasar", "Noto Serif Malayalam", "Noto Serif Myanmar", "Noto Serif NP Hmong", "Noto Serif Old Uyghur", "Noto Serif Oriya", "Noto Serif Ottoman Siyaq", "Noto Serif SC", "Noto Serif Sinhala", "Noto Serif TC", "Noto Serif Tamil", "Noto Serif Tangut", "Noto Serif Telugu", "Noto Serif Thai", "Noto Serif Tibetan", "Noto Serif Todhri", "Noto Serif Toto", "Noto Serif Vithkuqi", "Noto Serif Yezidi", "Noto Traditional Nushu", "Noto Znamenny Musical Notation", "Nova Cut", "Nova Flat", "Nova Mono", "Nova Oval", "Nova Round", "Nova Script", "Nova Slim", "Nova Square", "Numans", "Nunito", "Nunito Sans", "Nuosu SIL", "Odibee Sans", "Odor Mean Chey", "Offside", "Oi", "Ojuju", "Old Standard TT", "Oldenburg", "Ole", "Oleo Script", "Oleo Script Swash Caps", "Onest", "Oooh Baby", "Open Sans", "Oranienbaum", "Orbit", "Orbitron", "Oregano", "Orelega One", "Orienta", "Original Surfer", "Oswald", "Outfit", "Over the Rainbow", "Overlock", "Overlock SC", "Overpass", "Overpass Mono", "Ovo", "Oxanium", "Oxygen", "Oxygen Mono", "PT Mono", "PT Sans", "PT Sans Caption", "PT Sans Narrow", "PT Serif", "PT Serif Caption", "Pacifico", "Padauk", "Padyakke Expanded One", "Palanquin", "Palanquin Dark", "Palette Mosaic", "Pangolin", "Paprika", "Parastoo", "Parisienne", "Parkinsans", "Passero One", "Passion One", "Passions Conflict", "Pathway Extreme", "Pathway Gothic One", "Patrick Hand", "Patrick Hand SC", "Pattaya", "Patua One", "Pavanam", "Paytone One", "Peddana", "Peralta", "Permanent Marker", "Petemoss", "Petit Formal Script", "Petrona", "Phetsarath", "Philosopher", "Phudu", "Piazzolla", "Piedra", "Pinyon Script", "Pirata One", "Pixelify Sans", "Plaster", "Platypi", "Play", "Playball", "Playfair", "Playfair Display", "Playfair Display SC", "Playpen Sans", "Playpen Sans Arabic", "Playpen Sans Deva", "Playpen Sans Hebrew", "Playpen Sans Thai", "Playwrite AR", "Playwrite AR Guides", "Playwrite AT", "Playwrite AT Guides", "Playwrite AU NSW", "Playwrite AU NSW Guides", "Playwrite AU QLD", "Playwrite AU QLD Guides", "Playwrite AU SA", "Playwrite AU SA Guides", "Playwrite AU TAS", "Playwrite AU TAS Guides", "Playwrite AU VIC", "Playwrite AU VIC Guides", "Playwrite BE VLG", "Playwrite BE VLG Guides", "Playwrite BE WAL", "Playwrite BE WAL Guides", "Playwrite BR", "Playwrite BR Guides", "Playwrite CA", "Playwrite CA Guides", "Playwrite CL", "Playwrite CL Guides", "Playwrite CO", "Playwrite CO Guides", "Playwrite CU", "Playwrite CU Guides", "Playwrite CZ", "Playwrite CZ Guides", "Playwrite DE Grund", "Playwrite DE Grund Guides", "Playwrite DE LA", "Playwrite DE LA Guides", "Playwrite DE SAS", "Playwrite DE SAS Guides", "Playwrite DE VA", "Playwrite DE VA Guides", "Playwrite DK Loopet", "Playwrite DK Loopet Guides", "Playwrite DK Uloopet", "Playwrite DK Uloopet Guides", "Playwrite ES", "Playwrite ES Deco", "Playwrite ES Deco Guides", "Playwrite ES Guides", "Playwrite FR Moderne", "Playwrite FR Moderne Guides", "Playwrite FR Trad", "Playwrite FR Trad Guides", "Playwrite GB J", "Playwrite GB J Guides", "Playwrite GB S", "Playwrite GB S Guides", "Playwrite HR", "Playwrite HR Guides", "Playwrite HR Lijeva", "Playwrite HR Lijeva Guides", "Playwrite HU", "Playwrite HU Guides", "Playwrite ID", "Playwrite ID Guides", "Playwrite IE", "Playwrite IE Guides", "Playwrite IN", "Playwrite IN Guides", "Playwrite IS", "Playwrite IS Guides", "Playwrite IT Moderna", "Playwrite IT Moderna Guides", "Playwrite IT Trad", "Playwrite IT Trad Guides", "Playwrite MX", "Playwrite MX Guides", "Playwrite NG Modern", "Playwrite NG Modern Guides", "Playwrite NL", "Playwrite NL Guides", "Playwrite NO", "Playwrite NO Guides", "Playwrite NZ", "Playwrite NZ Basic", "Playwrite NZ Basic Guides", "Playwrite NZ Guides", "Playwrite PE", "Playwrite PE Guides", "Playwrite PL", "Playwrite PL Guides", "Playwrite PT", "Playwrite PT Guides", "Playwrite RO", "Playwrite RO Guides", "Playwrite SK", "Playwrite SK Guides", "Playwrite TZ", "Playwrite TZ Guides", "Playwrite US Modern", "Playwrite US Modern Guides", "Playwrite US Trad", "Playwrite US Trad Guides", "Playwrite VN", "Playwrite VN Guides", "Playwrite ZA", "Playwrite ZA Guides", "Pliant", "Plus Jakarta Sans", "Pochaevsk", "Podkova", "Poetsen One", "Poiret One", "Poller One", "Poltawski Nowy", "Poly", "Pompiere", "Ponnala", "Ponomar", "Pontano Sans", "Poor Story", "Poppins", "Port Lligat Sans", "Port Lligat Slab", "Potta One", "Pragati Narrow", "Praise", "Prata", "Preahvihear", "Press Start 2P", "Pridi", "Princess Sofia", "Prociono", "Prompt", "Prosto One", "Protest Guerrilla", "Protest Revolution", "Protest Riot", "Protest Strike", "Proza Libre", "Public Sans", "Puppies Play", "Puritan", "Purple Purse", "Qahiri", "Quando", "Quantico", "Quattrocento", "Quattrocento Sans", "Questrial", "Quicksand", "Quintessential", "Qwigley", "Qwitcher Grypen", "REM", "Racing Sans One", "Radio Canada", "Radio Canada Big", "Radley", "Rajdhani", "Rakkas", "Raleway", "Raleway Dots", "Ramabhadra", "Ramaraja", "Rambla", "Rammetto One", "Rampart One", "Ramsina", "Ranchers", "Rancho", "Ranga", "Rasa", "Rationale", "Ravi Prakash", "Readex Pro", "Recursive", "Red Hat Display", "Red Hat Mono", "Red Hat Text", "Red Rose", "Redacted", "Redacted Script", "Redaction", "Redaction 10", "Redaction 100", "Redaction 20", "Redaction 35", "Redaction 50", "Redaction 70", "Reddit Mono", "Reddit Sans", "Reddit Sans Condensed", "Redressed", "Reem Kufi", "Reem Kufi Fun", "Reem Kufi Ink", "Reenie Beanie", "Reggae One", "Rethink Sans", "Revalia", "Rhodium Libre", "Ribeye", "Ribeye Marrow", "Righteous", "Risque", "Road Rage", "Roboto", "Roboto Condensed", "Roboto Flex", "Roboto Mono", "Roboto Serif", "Roboto Slab", "Rochester", "Rock 3D", "Rock Salt", "RocknRoll One", "Rokkitt", "Romanesco", "Ropa Sans", "Rosario", "Rosarivo", "Rouge Script", "Rowdies", "Rozha One", "Rubik", "Rubik 80s Fade", "Rubik Beastly", "Rubik Broken Fax", "Rubik Bubbles", "Rubik Burned", "Rubik Dirt", "Rubik Distressed", "Rubik Doodle Shadow", "Rubik Doodle Triangles", "Rubik Gemstones", "Rubik Glitch", "Rubik Glitch Pop", "Rubik Iso", "Rubik Lines", "Rubik Maps", "Rubik Marker Hatch", "Rubik Maze", "Rubik Microbe", "Rubik Mono One", "Rubik Moonrocks", "Rubik Pixels", "Rubik Puddles", "Rubik Scribble", "Rubik Spray Paint", "Rubik Storm", "Rubik Vinyl", "Rubik Wet Paint", "Ruda", "Rufina", "Ruge Boogie", "Ruluko", "Rum Raisin", "Ruslan Display", "Russo One", "Ruthie", "Ruwudu", "Rye", "SN Pro", "STIX Two Math", "STIX Two Text", "SUSE", "SUSE Mono", "Sacramento", "Sahitya", "Sail", "Saira", "Saira Condensed", "Saira Extra Condensed", "Saira Semi Condensed", "Saira Stencil", "Salsa", "Sanchez", "Sancreek", "Sankofa Display", "Sansation", "Sansita", "Sansita Swashed", "Sarabun", "Sarala", "Sarina", "Sarpanch", "Sassy Frass", "Satisfy", "Savate", "Sawarabi Gothic", "Sawarabi Mincho", "Scada", "Scheherazade New", "Schibsted Grotesk", "Schoolbell", "Science Gothic", "Scope One", "Scoutie Sans", "Seaweed Script", "Secular One", "Sedan", "Sedan SC", "Sedgwick Ave", "Sedgwick Ave Display", "Sekuya", "Sen", "Send Flowers", "Sevillana", "Seymour One", "Shadows Into Light", "Shadows Into Light Two", "Shafarik", "Shalimar", "Shantell Sans", "Shanti", "Share", "Share Tech", "Share Tech Mono", "Shippori Antique", "Shippori Antique B1", "Shippori Mincho", "Shippori Mincho B1", "Shizuru", "Shojumaru", "Short Stack", "Shrikhand", "Siemreap", "Sigmar", "Sigmar One", "Signika", "Signika Negative", "Silkscreen", "Simonetta", "Single Day", "Sintony", "Sirin Stencil", "Sirivennela", "Six Caps", "Sixtyfour", "Sixtyfour Convergence", "Skranji", "Slabo 13px", "Slabo 27px", "Slackey", "Slackside One", "Smokum", "Smooch", "Smooch Sans", "Smythe", "Sniglet", "Snippet", "Snowburst One", "Sofadi One", "Sofia", "Sofia Sans", "Sofia Sans Condensed", "Sofia Sans Extra Condensed", "Sofia Sans Semi Condensed", "Solitreo", "Solway", "Sometype Mono", "Song Myung", "Sono", "Sonsie One", "Sora", "Sorts Mill Goudy", "Sour Gummy", "Source Code Pro", "Source Sans 3", "Source Serif 4", "Space Grotesk", "Space Mono", "Special Elite", "Special Gothic", "Special Gothic Condensed One", "Special Gothic Expanded One", "Spectral", "Spectral SC", "Spicy Rice", "Spinnaker", "Spirax", "Splash", "Spline Sans", "Spline Sans Mono", "Squada One", "Square Peg", "Sree Krushnadevaraya", "Sriracha", "Srisakdi", "Staatliches", "Stack Sans Headline", "Stack Sans Notch", "Stack Sans Text", "Stalemate", "Stalinist One", "Stardos Stencil", "Stick", "Stick No Bills", "Stint Ultra Condensed", "Stint Ultra Expanded", "Stoke", "Story Script", "Strait", "Strichpunkt Sans", "Style Script", "Stylish", "Sue Ellen Francisco", "Suez One", "Sulphur Point", "Sumana", "Sunflower", "Sunshiney", "Supermercado One", "Sura", "Suranna", "Suravaram", "Suwannaphum", "Swanky and Moo Moo", "Syncopate", "Syne", "Syne Mono", "Syne Tactile", "TASA Explorer", "TASA Orbiter", "Tac One", "Tagesschrift", "Tai Heritage Pro", "Tajawal", "Tangerine", "Tapestry", "Taprom", "Tauri", "Taviraj", "Teachers", "Teko", "Tektur", "Telex", "Tenali Ramakrishna", "Tenor Sans", "Text Me One", "Texturina", "Thasadith", "The Girl Next Door", "The Nautigal", "Tienne", "TikTok Sans", "Tillana", "Tilt Neon", "Tilt Prism", "Tilt Warp", "Timmana", "Tinos", "Tiny5", "Tiny5 Duo", "Tiro Bangla", "Tiro Devanagari Hindi", "Tiro Devanagari Marathi", "Tiro Devanagari Sanskrit", "Tiro Gurmukhi", "Tiro Kannada", "Tiro Tamil", "Tiro Telugu", "Tirra", "Titan One", "Titillium Web", "Tomorrow", "Tourney", "Trade Winds", "Train One", "Triodion", "Trirong", "Trispace", "Trocchi", "Trochut", "Truculenta", "Trykker", "Tsukimi Rounded", "Tuffy", "Tulpen One", "Turret Road", "Twinkle Star", "Ubuntu", "Ubuntu Condensed", "Ubuntu Mono", "Ubuntu Sans", "Ubuntu Sans Mono", "Uchen", "Ultra", "Unbounded", "Uncial Antiqua", "Underdog", "Unica One", "UnifrakturCook", "UnifrakturMaguntia", "Unkempt", "Unlock", "Unna", "UoqMunThenKhung", "Updock", "Urbanist", "VT323", "Valley Sans", "Vampiro One", "Varela", "Varela Round", "Varta", "Vast Shadow", "Vazirmatn", "Vend Sans", "Vesper Libre", "Viaoda Libre", "Vibes", "Vibur", "Victor Mono", "Vidaloka", "Viga", "Vina Sans", "Voces", "Volkhov", "Vollkorn", "Vollkorn SC", "Voltaire", "Vujahday Script", "WDXL Lubrifont JP N", "WDXL Lubrifont SC", "WDXL Lubrifont TC", "Waiting for the Sunrise", "Wallpoet", "Walter Turncoat", "Warnes", "Water Brush", "Waterfall", "Wavefont", "Wellfleet", "Wendy One", "Whisper", "WindSong", "Winky Rough", "Winky Sans", "Wire One", "Wittgenstein", "Wix Madefor Display", "Wix Madefor Text", "Work Sans", "Workbench", "Xanh Mono", "Xmind", "Yaldevi", "Yanone Kaffeesatz", "Yantramanav", "Yarndings 12", "Yarndings 12 Charted", "Yarndings 20", "Yarndings 20 Charted", "Yatra One", "Yellowtail", "Yeon Sung", "Yeseva One", "Yesteryear", "Yomogi", "Young Serif", "Yrsa", "Ysabeau", "Ysabeau Infant", "Ysabeau Office", "Ysabeau SC", "Yuji Boku", "Yuji Hentaigana Akari", "Yuji Hentaigana Akebono", "Yuji Mai", "Yuji Syuku", "Yusei Magic", "Yuyu", "Yuyu Short", "ZCOOL KuaiLe", "ZCOOL QingKe HuangYou", "ZCOOL XiaoWei", "Zain", "Zalando Sans", "Zalando Sans Expanded", "Zalando Sans SemiExpanded", "Zen Antique", "Zen Antique Soft", "Zen Dots", "Zen Kaku Gothic Antique", "Zen Kaku Gothic New", "Zen Kurenaido", "Zen Loop", "Zen Maru Gothic", "Zen Old Mincho", "Zen Tokyo Zoo", "Zeyada", "Zhi Mang Xing", "Zilla Slab", "Zilla Slab Highlight"];

  function ensureGoogleFont(family) {
    if (!family) return;
    var existing = document.head.querySelector('link[data-kcm-gfont="' + family.replace(/"/g, '') + '"]');
    if (existing) return;
    var urlFamily = family.trim().replace(/\s+/g, '+');
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + urlFamily + ':wght@300;400;500;600;700&display=swap';
    link.setAttribute('data-kcm-gfont', family);
    document.head.appendChild(link);
  }

  function renderFontSearchResults(query, resultsEl, onPick) {
    resultsEl.innerHTML = '';
    var q = query.trim().toLowerCase();
    if (!q) return;
    var matches = GOOGLE_FONTS_FAMILIES.filter(function (f) { return f.toLowerCase().indexOf(q) !== -1; }).slice(0, 8);
    if (!matches.length) {
      var empty = document.createElement('div');
      empty.className = 'kcm-ts__fontsearch-empty';
      empty.textContent = 'Sin resultados';
      resultsEl.appendChild(empty);
      return;
    }
    matches.forEach(function (fam) {
      var row = document.createElement('div');
      row.className = 'kcm-ts__fontsearch-item';
      row.style.fontFamily = "'" + fam + "'";
      row.textContent = fam;
      row.addEventListener('click', function (e) {
        e.stopPropagation();
        onPick(fam);
      });
      resultsEl.appendChild(row);
    });
  }

  var FONT_SEARCH_FIELDS = [
    { btn: 'kcmFontSearchBtn', popover: 'kcmFontSearchPopover', input: 'kcmFontSearchInput', results: 'kcmFontSearchResults', select: fontSel },
    { btn: 'kcmFontContentSearchBtn', popover: 'kcmFontContentSearchPopover', input: 'kcmFontContentSearchInput', results: 'kcmFontContentSearchResults', select: fontContentSel },
    { btn: 'kcmFontExtraSearchBtn', popover: 'kcmFontExtraSearchPopover', input: 'kcmFontExtraSearchInput', results: 'kcmFontExtraSearchResults', select: fontExtraSel }
  ];
  FONT_SEARCH_FIELDS.forEach(function (cfg) {
    var btn = document.getElementById(cfg.btn);
    var pop = document.getElementById(cfg.popover);
    var input = document.getElementById(cfg.input);
    var results = document.getElementById(cfg.results);
    if (!btn || !pop || !input || !results) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = pop.classList.contains('is-open');
      document.querySelectorAll('.kcm-ts__popover.is-open').forEach(function (p) { p.classList.remove('is-open'); });
      if (!wasOpen) {
        pop.classList.add('is-open');
        input.value = '';
        results.innerHTML = '';
        input.focus();
      }
    });
    pop.addEventListener('click', function (e) { e.stopPropagation(); });
    input.addEventListener('input', function () {
      renderFontSearchResults(input.value, results, function (fam) {
        ensureGoogleFont(fam);
        applyFontSelection(cfg.select, fam);
        cfg.select.dispatchEvent(new Event('change'));
        pop.classList.remove('is-open');
      });
    });
  });

  /* Tamaños de texto: arrancan leyendo el valor real ya calculado en la página */
  var h2Inp = document.getElementById('kcmH2');
  var h2bInp = document.getElementById('kcmH2b');
  var h3Inp = document.getElementById('kcmH3');
  var pInp = document.getElementById('kcmP');
  h2Inp.value = resolvePx('fontSize', '--size-h2', 48);
  h2bInp.value = resolvePx('fontSize', '--size-h2-2', 40);
  h3Inp.value = resolvePx('fontSize', '--size-h3', 24);
  pInp.value = resolvePx('fontSize', '--size-p', 16);
  h2Inp.addEventListener('input', function () {
    document.body.style.setProperty('--size-h2', (h2Inp.value || 0) + 'px');
  });
  h2bInp.addEventListener('input', function () {
    document.body.style.setProperty('--size-h2-2', (h2bInp.value || 0) + 'px');
  });
  h3Inp.addEventListener('input', function () {
    document.body.style.setProperty('--size-h3', (h3Inp.value || 0) + 'px');
  });
  pInp.addEventListener('input', function () {
    document.body.style.setProperty('--size-p', (pInp.value || 0) + 'px');
  });

  /* Engranaje de opciones extra por campo (H2/H2-2/H3/P): hoy solo trae el
     peso de fuente, pero queda preparado para sumar más campos a futuro
     sin ensanchar la barra. El campo arranca mostrando el valor real que
     ya tengas declarado (ej. en :root, body); si no hay ninguno, queda
     vacío ("auto") y no fuerza nada hasta que escribas un número. */
  function readWeight(cssVar) {
    return getComputedStyle(document.body).getPropertyValue(cssVar).trim();
  }
  var FONT_WEIGHT_VARS = [
    { gear: 'kcmH2Gear', popover: 'kcmH2Popover', input: 'kcmH2Weight', cssVar: '--font-weight-h2' },
    { gear: 'kcmH2bGear', popover: 'kcmH2bPopover', input: 'kcmH2bWeight', cssVar: '--font-weight-h2-2' },
    { gear: 'kcmH3Gear', popover: 'kcmH3Popover', input: 'kcmH3Weight', cssVar: '--font-weight-h3' },
    { gear: 'kcmPGear', popover: 'kcmPPopover', input: 'kcmPWeight', cssVar: '--font-weight-p' }
  ];
  var weightInputs = [];
  FONT_WEIGHT_VARS.forEach(function (cfg) {
    var gearBtn = document.getElementById(cfg.gear);
    var popoverEl = document.getElementById(cfg.popover);
    var weightInp = document.getElementById(cfg.input);
    weightInp.value = readWeight(cfg.cssVar);
    weightInputs.push(weightInp);
    gearBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = popoverEl.classList.contains('is-open');
      document.querySelectorAll('.kcm-ts__popover.is-open').forEach(function (p) { p.classList.remove('is-open'); });
      if (!wasOpen) popoverEl.classList.add('is-open');
    });
    popoverEl.addEventListener('click', function (e) { e.stopPropagation(); });
    weightInp.addEventListener('input', function () {
      var v = weightInp.value.trim();
      if (v === '') {
        document.body.style.removeProperty(cfg.cssVar);
      } else {
        document.body.style.setProperty(cfg.cssVar, v);
      }
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.kcm-ts__popover.is-open').forEach(function (p) { p.classList.remove('is-open'); });
  });

  /* Radius: un solo campo asigna el mismo valor a las 2 variables
     (--radius-principal y --radius-element), siempre, desde el primer
     momento en que carga el panel — igual que con los colores: un valor
     declarado, no una lectura separada de cada una. */
  var radiusInp = document.getElementById('kcmRadius');
  radiusInp.value = resolvePx('borderRadius', '--radius-principal', 40);
  radiusInp.addEventListener('input', function () {
    document.body.style.setProperty('--radius-principal', (radiusInp.value || 0) + 'px');
    document.body.style.setProperty('--radius-element', (radiusInp.value || 0) + 'px');
  });

  /* Estado inicial: reafirma en línea los valores ya leídos (punto de partida editable).
     --extrafont NO se reafirma aquí a propósito: si tu CSS real la deja sin declarar
     para que un fallback tipo var(--extrafont, var(--headlinefont)) decida en vivo,
     forzarla aquí rompería esa prueba. Se declara recién cuando tocas el selector "Extra". */
  document.body.style.setProperty('--headlinefont', "'" + fontSel.value + "'");
  document.body.style.setProperty('--contentfont', "'" + fontContentSel.value + "'");
  document.body.style.setProperty('--size-h2', h2Inp.value + 'px');
  document.body.style.setProperty('--size-h2-2', h2bInp.value + 'px');
  document.body.style.setProperty('--size-h3', h3Inp.value + 'px');
  document.body.style.setProperty('--size-p', pInp.value + 'px');
  document.body.style.setProperty('--radius-principal', radiusInp.value + 'px');
  document.body.style.setProperty('--radius-element', radiusInp.value + 'px');

  /* Colores: se arma la paleta "Default" a partir de los colores reales de la
     página (sin importar si coinciden o no con alguna de las configuradas), se
     pinta el botón con esos colores, y queda activo por defecto SIN reescribir
     el CSS (la página ya tiene estos mismos valores declarados por su cuenta). */
  PALETTES.default = readCurrentPalette();
  var defaultBtn = document.getElementById('kcmDefaultPal');
  if (defaultBtn) defaultBtn.style.background = swatchGradient(PALETTES.default);
  current = 'default';
  box.querySelectorAll('.kcm-ts__btn[data-pal]').forEach(function (b) {
    b.classList.toggle('is-active', b.dataset.pal === 'default');
  });
  updateSolidBtn();

  /* Botón "✕": quita todo lo que el panel haya forzado (colores, degradados,
     fuentes, tamaños, radio) y deja la página con sus valores reales. No cierra
     el panel: con tocar cualquier control se vuelve a aplicar normal. */
  var cancelBtn = document.getElementById('kcmCancelPal');
  cancelBtn.addEventListener('click', function () {
    styleEl.textContent = '';
    document.body.removeAttribute('data-pal');
    ['--headlinefont', '--contentfont', '--extrafont',
     '--size-h2', '--size-h2-2', '--size-h3', '--size-p',
     '--radius-principal', '--radius-element',
     '--font-weight-h2', '--font-weight-h2-2', '--font-weight-h3', '--font-weight-p'].forEach(function (v) {
      document.body.style.removeProperty(v);
    });
    FONT_WEIGHT_VARS.forEach(function (cfg) {
      document.getElementById(cfg.input).value = readWeight(cfg.cssVar);
    });
    current = null;
    solid = false;
    box.querySelectorAll('.kcm-ts__btn[data-pal]').forEach(function (b) {
      b.classList.remove('is-active');
    });
    updateSolidBtn();
    applyFontSelection(fontSel, resolveFontName('--headlinefont', 'Economica'));
    applyFontSelection(fontContentSel, resolveFontName('--contentfont', 'Manrope'));
    applyFontSelection(fontExtraSel, resolveFontName('--extrafont', ''));
    h2Inp.value = resolvePx('fontSize', '--size-h2', 48);
    h2bInp.value = resolvePx('fontSize', '--size-h2-2', 40);
    h3Inp.value = resolvePx('fontSize', '--size-h3', 24);
    pInp.value = resolvePx('fontSize', '--size-p', 16);
    radiusInp.value = resolvePx('borderRadius', '--radius-principal', 40);
  });

  /* ---------- Crear paleta personalizada a partir de la activa ---------- */

  var VAR_LABELS = [
    { key: '--primary-color-custom',   label: 'Primary' },
    { key: '--secondary-color-custom', label: 'Secondary' },
    { key: '--accent-color-custom',    label: 'Accent' },
    { key: '--accent-color-custom-2',  label: 'Accent 2' },
    { key: '--bg-p-d', label: 'BG Dark' },
    { key: '--bg-s-d', label: 'BG Dark 2' },
    { key: '--bg-p-l', label: 'BG Light' },
    { key: '--bg-s-l', label: 'BG Light 2' },
    { key: '--text-l', label: 'Text Light' },
    { key: '--text-d', label: 'Text Dark' }
  ];

  var panel = document.getElementById('kcmPanel');
  var panelBody = document.getElementById('kcmPanelBody');
  var panelClose = document.getElementById('kcmPanelClose');
  var editingKey = null;

  function refreshCircle(key) {
    var btn = box.querySelector('.kcm-ts__btn[data-pal="' + key + '"]');
    if (btn) btn.style.background = swatchGradient(PALETTES[key]);
  }

  function updateEditingVar(key, value) {
    if (!editingKey) return;
    PALETTES[editingKey][key] = value;
    refreshCircle(editingKey);
    apply(editingKey);
  }

  /* Mezcla un hex con blanco (pct>0) o negro (pct<0) para el preview del swatch,
     replicando en RGB lo que color-mix(in srgb, ...) haría en el navegador. */
  function mixHex(hex, pct) {
    var p = Math.round(parseFloat(pct)) || 0;
    if (!p) return hex;
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex);
    if (!m) return hex;
    var amt = Math.min(Math.abs(p), 100) / 100;
    var target = p > 0 ? 255 : 0;
    function ch(h) {
      var v = Math.round(parseInt(h, 16) * (1 - amt) + target * amt);
      return ('0' + v.toString(16)).slice(-2);
    }
    return '#' + ch(m[1]) + ch(m[2]) + ch(m[3]);
  }

  /* Construye un selector A o B para un degradado: elige entre las 10 variables
     base, o "Custom..." para escribir/elegir un color libre fuera del esquema. */
  function buildGradientSlot(paletteKey, gradName, slotName) {
    var recipe = getRecipe(paletteKey)[gradName];
    var wrap = document.createElement('div');
    wrap.className = 'kcm-panel__slot';

    /* Cuadrito con el color de la opción actualmente elegida (indicio visual) */
    var preview = document.createElement('span');
    preview.className = 'kcm-panel__preview';

    var sel = document.createElement('select');
    sel.className = 'kcm-panel__select';
    VAR_LABELS.forEach(function (item) {
      var opt = document.createElement('option');
      opt.value = item.key;
      opt.textContent = item.label;
      sel.appendChild(opt);
    });
    var customOpt = document.createElement('option');
    customOpt.value = 'custom';
    customOpt.textContent = 'Custom…';
    sel.appendChild(customOpt);
    sel.value = recipe[slotName];

    var customColor = document.createElement('input');
    customColor.type = 'color';
    customColor.className = 'kcm-panel__swatch kcm-panel__swatch--sm';
    var customHex = document.createElement('input');
    customHex.type = 'text';
    customHex.className = 'kcm-panel__hex kcm-panel__hex--sm';
    var startVal = recipe[slotName + 'Custom'] || '#ffffff';
    customColor.value = startVal;
    customHex.value = startVal;

    /* Mezcla con blanco/negro (-100 a 100) sobre el color ya elegido arriba,
       vía color-mix() en la fórmula real (ver resolveSlotValue). */
    var mixInput = document.createElement('input');
    mixInput.type = 'number';
    mixInput.min = '-100';
    mixInput.max = '100';
    mixInput.step = '1';
    mixInput.className = 'kcm-panel__mix';
    mixInput.title = 'Mezcla con blanco (+) o negro (-), de -100 a 100';
    mixInput.value = recipe[slotName + 'Mix'] || 0;

    function refreshPreview() {
      var base = (sel.value === 'custom')
        ? (recipe[slotName + 'Custom'] || '#ffffff')
        : (PALETTES[paletteKey][sel.value] || '#ffffff');
      preview.style.background = mixHex(base, recipe[slotName + 'Mix'] || 0);
    }

    function refreshVisibility() {
      var isCustom = sel.value === 'custom';
      customColor.style.display = isCustom ? '' : 'none';
      customHex.style.display = isCustom ? '' : 'none';
      refreshPreview();
    }
    refreshVisibility();

    function commit() {
      recipe[slotName] = sel.value;
      if (sel.value === 'custom') recipe[slotName + 'Custom'] = customHex.value;
      recipe.edited = true; /* esta paleta deja de usar la fórmula automática para ESTE degradado */
      refreshPreview();
      apply(paletteKey);
    }

    sel.addEventListener('change', function () { refreshVisibility(); commit(); });
    customColor.addEventListener('input', function () {
      customHex.value = customColor.value;
      commit();
    });
    customHex.addEventListener('input', function () {
      var v = customHex.value.trim();
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) {
        customColor.value = (v.length === 4) ? '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3] : v;
        commit();
      }
    });
    mixInput.addEventListener('input', function () {
      var v = Math.max(-100, Math.min(100, Math.round(parseFloat(mixInput.value)) || 0));
      recipe[slotName + 'Mix'] = v;
      commit();
    });

    wrap.appendChild(preview);
    wrap.appendChild(sel);
    wrap.appendChild(customColor);
    wrap.appendChild(customHex);
    wrap.appendChild(mixInput);
    return wrap;
  }

  function buildGradientRow(paletteKey, label, gradName) {
    var row = document.createElement('div');
    row.className = 'kcm-panel__gradrow';

    var title = document.createElement('div');
    title.className = 'kcm-panel__gradlabel';
    title.textContent = label + ' (A → B)';
    row.appendChild(title);

    var slots = document.createElement('div');
    slots.className = 'kcm-panel__gradslots';
    slots.appendChild(buildGradientSlot(paletteKey, gradName, 'a'));
    slots.appendChild(buildGradientSlot(paletteKey, gradName, 'b'));
    row.appendChild(slots);

    return row;
  }

  function openPanel(paletteKey) {
    editingKey = paletteKey;
    panelBody.innerHTML = '';
    VAR_LABELS.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'kcm-panel__row';

      var label = document.createElement('span');
      label.className = 'kcm-panel__label';
      label.textContent = item.label;

      var colorInp = document.createElement('input');
      colorInp.type = 'color';
      colorInp.className = 'kcm-panel__swatch';
      colorInp.value = PALETTES[paletteKey][item.key];

      var hexInp = document.createElement('input');
      hexInp.type = 'text';
      hexInp.className = 'kcm-panel__hex';
      hexInp.value = PALETTES[paletteKey][item.key];

      colorInp.addEventListener('input', function () {
        hexInp.value = colorInp.value;
        updateEditingVar(item.key, colorInp.value);
      });
      hexInp.addEventListener('input', function () {
        var v = hexInp.value.trim();
        if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) {
          colorInp.value = (v.length === 4)
            ? '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]
            : v;
          updateEditingVar(item.key, v);
        }
      });

      row.appendChild(label);
      row.appendChild(colorInp);
      row.appendChild(hexInp);
      panelBody.appendChild(row);
    });

    var divider = document.createElement('div');
    divider.className = 'kcm-panel__divider';
    divider.textContent = 'Degradados';
    panelBody.appendChild(divider);
    panelBody.appendChild(buildGradientRow(paletteKey, 'Texto', 'texto'));
    panelBody.appendChild(buildGradientRow(paletteKey, 'Botón', 'boton'));
    panelBody.appendChild(buildGradientRow(paletteKey, 'Fondo', 'fondo'));

    panel.classList.add('is-open');
  }

  panelClose.addEventListener('click', function () {
    panel.classList.remove('is-open');
    editingKey = null;
  });

  /* Elimina una paleta personalizada (pide confirmación primero, para evitar
     que se borre por accidente al hacer clic en la X). Nunca se llama con una
     de las paletas configuradas por el proyecto, porque esas no tienen la
     insignia de eliminar. */
  function deleteCustomPalette(key) {
    var confirmado = window.confirm('¿Eliminar esta paleta personalizada? Esta acción no se puede deshacer.');
    if (!confirmado) return;
    var btn = box.querySelector('.kcm-ts__btn[data-pal="' + key + '"]');
    if (btn) btn.remove();
    delete PALETTES[key];
    delete GRADIENT_RECIPES[key];
    if (editingKey === key) {
      panel.classList.remove('is-open');
      editingKey = null;
    }
    if (current === key) apply('default');
  }

  var customCount = 0;
  var addBtn = document.getElementById('kcmAddPal');
  addBtn.addEventListener('click', function () {
    customCount++;
    var newKey = 'custom' + customCount;
    var base = PALETTES[current] || PALETTES.default;
    PALETTES[newKey] = {};
    for (var k in base) PALETTES[newKey][k] = base[k];

    /* La receta de degradados (variable o color "Custom", editada o no) se
       copia tal cual de la paleta base, en vez de arrancar siempre en la
       fórmula automática — así una paleta nueva hereda la combinación real
       que tenía la paleta de la que partió. */
    var baseKey = current || 'default';
    var baseRecipe = getRecipe(baseKey);
    var baseIsDefault = (baseKey === 'default');
    /* Si ese degradado fue editado a mano, su receta ya es la fuente de verdad
       exacta (variable o "Custom", tal cual se eligió) — se clona directo.

       Si NO fue editado, el camino depende de la paleta base:
       - "Default": su verdad vive en el CSS real de la página, no en ninguna
         receta (la receta genérica ni siquiera refleja lo que se ve) — hay
         que leer el degradado real (ignorando nuestras propias hojas inyectadas)
         y extraer de ahí la variable, para no perder el vínculo dinámico.
       - Cualquier otra paleta (configurada o personalizada): su receta interna SÍ
         es la fuente de verdad exacta de lo que se está mostrando ahora
         mismo (fórmula automática o A→B editada) — leer el DOM aquí sería
         contraproducente, porque en ese momento el propio switcher ya tiene
         su override activo y excluirlo haría que se colara el CSS nativo
         de la página en su lugar, mezclando las dos capas. */
    var liveGradients = readCurrentGradients();
    var RAW_VAR_NAMES = { texto: '--degradado-texto', boton: '--degradado-boton', fondo: '--degradado-fondo' };
    function recipeForClone(gradName) {
      if (baseRecipe[gradName].edited) return cloneGradientSlot(baseRecipe[gradName]);
      if (!baseIsDefault) return cloneGradientSlot(baseRecipe[gradName]);
      /* Solo para "Default": primero intenta el texto crudo (conserva la
         variable real); si no encuentra ninguna regla aplicable, cae al
         valor ya resuelto. */
      var raw = findRawBodyValue(RAW_VAR_NAMES[gradName]) || liveGradients[gradName];
      var parsed = parseGradientToRecipe(raw);
      return parsed || cloneGradientSlot(baseRecipe[gradName]);
    }
    GRADIENT_RECIPES[newKey] = {
      texto: recipeForClone('texto'),
      boton: recipeForClone('boton'),
      fondo: recipeForClone('fondo')
    };

    var newBtn = document.createElement('button');
    newBtn.className = 'kcm-ts__btn';
    newBtn.dataset.pal = newKey;
    newBtn.setAttribute('aria-label', 'Custom palette ' + customCount);
    newBtn.style.background = swatchGradient(PALETTES[newKey]);

    var tip = document.createElement('span');
    tip.className = 'kcm-ts__tip';
    tip.textContent = 'Custom ' + customCount;
    newBtn.appendChild(tip);

    /* Insignia de editar: solo visible cuando este círculo está activo (ver CSS) */
    var editBadge = document.createElement('span');
    editBadge.className = 'kcm-ts__badge kcm-ts__badge--edit';
    editBadge.setAttribute('aria-label', 'Editar esta paleta');
    editBadge.textContent = '⚙';
    editBadge.addEventListener('click', function (e) {
      e.stopPropagation();
      openPanel(newKey);
    });
    newBtn.appendChild(editBadge);

    /* Insignia de eliminar: idem, solo visible cuando este círculo está activo */
    var deleteBadge = document.createElement('span');
    deleteBadge.className = 'kcm-ts__badge kcm-ts__badge--delete';
    deleteBadge.setAttribute('aria-label', 'Eliminar esta paleta');
    deleteBadge.textContent = '×';
    deleteBadge.addEventListener('click', function (e) {
      e.stopPropagation();
      deleteCustomPalette(newKey);
    });
    newBtn.appendChild(deleteBadge);

    newBtn.addEventListener('click', function () { selectPalette(newKey); });
    addBtn.parentNode.insertBefore(newBtn, addBtn);

    apply(newKey);
    openPanel(newKey);
  });

  /* ---------- Descargar la configuración actual ---------- */

  var downloadBtn = document.getElementById('kcmDownload');
  downloadBtn.addEventListener('click', function () {
    var lines = ['body {'];
    VAR_LABELS.forEach(function (item) {
      lines.push('  ' + item.key + ': ' + resolveFontName(item.key, '') + ';');
    });
    /* Se exportan ya resueltos, por si la combinación A/B no es la de siempre */
    lines.push('  --degradado-texto: ' + resolveFontName('--degradado-texto', '') + ';');
    lines.push('  --degradado-boton: ' + resolveFontName('--degradado-boton', '') + ';');
    lines.push('  --degradado-fondo: ' + resolveFontName('--degradado-fondo', '') + ';');
    lines.push('  --headlinefont: \'' + fontSel.value + '\';');
    lines.push('  --contentfont: \'' + fontContentSel.value + '\';');
    lines.push('  --size-h2: ' + h2Inp.value + 'px;');
    lines.push('  --size-h2-2: ' + h2bInp.value + 'px;');
    lines.push('  --size-h3: ' + h3Inp.value + 'px;');
    lines.push('  --size-p: ' + pInp.value + 'px;');
    lines.push('  --radius-principal: ' + radiusInp.value + 'px;');
    lines.push('  --radius-element: ' + radiusInp.value + 'px;');
    lines.push('}');

    var blob = new Blob([lines.join('\n')], { type: 'text/css' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'configuracion-colores.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
})();
