/* ============================================================
   INICIA JS DE CINTA DE TEXTO (marquee): duplicado + duración
   ============================================================ */

window.addEventListener('load', () => {
  const tracks = document.querySelectorAll('.marquee-track'); // Selecciona todas las pistas de marquee

  tracks.forEach(track => {
    const textBlock = track.querySelector('.marquee-text'); // Bloque que contiene el texto original

    // Reemplaza saltos de línea <br> por un separador visual ✦
    // - Usamos regex /<br\s*\/?>/gi para cubrir <br>, <br/> y mayúsculas/minúsculas
    textBlock.innerHTML = textBlock.innerHTML.replace(/<br\s*\/?>/gi, '<span class="separator">✦</span>');

    // Duplica el contenido para lograr un bucle continuo (scroll infinito sin cortes)
    const clone = textBlock.cloneNode(true); // true = clona con hijos
    track.appendChild(clone);                // Añade la copia al final del track

    // Calcula la duración basada en el ancho real del contenido
    // - track.scrollWidth ahora es el ancho de texto original + clon (x2)
    const totalWidth = track.scrollWidth / 2; // Solo el ancho del bloque original
    const speed = 80;                        // Velocidad objetivo: 100 px/seg
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
   Empieza JS roba color del borde para divisores
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
   EMpieza JS anadir clase un a cada pagina
   ============================================================ */


(function () {
  var host = window.location.hostname.replace(/^www\./, '');
  var clase = host.replace(/\./g, '-') + '-';
  var nuxtEl = document.getElementById('__nuxt');
  if (nuxtEl) nuxtEl.classList.add(clase);
})();

/* ============================================================
   TERMINA JS anadir clase un a cada pagina
   ============================================================ */
/* ============================================================
   empieza JS afecto aparecer anuncio
   ============================================================ */

  window.onload = function() {
    const anuncios = document.querySelectorAll('.contenedor-anuncio'); // Selecciona todos los elementos con la clase 'contenedor-anuncio'

    anuncios.forEach(function(anuncio) {
      // Después de 4 segundos, hazlo visible y clickeable
      setTimeout(function() {
        anuncio.classList.add('visible');
      }, 4000); // 4000 ms = 4 segundos
    });
  };

/* ============================================================
   TERMINA JS afecto aparecer anuncio
   ============================================================ */
/* ============================================================
   EMPIEZA  JS sin verificaccion
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
   TERMINA JS sin verificaccion
   ============================================================ */





