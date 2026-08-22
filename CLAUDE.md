# Reglas del proyecto — recursos

Este repo contiene `abdiel-css.css` y `abdiel-js.js`, que son consumidos en vivo por **varias páginas web externas** (no solo un proyecto). Cualquier cambio se refleja de inmediato en todas ellas.

## Regla principal: no tocar selectores existentes

- **Prohibido renombrar o eliminar** clases, IDs o selectores que ya existen en el CSS/JS actual, aunque tengan errores de escritura evidentes.
- Razón: esas webs externas ya apuntan a esos nombres exactos. Cambiarlos rompe el estilo/funcionalidad en sitios que no controlamos desde aquí.
- Si un selector con typo necesita corregirse: se agrega **un selector nuevo** con el nombre correcto (duplicando la regla si hace falta), se deja el viejo intacto, y las webs se migran del lado de cada sitio cuando corresponda.
- Excepción: si en algún momento se pide **a propósito** cambiar/eliminar un selector actual, está permitido, pero siempre se debe advertir explícitamente antes de hacerlo (puede romper otras webs).

## Qué se edita

- ✅ `abdiel-css.css`
- ✅ `abdiel-js.js`
- ❌ SVGs y otros assets — no se tocan

## Qué sí se puede mejorar libremente

Dentro de los archivos CSS/JS, siempre que no cambie ningún nombre de selector existente:
- Optimizar el código (duplicados, reglas redundantes, código muerto).
- Reordenar y agrupar lógicamente.
- Formatear/indentar de forma consistente.
- Mejorar legibilidad general.

## Identidad de git para los commits

La identidad oficial para los commits de este repo es:
```
abdieldesigner <diferentecreativo@gmail.com>
```
Verificar con `git config user.name` / `git config user.email` antes de commitear si no coincide (puede desconfigurarse si cambia el hostname del equipo u otra causa). No usar la identidad de la cuenta de trabajo (`abdiel-Hub365`) en este repo — son cuentas distintas.
