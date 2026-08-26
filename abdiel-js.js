/* ============================================================
   INICIA JS DE CINTA DE TEXTO (marquee): duplicado + duración
   ============================================================ */

window.addEventListener('load', () => {
  const tracks = document.querySelectorAll('.marquee-track'); // Selecciona todas las pistas de marquee

  tracks.forEach(track => {
    const textBlock = track.querySelector('.marquee-text'); // Bloque que contiene el texto original
    if (!textBlock) return; // Si este track no trae el bloque de texto, se salta (no rompe los demás)

    // Reemplaza saltos de línea <br> por un separador visual ✦
    // - Usamos regex /<br\s*\/?>/gi para cubrir <br>, <br/> y mayúsculas/minúsculas
    textBlock.innerHTML = textBlock.innerHTML.replace(/<br\s*\/?>/gi, '<span class="separator">✦</span>');

    // Duplica el contenido para lograr un bucle continuo (scroll infinito sin cortes)
    const clone = textBlock.cloneNode(true); // true = clona con hijos
    track.appendChild(clone);                // Añade la copia al final del track

    // Calcula la duración basada en el ancho real del contenido
    // - track.scrollWidth ahora es el ancho de texto original + clon (x2)
    const totalWidth = track.scrollWidth / 2; // Solo el ancho del bloque original
    const speed = 40;                        // Velocidad objetivo: 40 px/seg
    const duration = totalWidth / speed;      // Segundos que tarda en recorrer media pista

    // Setea la duración en la animación CSS (definida como linear infinite)
    track.style.animationDuration = duration + 's';
  });
});

/* ============================================================
   TERMINA JS DE CINTA DE TEXTO (marquee)
   ============================================================ */



/* ============================================================
   COMIENZA JS ANIMACIONES DE SCROLL (aparición por viewport)
   ============================================================ */

(function(){
  // Selecciona todos los elementos que tienen alguna de las clases de entrada
  const elementos = document.querySelectorAll('.scroll-left, .scroll-right, .scroll-bottom, .scroll-top');

  // Umbrales de activación/desactivación respecto al alto del viewport
  const APPEAR_AT = 0.70; // Activa cuando el top del elemento está por encima del 70% del viewport (entra al 30% inferior)
  const HIDE_TOP  = 0.10; // Oculta si el bottom sube por encima del 10% del viewport (se fue por arriba)
  const HIDE_BOT  = 0.90; // Oculta si el top baja por debajo del 90% del viewport (se fue por abajo)

  function fadeScroll() {
    const vh = window.innerHeight || document.documentElement.clientHeight; // Alto visible actual

    elementos.forEach((el) => {
      const rect = el.getBoundingClientRect(); // Métricas relativas al viewport

      const topIn      = rect.top    <= vh * APPEAR_AT; // ¿Entró lo suficiente?
      const notGoneTop = rect.bottom >= vh * HIDE_TOP;  // ¿Aún no se fue por arriba?
      const notGoneBot = rect.top    <= vh * HIDE_BOT;  // ¿Aún no se fue por abajo?

      if (topIn && notGoneTop && notGoneBot) {
        el.classList.add('ativo');   // Aparece (CSS gestiona el fade + translate -> none)
      } else {
        el.classList.remove('ativo'); // Desaparece (vuelve a estado inicial)
      }
    });
  }

  // Suscripción a eventos relevantes con buen performance
  window.addEventListener('scroll', fadeScroll, { passive: true }); // passive: true evita bloquear el scroll
  window.addEventListener('resize', fadeScroll);                    // Recalcula en cambios de tamaño
  window.addEventListener('load', fadeScroll);                      // Evalúa al terminar de cargar

  // Primera evaluación inmediata por si ya hay elementos en viewport
  fadeScroll();
})();

/* ============================================================
   TERMINA JS ANIMACIONES DE SCROLL
   ============================================================ */


