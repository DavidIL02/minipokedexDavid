Mini Pokédex ⚡ (React + TypeScript + Vite)

Proyecto personal centrado en buenas prácticas: TypeScript estricto, separación por capas (servicios, hooks, componentes) y una UX clara con estados de carga/error.

Este README cubre desarrollo local y pruebas. El despliegue a GitHub Pages se documentará más adelante.

Autor: David Ibáñez Leal

✨ Features

Listado paginado de Pokémon (20 por página).

Búsqueda por nombre con debounce (400 ms) y cancelación de peticiones.

Modal de detalle (intenta upgrade de lite → full al abrir).

Código ordenado y tipado: services (API), hooks (datos), components (UI).

🧰 Stack

React 18 + TypeScript

Vite (dev server rápido + build con Rollup)

CSS sencillo en index.css (sin frameworks)

lodash.debounce para el buscador

🧱 Arquitectura (visión rápida)

src/main.tsx: punto de entrada. Monta <App /> con React.StrictMode.

src/App.tsx: orquestador de UI (búsqueda → lista → paginación → modal) usando usePokemon.

src/hooks/usePokemon.ts: estado/datos (página, query, lista, total, loading/error) + AbortController.

src/services/api.ts:

fetchPokemonPage → lista paginada (enriquece con sprite/tipos).

fetchPokemonByName → detalle completo por nombre.

src/components/* (UI semántica + a11y):

SearchBar (debounce + cleanup),

PokemonList / PokemonCard (<ul>/<li> + <button> accesible),

Pagination (<nav aria-label="Paginación">, aria-live),

PokemonModal (role="dialog", aria-modal, Esc para cerrar).

🗂️ Estructura de carpetas
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

🧠 Cómo funciona (overview)

Search → SearchBar controla el input y dispara onChange con debounce (400 ms).
App hace setPage(0) + setQuery(val).

Datos → usePokemon escucha page/query:

Con query → fetchPokemonByName (1 resultado).

Sin query → fetchPokemonPage({ limit, offset }).

Cancela la petición anterior con AbortController para evitar carreras.

Lista → tarjetas lite (id, name, sprite, types…). Skeleton evita saltos (CLS).

Detalle → al seleccionar, App intenta upgrade via fetchPokemonByName; si falla, muestra el lite (UX robusta).

Paginación → solo sin query. Botones con disabled y texto con aria-live="polite".

🚀 Arranque rápido

Requisitos

Node.js 20+

node -v


Instalar y levantar

npm ci        # o `npm install`
npm run dev   # abre Vite en local


Build de producción

npm run build
npm run preview


No hay variables de entorno en esta fase. API base: https://pokeapi.co/api/v2.

🎨 Estilos & Accesibilidad

Sin estilos inline; clases en index.css (.grid, .card, .badge, .modal*, .button, .input, .skeleton, etc.).

Semántica: <ul>/<li> para listas, <button> para acciones, <nav> para paginación.

A11y: aria-label en controles, aria-modal en el modal, cierre con Esc, :focus-visible visible.

🧪 Pruebas (roadmap corto)

Pendiente de implementar (ideas):

Smoke tests (Vitest + React Testing Library):

PokemonCard (render + click),

Pagination (prev/next disabled en límites),

SearchBar (debounce con fake timers),

Flujo de abrir/cerrar modal.

🚧 Limitaciones & mejoras

N+1 en fetchPokemonPage (lista + N detalles).
Mejora: derivar id desde url, construir official-artwork sin pedir detalle y pedir full sólo al abrir el modal.

Cache de detalle por nombre para reabrir sin re-fetch.

GitHub Pages y CI (lint, type-check, build) como siguiente paso.

🪪 Licencia

MIT — © David Ibáñez Leal