Mini Pokédex ⚡ (React + TypeScript + Vite)

Proyecto personal orientado a buenas prácticas de Frontend: TypeScript estricto, separación por capas (servicios, hooks, componentes) y UX clara con estados de carga/error.
Este README se centra en desarrollo local y pruebas. El despliegue a GitHub Pages se documentará más adelante.

Autor: David Ibáñez Leal

✨ Qué hace

Listado paginado de Pokémon (20 por página por defecto).

Búsqueda por nombre con debounce y cancelación de peticiones (mejora de UX).

Modal con detalle (intenta “upgrade” de lite → full al abrir).

Código organizado y tipado: services (API), hooks (estado/datos), components (UI).

🧰 Stack

React 18 + TypeScript

Vite (dev server rápido + build con Rollup)

CSS sencillo (sin frameworks; clases utilitarias en index.css)

lodash.debounce para el debounce del buscador

🧱 Arquitectura (visión rápida)

src/main.tsx: punto de entrada. Monta <App /> con React.StrictMode.

src/App.tsx: orquestador de UI. Conecta búsqueda, lista, paginación y modal. Usa el hook usePokemon.

src/hooks/usePokemon.ts: estado/datos. Maneja página, query, lista, total, loading/error y cancelación via AbortController.

src/services/api.ts: acceso a datos (PokéAPI).

fetchPokemonPage (lista paginada; enriquece ítems con sprite/tipos).

fetchPokemonByName (detalle completo por nombre).

src/components/*: UI desacoplada (semántica + a11y):

SearchBar (debounce + cleanup),

PokemonList / PokemonCard (lista semántica <ul>/<li> y <button> accesible),

Pagination (<nav aria-label="Paginación">, aria-live),

PokemonModal (role="dialog", aria-modal, Esc para cerrar).

Estructura de carpetas
src/
  components/
    Pagination.tsx
    PokemonCard.tsx
    PokemonList.tsx
    PokemonModal.tsx
    SearchBar.tsx
  hooks/
    usePokemon.ts
  services/
    api.ts
  types.ts
  index.css
  App.tsx
  main.tsx

🧠 Cómo funciona (overview técnico)

Búsqueda: SearchBar controla el input y dispara onChange con debounce (400 ms).
App hace setPage(0) + setQuery(val).

Datos: usePokemon escucha page/query.

Con query → fetchPokemonByName (1 resultado).

Sin query → fetchPokemonPage({ limit, offset }).
Usa AbortController para cancelar la petición anterior si cambias de página o buscas de nuevo.

Lista: se pinta con tarjetas “lite” (id, name, sprite, types…). Skeleton evita saltos de layout (CLS).

Detalle: al seleccionar, App intenta “upgrade” con fetchPokemonByName. Si falla, muestra el lite (UX robusta).

Paginación: solo se muestra si no hay query. Botones con disabled y texto con aria-live="polite".

🚀 Requisitos & ejecución local

Node.js 20+
Comprueba versión:

node -v


Instalar y arrancar

npm ci        # o `npm install`
npm run dev   # abre el dev server (Vite)


Build de producción

npm run build
npm run preview


No se requieren variables de entorno en esta fase. La API base es https://pokeapi.co/api/v2.

🎨 Estilos & Accesibilidad

Sin estilos inline; clases en index.css (.grid, .card, .badge, .modal*, .button, .input, .skeleton, etc.).

Semántica: <ul>/<li> para listas, <button> para elementos interactivos, <nav> para paginación.

A11y: aria-label en controles, aria-modal en el modal, Esc para cerrar, :focus-visible visible.

🧪 Pruebas (roadmap corto)

Pendiente de implementar (ideas):

Smoke tests con Vitest + React Testing Library:

PokemonCard (render + click),

Pagination (prev/next disabled en límites),

SearchBar (debounce con fake timers),

Flujo básico de abrir/cerrar modal.

🚧 Limitaciones & mejoras futuras

N+1 en fetchPokemonPage (lista + N detalles): mejoraría derivando id desde url y construyendo official-artwork sin llamar al detalle, y pedir el full solo al abrir modal.

Cacheado de detalle por nombre para abrir/cerrar modal sin re-fetch.

GitHub Pages / CI (lint, type-check, build) como siguiente paso.

🪪 Licencia

MIT — © David Ibáñez Leal