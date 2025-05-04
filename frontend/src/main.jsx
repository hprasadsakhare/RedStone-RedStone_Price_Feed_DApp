import React from 'react'
import ReactDOM from 'react-dom/client'
import { ColorModeScript } from '@chakra-ui/react'
import App from './App'

// Create root element
const rootElement = document.getElementById('root')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="dark" />
    <App />
  </React.StrictMode>,
)
