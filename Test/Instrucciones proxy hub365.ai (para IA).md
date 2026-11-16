# Tarea: servir la librería de estilos/JS desde hub365.ai con caché temporal

Destinatario: la IA/desarrollador que administra el sitio `hub365.ai` (Next.js en Railway).
Contexto: las webs de clientes de HUB365.AI cargan dos archivos (CSS y JS). Hoy lo hacen vía
`resources.hub365.ai/css/webs` y `/js/webs`, que son redirecciones 301 de GHL (sin caché → un
salto extra en cada visita). Se quiere servirlos directo desde `hub365.ai`.

## Reglas (importantes)

1. **El origen es y sigue siendo un repo ajeno al de Hub365** (cuenta del autor, José Abdiel).
   NO copiar los archivos al repo de `hub365.ai`, NO commitearlos, NO ponerlos en `public/`.
   Solo una **copia temporal de caché**, refrescada desde el origen: en memoria y, para que sobreviva
   a reinicios/despliegues, en un volumen de caché **fuera del repo** (ver "Persistencia").
2. **Plazo de gracia de 30 días.** Si el autor retira o rompe el origen, el endpoint sigue sirviendo la
   última copia buena hasta **30 días** después de la última vez que el origen respondió bien. Pasado
   ese plazo debe devolver **cuerpo vacío** (con `Cache-Control: no-store`) y borrar la copia (memoria y
   disco). Es un aterrizaje suave para que las webs no se rompan de golpe; no implementar ningún
   respaldo que dure más que eso.
3. Las URLs de origen son **fijas** (lista blanca). Nunca construir la URL con datos de la petición.
4. No modificar el contenido de los archivos (ni minificar, ni quitar el aviso de propiedad `/*! ... */` donde exista).
   Los nombres de clases y funciones deben llegar idénticos.
5. Licencia: ver el aviso al inicio de los archivos. Uso solo para clientes activos de HUB365.AI.

## Archivos

| Ruta nueva en hub365.ai | Origen (fijo) | Content-Type |
|---|---|---|
| `/lib/webs.css` | `https://cdn.jsdelivr.net/gh/abdieldesigner/recursos@main/abdiel-css.css` | `text/css; charset=utf-8` |
| `/lib/webs.js`  | `https://cdn.jsdelivr.net/gh/abdieldesigner/recursos@main/abdiel-js.min.js` | `text/javascript; charset=utf-8` |
| `/lib/blog.css` | `https://cdn.jsdelivr.net/gh/abdieldesigner/recursos@main/estilos-blog-ghl.css` | `text/css; charset=utf-8` |

Son tres archivos con el mismo tratamiento (misma lógica de caché, ETag, plazo de gracia y persistencia).
`blog.css` solo lo cargan las páginas de blog; `webs.css` y `webs.js` las demás páginas.

(Aparte existe un "bloque superior" HTML que se pega directamente en GHL: NO se sirve desde aquí. Ver el
último apartado, solo para que sepas qué URLs lo referenciarán.)

## Comportamiento de caché esperado

- **Servidor → origen:** cada 24 h revalida con `If-None-Match` usando el ETag del origen.
  jsDelivr responde `304` si no cambió: no se descarga nada y la copia (y su ETag propio) se conserva.
- **Servidor → navegador:** ETag propio (hash del contenido) + `Cache-Control: public, max-age=86400,
  stale-while-revalidate=604800`. Si el navegador ya tiene el archivo y no cambió, recibe `304`
  (sin cuerpo) o ni siquiera pregunta durante las primeras 24 h.
- Si el origen devuelve error/404 (puntual o permanente): reintentar cada 10 min y seguir sirviendo la
  última copia buena durante el plazo de gracia de 30 días (regla 2). jsDelivr puede dar un 404
  breve (segundos) justo después de que el autor purgue su caché: es normal y no debe vaciar nada.
- Mantener la compresión (gzip/brotli) que ya aplique Next/Railway.

## Persistencia (necesaria para que los 30 días sean reales)

Una copia solo en memoria se pierde en cada despliegue o reinicio de Railway. Si eso ocurre cuando el
origen ya no existe, no habría de dónde recuperarla y el archivo quedaría vacío al instante, aunque no
hayan pasado los 30 días. Por eso:

