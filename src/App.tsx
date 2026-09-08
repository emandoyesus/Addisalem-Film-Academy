import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { MarqueeStrip } from './components/MarqueeStrip'
import { StatsBand } from './components/StatsBand'
import { About } from './components/About'
import { Programs } from './components/Programs'
import { LearningPath } from './components/LearningPath'
import { Facilities } from './components/Facilities'
import { Instructors } from './components/Instructors'
import { Stories } from './components/Stories'
import { Announcements } from './components/Announcements'
import { Gallery } from './components/Gallery'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

const Admin = lazy(() => import('./pages/Admin.tsx'))

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
        <Programs />
        <LearningPath />
        <Facilities />
        <Instructors />
        <Stories />
        <Announcements />
        <Gallery />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <Admin />
          </Suspense>
        }
      />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}