/* ============================================================
   INICIA JS ROBA COLOR DEL BORDE PARA DIVISORES
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    const secciones = document.querySelectorAll('section, .section, [class*="section"]');
    
    secciones.forEach(function(seccion) {
        if (seccion.querySelector('.divider-top-ab, .divider-bottom-ab') || 
            seccion.classList.contains('divider-top-ab') || 
            seccion.classList.contains('divider-bottom-ab')) {
            
            const borderColor = window.getComputedStyle(seccion).borderTopColor;
            
            if (borderColor && 
                borderColor !== 'rgb(0, 0, 0)' && 
                borderColor !== 'rgba(0, 0, 0, 0)' &&
                borderColor !== 'transparent') {
                
                seccion.style.setProperty('--divider-color', borderColor);
            }
        }
    });
});

/* ============================================================
   TERMINA JS roba color del borde para divisores
   ============================================================ */


/* ============================================================
   INICIA JS AÑADIR CLASE A CADA PAGINA
   ============================================================ */


(function () {
  var host = window.location.hostname.replace(/^www\./, '');
  var clase = host.replace(/\./g, '-') + '-';
  var nuxtEl = document.getElementById('__nuxt');
  if (nuxtEl) nuxtEl.classList.add(clase);
})();

/* ============================================================
   TERMINA JS AÑADIR CLASE A CADA PAGINA
   ============================================================ */

/* ============================================================
   INICIA JS EFECTO APARECER ANUNCIO
   ============================================================ */

  window.addEventListener('load', function() {
    const anuncios = document.querySelectorAll('.contenedor-anuncio'); // Selecciona todos los elementos con la clase 'contenedor-anuncio'

    anuncios.forEach(function(anuncio) {
      // Después de 4 segundos, hazlo visible y clickeable
      setTimeout(function() {
        anuncio.classList.add('visible');
      }, 4000); // 4000 ms = 4 segundos
    });
  });

/* ============================================================
   TERMINA JS EFECTO APARECER ANUNCIO
   ============================================================ */

/* ============================================================
   INICIA JS ACTIVACION SIN VERIFICACION
   ============================================================ */

(function () {
  var DESTRUCTIVE_CLASS = 'hub365-ghl-not';

  var TRIGGERS = [
    'claseprefi-*',
    'claseexactasinesteric'
  ];

  function matchesTrigger(className) {
    for (var i = 0; i < TRIGGERS.length; i++) {
      var t = TRIGGERS[i];
      if (!t) continue;

      if (t.slice(-1) === '*') {
        var prefix = t.slice(0, -1);
        if (className.indexOf(prefix) === 0) return true;
      } else {
        if (className === t) return true;
      }
    }
    return false;
  }

  function findTriggerElement() {
    var els = document.querySelectorAll('[class]');
    for (var i = 0; i < els.length; i++) {
      var cl = els[i].classList;
      for (var j = 0; j < cl.length; j++) {
        if (matchesTrigger(cl[j])) return els[i];
      }
    }
    return null;
  }

  function activate(el) {
    if (!el || !el.classList) return false;
    if (el.classList.contains(DESTRUCTIVE_CLASS)) return true;
    el.classList.add(DESTRUCTIVE_CLASS);
    return true;
  }

  // 1) Intento inmediato
  var first = findTriggerElement();
  if (activate(first)) return;

  // 2) Espera cambios de clases
  var obs = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type !== 'attributes' || m.attributeName !== 'class') continue;

      var el = m.target;
      if (!el || !el.classList) continue;

      for (var j = 0; j < el.classList.length; j++) {
        if (matchesTrigger(el.classList[j])) {
          activate(el);
          obs.disconnect();
          return;
        }
      }
    }
  });

  obs.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  setTimeout(function () {
    obs.disconnect();
  }, 3000);
})();

/* ============================================================
   TERMINA JS ACTIVACION SIN VERIFICACION
   ============================================================ */

