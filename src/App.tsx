import { lazy, Suspense, useEffect } from 'react'
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
import PortfolioPage from './pages/PortfolioPage'

/* Only the admin console is code-split: it is heavy, gated behind sign-in, and
   never part of a prerendered page. PortfolioPage stays in the main bundle so
   the build-time prerender in src/entry-server.tsx can render it — a lazy
   component would resolve to its Suspense fallback instead. */
const Admin = lazy(() => import('./pages/Admin.tsx'))

/* Keeps the private console out of the index. robots.txt already disallows
   /admin; this covers crawlers that reach it by a stale or typed URL. */
function NoIndex({ title }: { title: string }) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    const tag = document.createElement('meta')
    tag.name = 'robots'
    tag.content = 'noindex, nofollow'
    document.head.appendChild(tag)
    return () => {
      document.title = previous
      tag.remove()
    }
  }, [title])
  return null
}

/* /admin shows the console to any signed-in user (it starts with the sign-in
   form for anonymous visitors). No bounce — the AuthState listener is the only
   gate. */
function AdminRoute() {
  const { pending } = useAuthStatus()
  if (pending) return null
  return (
    <>
      <NoIndex title="Admin console · Addisalem Film Academy" />
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    </>
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