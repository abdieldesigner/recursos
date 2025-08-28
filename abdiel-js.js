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
    const speed = 100;                        // Velocidad objetivo: 100 px/seg
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
