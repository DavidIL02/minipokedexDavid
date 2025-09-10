# Mini Pokédex ⚡ (React + TypeScript + Vite)

> Proyecto personal orientado a buenas prácticas de Frontend: TypeScript estricto, separación por capas (servicios, hooks, componentes), y UX simple con estados de carga/error claros.  
> **Este README se centra en desarrollo local y pruebas.** El despliegue a GitHub Pages se hará más adelante.

## ✨ Qué hace
- Listado paginado de Pokémon (20 por página por defecto).
- Búsqueda por nombre con un flujo de **debounce/cancelación** para una UX fluida.
- **Modal** con detalle cuando seleccionas un Pokémon.
- Estructura limpia y tipada: `services` (API), `hooks` (estado/datos), `components` (UI).

## 🧱 Arquitectura (visión rápida)
- **`src/main.tsx`**: punto de entrada. Monta `<App />` con `React.StrictMode`.
- **`src/App.tsx`**: **orquestador de UI**. Conecta búsqueda, lista, paginación y modal. Usa el hook `usePokemon`.
- **`src/services/api.ts`**: **orquestador de datos**. Funciones para obtener lista/páginas y detalle desde la PokéAPI.

> Más adelante añadiremos una sección de “Componentes” y “Hooks” cuando estén listos para documentar.

## 🚀 Requisitos
- Node.js 20+
- npm (o pnpm/yarn, ajusta comandos)

```bash
node -v
