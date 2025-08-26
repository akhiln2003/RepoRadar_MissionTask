import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GitHubSearch from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GitHubSearch />
  </StrictMode>,
)
