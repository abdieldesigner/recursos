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
