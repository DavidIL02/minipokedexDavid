// Importa utilidades de React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Estilos globales
import './index.css'

// Componente raíz de la app
import App from './App.tsx'

// Monta la aplicación en el <div id="root"> del index.html
createRoot(document.getElementById('root')!).render(
  // StrictMode activa comprobaciones adicionales en desarrollo
  <StrictMode>
    <App />
  </StrictMode>
)