- Montar un **Volume de Railway** (p. ej. en `/data`) y definir `CACHE_LIB_DIR=/data/lib-cache`.
- Guardar ahí un JSON por archivo (`webs.css.json`, `webs.js.json`) con `cuerpo`, `etag`, `etagOrigen`,
  `ok`, `revisado`, y leerlo al arrancar si no hay copia en memoria.
- Es solo caché: nunca dentro del repo, nunca commiteado. Si `CACHE_LIB_DIR` no está definido, funciona
  solo en memoria (con la limitación descrita).

## Código sugerido (Next.js App Router, adaptar a la versión del proyecto; sin probar)

```ts
// app/lib/[archivo]/route.ts
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

const BASE = 'https://cdn.jsdelivr.net/gh/abdieldesigner/recursos@main/';
const ARCHIVOS: Record<string, { origen: string; tipo: string }> = {
  'webs.css': { origen: BASE + 'abdiel-css.css',   tipo: 'text/css; charset=utf-8' },
  'webs.js':  { origen: BASE + 'abdiel-js.min.js', tipo: 'text/javascript; charset=utf-8' },
  'blog.css': { origen: BASE + 'estilos-blog-ghl.css', tipo: 'text/css; charset=utf-8' },
};

const TTL = 24 * 3600e3;            // revalidar contra el origen cada 1 día
const GRACIA = 30 * 24 * 3600e3;    // si el origen falla, servir la última copia buena hasta 30 días
const REINTENTO = 10 * 60e3;        // tras un fallo, reintentar en 10 min
const DIR = process.env.CACHE_LIB_DIR; // p. ej. /data/lib-cache (volumen de Railway); vacío = solo memoria

type Copia = { cuerpo: string; etag: string; etagOrigen: string | null; ok: number; revisado: number };
const copias = new Map<string, Copia>();

// "nombre" siempre es una clave de ARCHIVOS (lista blanca), así que no hay riesgo de ruta arbitraria
const rutaDisco = (nombre: string) => path.join(DIR as string, nombre + '.json');
async function leerDisco(nombre: string): Promise<Copia | undefined> {
  if (!DIR) return;
  try { return JSON.parse(await fs.readFile(rutaDisco(nombre), 'utf8')); } catch { return; }
}
async function escribirDisco(nombre: string, c: Copia) {
  if (!DIR) return;
  try { await fs.mkdir(DIR, { recursive: true }); await fs.writeFile(rutaDisco(nombre), JSON.stringify(c)); } catch {}
}
async function borrarDisco(nombre: string) {
  if (!DIR) return;
  try { await fs.unlink(rutaDisco(nombre)); } catch {}
}

async function actualizar(origen: string, c?: Copia): Promise<Copia | undefined> {
  const ahora = Date.now();
  try {
    const r = await fetch(origen, {
      cache: 'no-store',
      headers: c?.etagOrigen ? { 'If-None-Match': c.etagOrigen } : {},
    });
    if (r.status === 304 && c) return { ...c, ok: ahora, revisado: ahora }; // sin cambios: se conserva todo
    if (r.ok) {
      const cuerpo = await r.text();
      const etag = '"' + createHash('sha1').update(cuerpo).digest('hex') + '"';
      return { cuerpo, etag, etagOrigen: r.headers.get('etag'), ok: ahora, revisado: ahora };
    }
  } catch { /* red caída: se trata igual que un fallo */ }
  return c ? { ...c, revisado: ahora - TTL + REINTENTO } : undefined; // fallo: reintento pronto, "ok" no cambia
}

export async function GET(req: Request, { params }: { params: Promise<{ archivo: string }> }) {
  const { archivo } = await params;
  const f = ARCHIVOS[archivo]; // lista blanca: nunca una URL derivada de la petición
  if (!f) return new Response('Not found', { status: 404 });

  const ahora = Date.now();
  let c = copias.get(archivo) ?? (await leerDisco(archivo)); // tras un reinicio, recupera la copia del volumen
  if (!c || ahora - c.revisado > TTL) {
    const nueva = await actualizar(f.origen, c);
    if (nueva) {
      c = nueva;
      if (nueva.ok === ahora) await escribirDisco(archivo, nueva); // solo si hubo respuesta buena del origen
    }
  }

  if (!c || ahora - c.ok > GRACIA) {            // regla 2: pasaron 30 días sin origen válido
    copias.delete(archivo);
    await borrarDisco(archivo);
    return new Response('', { headers: { 'Content-Type': f.tipo, 'Cache-Control': 'no-store' } });
  }
  copias.set(archivo, c);

  const cabeceras = {
    'Content-Type': f.tipo,
    'ETag': c.etag,
    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    'X-Content-Type-Options': 'nosniff',
  };
  if (req.headers.get('if-none-match') === c.etag) return new Response(null, { status: 304, headers: cabeceras });
  return new Response(c.cuerpo, { headers: cabeceras });
}
```