/* ============================================================
   INICIA JS MENU EXPANDIBLE
   ============================================================ */

(function() {
  var intentosMenu = 0;
  function init() {
    var abrirBtn = document.querySelector('.abrir-menu-ab');
    var contenedor = document.querySelector('.contenedor-menu-ab');
    if (!abrirBtn || !contenedor) {
      intentosMenu++;
      if (intentosMenu > 50) return; // Página sin este menú: deja de intentar tras ~10s
      setTimeout(init, 200);
      return;
    }
    contenedor.classList.remove('is-open');
    function abrir() {
      contenedor.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function cerrar() {
      contenedor.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    abrirBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      abrir();
    });
    var cerrarBtns = document.querySelectorAll('.cerrar-menu-ab');
    cerrarBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cerrar();
      });
    });
    contenedor.addEventListener('click', function(e) {
      if (e.target === contenedor) {
        cerrar();
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && contenedor.classList.contains('is-open')) {
        cerrar();
      }
    });
  }
  init(); // intenta de inmediato; el reintento de arriba es la red de seguridad
})();


/* ============================================================
   TERMINA JS MENU EXPANDIBLE
   ============================================================ */

(function() {
  var intentosAcordeon = 0;
  function initAcordeon() {
    var titulos = document.querySelectorAll('.acordeon-titulo-ab');
    if (!titulos.length) {
      intentosAcordeon++;
      if (intentosAcordeon > 50) return; // Página sin acordeón: deja de intentar tras ~10s
      setTimeout(initAcordeon, 200);
      return;
    }

    titulos.forEach(function(titulo) {
      titulo.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var siguiente = titulo.nextElementSibling;
        while (siguiente && !siguiente.classList.contains('acordeon-contenido-ab')) {
          siguiente = siguiente.nextElementSibling;
        }
        if (!siguiente) return;

        var estaAbierto = siguiente.classList.contains('abierto');

        // Cerrar todos
        document.querySelectorAll('.acordeon-contenido-ab').forEach(function(c) {
          c.classList.remove('abierto');
        });
        document.querySelectorAll('.acordeon-titulo-ab').forEach(function(t) {
          t.classList.remove('activo');
        });

        // Si estaba cerrado, abrir este
        if (!estaAbierto) {
          siguiente.classList.add('abierto');
          titulo.classList.add('activo');
        }
      });
    });
  }

  initAcordeon(); // intenta de inmediato; el reintento de arriba es la red de seguridad
})();

/* ============================================================
   TERMINA JS ACORDEONES
   ============================================================ */

/* ============================================================
   INICIA JS CARRUSEL DE TARJETAS
   ============================================================ */

