import { Link } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import { Layout } from '../components/Layout'
import { PortfolioGrid } from '../components/Portfolio'
import { usePortfolio } from '../lib/usePortfolio'
import { Eyebrow } from '../components/ui'

/* Standalone portfolio, reachable from the landing section's "See more work".
   Shows the whole studio collection in the owner's arranged order. */
export default function PortfolioPage() {
  const { items, ready } = usePortfolio()

  return (
    <Layout>
      <div
        id="top"
        className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ash transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} /> Back to site
        </Link>

        <div className="mt-10 max-w-[62ch]">
          <Eyebrow>Studio portfolio</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.04] tracking-tight text-ink md:text-6xl">
            Everything made on our floor.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ash md:text-lg">
            Poster art, illustration and set photography from our students and
            instructors — in the order the studio arranged it.
          </p>
        </div>

        {ready && items.length === 0 && (
          <p className="mt-16 text-ash">Nothing published yet. Check back soon.</p>
        )}

        {items.length > 0 && (
          <div className="mt-14">
            <PortfolioGrid items={items} />
          </div>
        )}
      </div>
    </Layout>
  )
}
