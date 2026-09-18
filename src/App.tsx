import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStatus } from './lib/useAdmin'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { MarqueeStrip } from './components/MarqueeStrip'
import { StatsBand } from './components/StatsBand'
import { About } from './components/About'
import { Purpose } from './components/Purpose'
import { HowWeWork } from './components/HowWeWork'
import { Programs } from './components/Programs'
import { Facilities } from './components/Facilities'
import { Stories } from './components/Stories'
import { Announcements } from './components/Announcements'
import { Gallery } from './components/Gallery'
import { Portfolio } from './components/Portfolio'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

const Admin = lazy(() => import('./pages/Admin.tsx'))

/* Route guard for /admin — the console is only reachable for a signed-in,
   role-confirmed admin. A signed-in regular user is bounced to the home page;
   an anonymous visitor is let through so the console can show its login form. */
function AdminRoute() {
  const { pending, signedIn, isAdmin } = useAuthStatus()
  if (pending) return null
  if (signedIn && !isAdmin) return <Navigate to="/" replace />
  return (
    <Suspense fallback={null}>
      <Admin />
    </Suspense>
  )
}

function Landing() {
  return (
    <div className="grain min-h-[100dvh] bg-canvas text-ink">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.16em] focus:text-gold-ink"
      >
        Skip to content
      </a>

      <Navbar />

      <main>
        <Hero />
        <MarqueeStrip />
        <StatsBand />
        <About />
        <Purpose />
        <HowWeWork />
        <Programs />
        <Facilities />
        <Stories />
        <Announcements />
        <Gallery />
        <Portfolio />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoute />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}