Notas para quien lo implemente:
- Si el middleware del sitio intercepta rutas, excluir `/lib/*`.
- Varias peticiones simultáneas con la copia vencida pueden disparar varias consultas al origen;
  es aceptable, o se puede deduplicar con una promesa compartida.
- No habilitar CORS ni cookies en estas rutas (no hacen falta para `<link>`/`<script>`).
- El navegador puede conservar el archivo hasta 1 día (`max-age`) más la ventana de
  `stale-while-revalidate`; eso es independiente de los 30 días del servidor.

## Cómo probarlo (después de desplegar)

```bash
# 1) Debe devolver 200, el Content-Type correcto, ETag y Cache-Control
curl -sI https://hub365.ai/lib/webs.css
curl -sI https://hub365.ai/lib/webs.js
curl -sI https://hub365.ai/lib/blog.css

# 2) El contenido debe empezar con el aviso /*! IMPORTANTE ... y no tener otros comentarios en el CSS
curl -s https://hub365.ai/lib/webs.css | head -5
curl -s https://hub365.ai/lib/webs.js | grep -c "__hub365Cargado"     # esperado: 1

# 3) Revalidación: con el ETag recibido debe responder 304 sin cuerpo
E=$(curl -sI https://hub365.ai/lib/webs.css | grep -i '^etag' | cut -d' ' -f2- | tr -d '\r')
curl -s -o /dev/null -w '%{http_code}\n' -H "If-None-Match: $E" https://hub365.ai/lib/webs.css   # esperado: 304

# 4) Una ruta fuera de la lista blanca debe dar 404
curl -s -o /dev/null -w '%{http_code}\n' https://hub365.ai/lib/otra.css
```

Pruebas del plazo de gracia (en un entorno de pruebas, con TTL y GRACIA reducidos, p. ej. 1 min y 5 min):
- Apuntar `origen` a una URL inexistente tras haber cargado una copia buena: debe seguir sirviendo la copia hasta
  cumplir GRACIA y después quedar vacía.
- Reiniciar el servicio con el origen roto: con el volumen configurado debe seguir sirviendo la copia
  (sin volumen, quedará vacío: es la limitación esperada).

## Para el autor: cambios en el bloque superior de las páginas (se pega en GHL; después de probar)

En `Extras/Bloque superior Hub365 optimizacion.html`, paso 1:

```html
<!-- Antes -->
<link rel="stylesheet" href="https://resources.hub365.ai/css/webs">
<script src="https://resources.hub365.ai/js/webs" defer></script>

<!-- Después -->
<link rel="preconnect" href="https://hub365.ai">
<link rel="stylesheet" href="https://hub365.ai/lib/webs.css">
<script src="https://hub365.ai/lib/webs.js" defer></script>
```

Y en el paso 2 (anti-duplicados), añadir la ruta nueva a `LIBRERIA`:

```js
var LIBRERIA = [
  /resources\.hub365\.ai\/(js|css)\/webs/i,
  /(^|\/\/)hub365\.ai\/lib\/webs\.(js|css)/i,
  /cdn\.jsdelivr\.net\/gh\/abdieldesigner\/recursos[^\/]*\/abdiel-(js|css)/i
];
```

Sin esa línea, el anti-duplicados no reconocería la URL nueva (las copias viejas de la librería no se agruparían).

**No añadir `/lib/blog.css` a `LIBRERIA`:** el anti-duplicados usa una sola clave por tipo (`CSS`), así que
trataría el CSS del blog como copia de `webs.css` y lo desactivaría. Las páginas de blog lo cargan aparte:

```html
<link rel="stylesheet" href="https://hub365.ai/lib/blog.css">
```
Las páginas que sigan usando `resources.hub365.ai` seguirán funcionando mientras esa redirección exista.
