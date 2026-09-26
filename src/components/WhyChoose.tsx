import { Eyebrow, Reveal } from './ui'

const reasons = [
  {
    index: '01',
    title: 'Hands-On, Set-Based Training',
    points: [
      {
        lead: 'Learn from the Source',
        body: 'Skip endless theoretical lectures and step directly onto a working set.',
      },
      {
        lead: 'Real Deadlines, Real Experience',
        body: 'From week one you train in crew-based environments, learning key roles under authentic production deadlines and real-world conditions.',
      },
    ],
  },
  {
    index: '02',
    title: 'Industry Placement & Career Opportunities',
    points: [
      {
        lead: 'A Direct Professional Network',
        body: 'We connect you with production houses, media networks and advertising agencies.',
      },
      {
        lead: 'Launch Your Career',
        body: 'Our industry links open pathways to internships, freelance projects and full-time placements right after graduation.',
      },
    ],
  },
  {
    index: '03',
    title: 'Dedicated Access to Production Gear',
    points: [
      {
        lead: 'Industry-Standard Equipment',
        body: 'Bring your visual storytelling to life on modern cinema cameras, professional sound gear and versatile studio lighting.',
      },
      {
        lead: 'Project Support',
        body: 'Get direct access to the gear you need to build a high-quality portfolio and produce standout independent films.',
      },
    ],
  },
  {
    index: '04',
    title: 'Portfolio-First Approach',
    points: [
      {
        lead: 'Graduate with a Reel',
        body: 'You leave with more than a certificate &mdash; a polished portfolio, original short films and a professional demo reel.',
      },
      {
        lead: 'Ready for Clients and Employers',
        body: 'The work you finish here is the work you introduce yourself with.',
      },
    ],
  },
]

/* "Why choose AFA" — a 2x2 panel grid. Deliberately boxed, unlike the open
   step column in "How we work" and the three-card row in "Why AFA exists":
   each reason carries two supporting points, so the panels need real padding
   to keep the gold lead-ins scannable. */
export function WhyChoose() {
  return (
    <section className="bg-canvas py-20 md:py-32">
      <div
        id="why-choose"
        className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 md:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-x-20">
          <Reveal>
            <Eyebrow>Why choose AFA</Eyebrow>
            <h2 className="mt-5 max-w-[18ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-gold md:text-5xl">
              Why choose Addisalem Film Academy?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[58ch] text-base leading-relaxed text-ash md:text-lg">
              We bridge the gap between passion and profession. Our curriculum is built
              around practical experience, industry standards and creative freedom, so you
              graduate as a job-ready filmmaker.
            </p>
          </Reveal>
        </div>

        <ol className="mt-14 grid gap-4 lg:grid-cols-2">
          {reasons.map((reason, i) => (
            <Reveal
              key={reason.title}
              delay={0.08 * i}
              className="group relative flex flex-col border border-line bg-surface p-7 transition-colors duration-300 hover:border-gold/40 md:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 block h-px w-10 bg-gold/60 transition-all duration-300 group-hover:w-full group-hover:bg-gold"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                {reason.index}
              </p>
              <h3 className="mt-3 max-w-[28ch] font-display text-xl font-bold leading-snug tracking-tight text-ink">
                {reason.title}
              </h3>
              <ul className="mt-6 space-y-4">
                {reason.points.map((point) => (
                  <li key={point.lead} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 block h-px w-4 shrink-0 bg-gold/70"
                    />
                    <p className="text-sm leading-relaxed text-ash">
                      <span className="font-semibold text-ink">{point.lead}:</span>{' '}
                      {point.body}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
