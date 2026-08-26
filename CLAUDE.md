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

## Verificación obligatoria antes de push

Antes de cada push, revisar `abdiel-css.css` y `abdiel-js.js` en busca de errores de escritura — no basta con que el sitio "funcione visualmente", puede haber una variable mal escrita que pase desapercibida. Mínimo:

- **CSS**: contar llaves `{`/`}` y confirmar que están balanceadas (`open == close`). Un desbalance indica una regla mal cerrada.
- **JS**: correr `node --check abdiel-js.js` para validar la sintaxis.
- **Nombres de variables**: revisar que las variables CSS (`--algo`) usadas con `var(...)` coincidan exactamente con las declaradas — un typo en el nombre no rompe la sintaxis (sigue siendo CSS válido), así que `node --check` o el conteo de llaves no lo detectan; hay que revisarlo a ojo o con `grep` comparando declaración vs. uso.

Si algo fallara, corregirlo antes de hacer commit — nunca subir a push con un error de escritura conocido.

## Comandos útiles (VS Code)

- **Comentar/descomentar selección**: `Cmd + /` (en `.css` lo envuelve en `/* ... */`).
- **Comentario de bloque explícito**: `Shift + Option + A` (mismo resultado en CSS).