import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAuthStatus } from './lib/useAdmin'
import { Layout } from './components/Layout'
import { Hero } from './components/Hero'
import { MarqueeStrip } from './components/MarqueeStrip'
import { StatsBand } from './components/StatsBand'
import { About } from './components/About'
import { Purpose } from './components/Purpose'
import { HowWeWork } from './components/HowWeWork'
import { WhyChoose } from './components/WhyChoose'
import { Programs } from './components/Programs'
import { Facilities } from './components/Facilities'
import { Stories } from './components/Stories'
import { Announcements } from './components/Announcements'
import { Gallery } from './components/Gallery'
import { Portfolio } from './components/Portfolio'
import { Contact } from './components/Contact'

const Admin = lazy(() => import('./pages/Admin.tsx'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage.tsx'))

/* /admin shows the console to any signed-in user (it starts with the sign-in
   form for anonymous visitors). No bounce — the AuthState listener is the only
   gate. */
function AdminRoute() {
  const { pending } = useAuthStatus()
  if (pending) return null
  return (
    <Suspense fallback={null}>
      <Admin />
    </Suspense>
  )
}

function Landing() {
  return (
    <Layout>
      <Hero />
      <MarqueeStrip />
      <StatsBand />
      <About />
      <Purpose />
      <HowWeWork />
      <WhyChoose />
      <Programs />
      <Facilities />
      <Stories />
      <Announcements />
      <Gallery />
      <Portfolio />
      <Contact />
    </Layout>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoute />} />
      <Route
        path="/portfolio"
        element={
          <Suspense fallback={null}>
            <PortfolioPage />
          </Suspense>
        }
      />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}