(function(){
  "use strict";

  function initCarrusel(container) {
    var inner = container.querySelector(":scope > .inner");
    if (!inner) {
      for (var i = 0; i < container.children.length; i++) {
        if (container.children[i].classList && container.children[i].classList.contains("inner")) {
          inner = container.children[i];
          break;
        }
      }
    }
    if (!inner) return;

    var cards = inner.querySelectorAll(":scope > .singler-card-carrusel");
    if (cards.length === 0) return;
    if (container.querySelector(".carrusel-arrows-overlay")) return;

    var overlay = document.createElement("div");
    overlay.className = "carrusel-arrows-overlay";

    var arrowLeft = document.createElement("button");
    arrowLeft.className = "carrusel-arrow is-hidden";
    arrowLeft.setAttribute("aria-label", "Previous");
    arrowLeft.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>';

    var arrowRight = document.createElement("button");
    arrowRight.className = "carrusel-arrow";
    arrowRight.setAttribute("aria-label", "Next");
    arrowRight.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>';

    overlay.appendChild(arrowLeft);
    overlay.appendChild(arrowRight);
    container.appendChild(overlay);

    var domObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.removedNodes.forEach(function(node) {
          if (node === overlay) container.appendChild(overlay);
        });
      });
    });
    domObserver.observe(container, { childList: true });

    /* Dots (barras), opcional: solo se generan si el contenedor tiene .con-dots */
    var dots = null;
    if (container.classList.contains("con-dots")) {
      var dotsWrap = document.createElement("div");
      dotsWrap.className = "carrusel-dots";
      dots = [];
      cards.forEach(function(card, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carrusel-dot";
        dot.setAttribute("aria-label", "Ir a la tarjeta " + (i + 1));
        dot.addEventListener("click", function(e) {
          e.preventDefault(); e.stopPropagation();
          inner.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
      container.appendChild(dotsWrap);
    }

    function getStepSize() {
      if (cards.length > 1) return cards[1].offsetLeft - cards[0].offsetLeft;
      return cards[0].offsetWidth + 20;
    }

    function updateDots() {
      if (!dots) return;
      var sl = inner.scrollLeft;
      var closest = 0, closestDist = Infinity;
      cards.forEach(function(card, i) {
        var dist = Math.abs(card.offsetLeft - sl);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      dots.forEach(function(d, i) { d.classList.toggle("is-active", i === closest); });
    }

    function updateArrows() {
      var sl = Math.round(inner.scrollLeft);
      var max = inner.scrollWidth - inner.clientWidth;
      arrowLeft.classList.toggle("is-hidden", sl <= 5);
      arrowRight.classList.toggle("is-hidden", max <= 5 || sl >= max - 5);
      updateDots();
    }

    arrowLeft.addEventListener("click", function(e){
      e.preventDefault(); e.stopPropagation();
      inner.scrollBy({ left: -getStepSize(), behavior: "smooth" });
    });

    arrowRight.addEventListener("click", function(e){
      e.preventDefault(); e.stopPropagation();
      inner.scrollBy({ left: getStepSize(), behavior: "smooth" });
    });

    inner.addEventListener("scroll", function(){
      requestAnimationFrame(updateArrows);
    });

    /* Evita que el navegador tome el control con su arrastre nativo de imágenes
       (el "fantasma" semitransparente), que interrumpe el scroll en vivo */
    inner.addEventListener("dragstart", function(e){
      e.preventDefault();
    });

    var isDragging = false;
    var startX = 0, scrollStart = 0, dragDelta = 0;

    inner.addEventListener("mousedown", function(e){
      isDragging = true;
      startX = e.pageX;
      scrollStart = inner.scrollLeft;
      dragDelta = 0;
      inner.style.scrollBehavior = "auto";
      inner.style.scrollSnapType = "none"; /* apaga el snap mientras se arrastra a mano */
      inner.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", function(e){
      if (!isDragging) return;
      dragDelta = e.pageX - startX;
      inner.scrollLeft = scrollStart - dragDelta;
    });

    document.addEventListener("mouseup", function(){
      if (!isDragging) return;
      isDragging = false;
      inner.style.cursor = "grab";
      inner.style.scrollBehavior = "smooth";
      inner.style.scrollSnapType = ""; /* restaura el snap del CSS para el aterrizaje final */

      var step = getStepSize();
      if (dragDelta < -30) {
        inner.scrollBy({ left: step, behavior: "smooth" });
      } else if (dragDelta > 30) {
        inner.scrollBy({ left: -step, behavior: "smooth" });
      } else {
        inner.scrollBy({ left: 0, behavior: "smooth" });
      }

      updateArrows();
    });

    inner.style.cursor = "grab";
    setTimeout(updateArrows, 100);
  }

  function initAll() {
    document.querySelectorAll(".card-carrusel").forEach(initCarrusel);
  }

  if (document.readyState === "complete") {
    setTimeout(initAll, 300);
  } else {
    window.addEventListener("load", function(){ setTimeout(initAll, 300); });
  }
})();
/* ============================================================
   TERMINA JS CARRUSEL DE TARJETAS
   ============================================================ */

/* ============================================================
   INICIA JS SEO COLAPSABLE 2
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  var trigger = document.getElementById('sab2-main');
  var body = document.getElementById('sab2-body');
  if (trigger && body) {
    trigger.addEventListener('click', function() {
      var open = body.classList.toggle('is-open');
      trigger.classList.toggle('is-open', open);
    });
  }
  document.querySelectorAll('#seo-abdiel .sab2-hdr').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.sab2-item');
      var wasOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !wasOpen);
      btn.setAttribute('aria-expanded', String(!wasOpen));
    });
  });
});



/* ============================================================
   TERMINA JS SEO COLAPSABLE 2
   ============================================================ */

/* ============================================================
   INICIA JS ANIMACION DE ENTRADA (scroll)
   El CSS correspondiente está en abdiel-css.css
   ============================================================ */

(function(){
  var MAP = {
    'a-e-flip-x': 'animate__flipInX',
    'a-e-flip-y': 'animate__flipInY',
    'a-e-fade':   'animate__fadeIn',
    'a-e-fade-l': 'animate__fadeInLeft',   /* desde la izquierda */
    'a-e-fade-r': 'animate__fadeInRight',  /* desde la derecha */
    'a-e-fade-t': 'animate__fadeInUp',     /* hacia arriba (top) */
    'a-e-fade-b': 'animate__fadeInDown',   /* hacia abajo (bottom) */
    'a-e-zoom':   'animate__zoomIn',
    'a-e-zoom-t': 'animate__zoomInUp'
  };
  var BTN_CLASSES = ['btn-link', 'btn-border', 'boton-degradado', 'btn-vp', 'boton-degradado-2'];
  var DEFAULT_ANIM = 'animate__fadeIn';      /* respaldo de .animacion-e si no hay --a-e-anim */
  var DEFAULT_BTN_ANIM = 'animate__fadeIn';  /* respaldo de los botones si no hay --animate-btn */

  var keys = Object.keys(MAP);
  var sel = keys.map(function(k){ return '.' + k; })
    .concat('.animacion-e')
    .concat(BTN_CLASSES.map(function(k){ return '.' + k; }))
    .join(',');

  // .no-anim queda completamente afuera del sistema (no se oculta, no se observa)
  var els = Array.prototype.filter.call(document.querySelectorAll(sel), function(el){
    return !el.classList.contains('no-anim');
  });
  if(!els.length) return;

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target, anim = null;

      // 1) clase específica (a-e-flip-x, a-e-fade-l, a-e-zoom, etc.)
      for(var i=0;i<keys.length;i++){ if(el.classList.contains(keys[i])){ anim = MAP[keys[i]]; break; } }

      // 2) si no, y tiene .animacion-e -> usa la animación de su variable (o el respaldo)
      if(!anim && el.classList.contains('animacion-e')){
        var v = getComputedStyle(el).getPropertyValue('--a-e-anim').trim();
        anim = v || DEFAULT_ANIM;
      }

      // 3) si no, y es uno de los 3 botones -> usa --animate-btn (o el respaldo)
      if(!anim){
        for(var j=0;j<BTN_CLASSES.length;j++){
          if(el.classList.contains(BTN_CLASSES[j])){
            var vb = getComputedStyle(el).getPropertyValue('--animate-btn').trim();
            anim = vb || DEFAULT_BTN_ANIM;
            break;
          }
        }
      }

      if(anim){
        el.classList.add('animate__animated', anim);
        // Al terminar, se quitan las clases de animación para que un reflow
        // posterior (hover, transform en un ancestro, etc.) no la reinicie.
        el.addEventListener('animationend', function handler(){
          el.classList.remove('animate__animated', anim);
          el.removeEventListener('animationend', handler);
        }, { once: true });
      }
      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { threshold: .2 });

  els.forEach(function(el){ io.observe(el); });
})();

/* ============================================================
   TERMINA JS ANIMACION DE ENTRADA (scroll)
   ============================================================ */

