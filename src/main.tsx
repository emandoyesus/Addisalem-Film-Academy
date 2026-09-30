import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/work-sans'
import '@fontsource-variable/jetbrains-mono'
import App from './App.tsx'
import './index.css'

/* #root already holds the prerendered page (see src/entry-server.tsx). This
   mounts over it with createRoot rather than hydrateRoot on purpose: entrance
   animations are gated on matchMedia and the portfolio comes from Firestore at
   runtime, so the client tree legitimately differs from the build-time one and
   hydrating would only produce mismatch errors. index.css keeps #root hidden
   while `.js` is set, so the prerender is never painted before the app takes
   over; visitors without JavaScript still get the full page.

   flushSync finishes the mount before the class comes off, otherwise the reveal
   would land a frame late and flash. */
const root = createRoot(document.getElementById('root')!)

flushSync(() => {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})

document.documentElement.classList.remove('js')