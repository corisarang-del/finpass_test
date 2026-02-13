import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import agentHanImg from './assets/images/agent_han.png'
import agentSongImg from './assets/images/agent_song.png'
import agentChoiImg from './assets/images/agent_choi.png'
import agentYouImg from './assets/images/agent_you.png'

const CRITICAL_GUIDE_IMAGES = [agentHanImg, agentSongImg, agentChoiImg, agentYouImg]

if (typeof window !== 'undefined') {
  const mounted = new Set<string>()
  CRITICAL_GUIDE_IMAGES.forEach((src) => {
    const preload = new Image()
    preload.decoding = 'async'
    preload.loading = 'eager'
    preload.src = src

    if (!mounted.has(src)) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
      mounted.add(src)
    }
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
