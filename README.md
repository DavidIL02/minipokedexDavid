    Mini Pokédex (React + TypeScript + Vite)

Proyecto personal centrado en buenas prácticas de Frontend: TypeScript estricto, separación por capas (servicios, hooks, componentes) y una UX clara con gestión de carga y error.

Autor: David Ibáñez Leal

Este documento se centra en desarrollo local y pruebas. El despliegue (GitHub Pages) se añadirá más adelante.

    Características

Listado paginado de Pokémon (20 por página).

Búsqueda por nombre con debounce (400 ms) y cancelación de peticiones.

Modal de detalle (intento de upgrade de lite → full al abrir).

Código organizado y tipado: services (API), hooks (datos/estado) y components (UI).

Stack técnico

React 18 + TypeScript

Vite (servidor de desarrollo y build con Rollup)

CSS plano en index.css (sin frameworks)

lodash.debounce para el buscador

    Arquitectura (visión general)

src/main.tsx: punto de entrada. Monta App dentro de React.StrictMode.

src/App.tsx: orquestador de UI (búsqueda → lista → paginación → modal) apoyado en usePokemon.

src/hooks/usePokemon.ts: estado/datos (página, query, lista, total, loading/error) con AbortController para evitar carreras.

src/services/api.ts:

fetchPokemonPage: lista paginada (enriquecida con sprite y tipos).

fetchPokemonByName: detalle completo por nombre.

src/components/\* (UI semántica y accesible):

SearchBar (debounce con limpieza),

PokemonList / PokemonCard (<ul>/<li> + <button>),

Pagination (<nav aria-label="Paginación">, aria-live),

PokemonModal (role="dialog", aria-modal, cierre con Escape).

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

    Flujo de datos (resumen)

Búsqueda
SearchBar controla el valor del input y emite onChange con debounce (400 ms).
App resetea a la primera página y actualiza query.

Carga de datos
usePokemon observa page y query:

Con query: fetchPokemonByName (un único resultado).

Sin query: fetchPokemonPage({ limit, offset }).
Siempre cancela la petición previa con AbortController.

Listado
Se muestran tarjetas lite (id, nombre, sprite, tipos).
Se usa skeleton para evitar saltos de maquetación.

Detalle
Al seleccionar una tarjeta, App intenta actualizar de lite a full con fetchPokemonByName.
Si falla, muestra el lite como fallback.

Paginación
Solo se muestra cuando no hay query.
Botones con disabled y texto con aria-live="polite".

    Requisitos

Node.js 20 o superior

Comprobación rápida:

node -v

    Puesta en marcha

Instalación y desarrollo:

npm ci # o: npm install
npm run dev # arranca Vite en local

Build de producción y previsualización:

npm run build
npm run preview

No se requieren variables de entorno en esta fase. API base: https://pokeapi.co/api/v2.

    Estilos y accesibilidad

Sin estilos inline; clases centralizadas en index.css (p. ej. .grid, .card, .badge, .modal\*, .button, .input, .skeleton).

Semántica: listas (<ul>/<li>), botones (<button>), navegación (<nav>).

Accesibilidad: aria-label en controles, aria-modal en el modal, cierre con Escape, realce de foco con :focus-visible.

    Pruebas (pendiente)

Sugerencias para una primera batería (Vitest + React Testing Library):

PokemonCard: render y callback de clic.

Pagination: estados disabled en límites (primera/última página).

SearchBar: debounce con fake timers.

Flujo de abrir/cerrar modal.

    Limitaciones y mejoras

N+1 en fetchPokemonPage (lista + N detalles).
Posible mejora: derivar id desde url, construir official-artwork sin pedir detalle y solicitar el full únicamente al abrir el modal.

Cachear detalle por nombre para reabrir sin nueva petición.

Añadir CI (lint, type-check, build) y despliegue a GitHub Pages.
