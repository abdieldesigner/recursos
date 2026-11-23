# Notas — ideas pendientes

Ideas para considerar más adelante. Ninguna está aprobada ni aplicada.

## Detectar el modo claro/oscuro según la preferencia del usuario

**Estado:** idea, sin aplicar. Anotada el 2026-10-23.

**Situación actual:** los toggles de `Extras/Activar modo oscuro.html` y `Extras/Activar modo claro.html` no detectan la preferencia del dispositivo.
- `Activar modo oscuro.html` decide solo por la hora (oscuro de 7 pm a 6 am) y por el botón.
- `Activar modo claro.html` decide solo por el botón (`sessionStorage`).
- Ambos cambian `data-theme` en `<body>`, y el CSS reacciona a ese atributo.

**Idea:** usar `window.matchMedia('(prefers-color-scheme: dark)')` para decidir el tema cuando el usuario aún no eligió con el botón. La elección manual sigue mandando.

- En `Activar modo oscuro.html` (web clara por defecto): reemplazar el bloque de la hora por:
  ```js
  } else if (!saved) {
    var prefiereOscuro = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefiereOscuro) {
      document.body.setAttribute('data-theme', 'dark');
      cambiarLogo(logoDark);
      aplicarFiltroIconos(true);
    }
  }
  ```
- En `Activar modo claro.html` (web oscura por defecto): añadir el caso contrario:
  ```js
  } else if (!saved && window.matchMedia &&
             window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.body.setAttribute('data-theme', 'light');
    cambiarLogo(logoForLight);
  }
  ```

**Por decidir:**
- Si se quita la regla de la hora o se conserva como respaldo (recomendado: quitarla).
- Si se añade un `addEventListener('change', ...)` para que cambie en vivo cuando el usuario cambia el modo del dispositivo con la página abierta.

## Probar las clases flip-1/2/3 e img-expan-g en una web real

**Estado:** pendiente de verificar. Anotada el 2026-11-23.

**Situación:** estas clases existen en `abdiel-css.fuente.css` (alrededor de las líneas 3010-3120) pero nunca se han usado en una web. No hay documentación en `info.txt` ni en los comentarios, y no se sabe si funcionan bien.

**Cómo deberían funcionar (según el CSS, sin probar):**
- `flip-1`, `flip-2` o `flip-3` va en la tarjeta (columna, fila o sección), y `flip-contenido` en el elemento de dentro que aparece. `flip-1`: fade in. `flip-2`: fade in + sube 12 px + escala. `flip-3`: giro 3D desde la izquierda.
- `img-expan-g` va en la fila que contiene las imágenes (no se sabe seguro si es fila o sección). La primera imagen se ve a 300 px y las demás al 10 %; al pasar el ratón, la imagen se expande a 300 px. En móvil, ocupa la mitad.
- Se ponen en GHL en Avanzado → Clases CSS.

**Qué verificar:**
- Que cada flip aparezca al pasar el ratón en la web publicada.
- Qué pasa en móvil: el contenido empieza con `opacity: 0` y solo sale con `:hover`, así que puede quedar oculto (riesgo de ocultar contenido sin hover).
- En `img-expan-g`, en qué elemento exacto va la clase para que funcione.
- Si en el constructor se ven los efectos al activar el botón de custom code (cada regla tiene una segunda opción con `body:has(#hl-builder-render-custom-code-button.hl-active-btn)` para el editor).

**Después de probarlo:** documentar en `info.txt` cómo se usan, igual que el carrusel con scroll-pin.
