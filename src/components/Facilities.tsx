import {
  type Icon,
  Buildings,
  FilmSlate,
  Monitor,
  VideoCamera,
  Books,
  Microphone,
} from '@phosphor-icons/react'
import { Reveal } from './ui'
import { images, facilities, type Facility } from '../data/content'
import { unsplashSrcSet } from '../lib/responsive'
import { LoadingImage } from './LoadingImage'

const iconMap: Record<string, Icon> = {
  stageset: Buildings,
  screen: FilmSlate,
  edit: Monitor,
  camera: VideoCamera,
  library: Books,
  audio: Microphone,
}

function FacilityItem({ facility, delay = 0 }: { facility: Facility; delay?: number }) {
  const Glyph = iconMap[facility.icon] ?? FilmSlate
  return (
    <Reveal
      delay={delay}
      className="flex gap-4 border-b border-line py-5"
    >
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-gold">
        <Glyph size={19} weight="duotone" />
      </span>
      <div className="min-w-0">
        <h3 className="font-display text-base font-semibold tracking-tight text-ink">
          {facility.title}
        </h3>
        {facility.copy && (
          <p className="mt-1 max-w-[52ch] text-sm leading-relaxed text-ash">
            {facility.copy}
          </p>
        )}
        {facility.items && (
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {facility.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  )
}

export function Facilities() {
  const topFacilities = facilities.slice(0, 2)
  const bottomFacilities = facilities.slice(2)

  return (
    <section className="bg-canvas-soft py-20 md:py-32">
      <div id="facilities" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-x-20">
          <Reveal className="relative order-2 lg:order-1">
            <div className="absolute -left-3 -top-3 h-full w-full rounded-2xl border border-gold/40 md:-left-5 md:-top-5" />
            <LoadingImage
              src={images.facilities}
              srcSet={unsplashSrcSet(images.facilities, [480, 720, 960, 1200, 1600], 72)}
              sizes="(min-width: 1024px) 45vw, 100vw"
              alt="A black video camera at the AFA studio"
              width={1400}
              height={1050}
              loading="lazy"
              decoding="async"
              className="relative aspect-[4/3] w-full rounded-2xl object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-black/70 p-5 backdrop-blur-md">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                Two rooms, full kit
              </p>
              <p className="mt-1 text-sm text-white">
                The camera you learn on is the one you shoot your graduation film with.
              </p>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <h2 className="max-w-[20ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
              The AFA Studio &amp; Gear Vault
            </h2>
            <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-ash md:text-base">
              Professional tools for authentic storytelling. At Addisalem Film Academy,
              your training is hands-on from week one. Our two dedicated classrooms are
              fully equipped with the industry-standard cameras, audio recorders, and
              editing suites you need to bring your vision to life.
            </p>

            <div className="mt-7 border-t border-line">
              {topFacilities.map((facility, i) => (
                <FacilityItem key={facility.title} facility={facility} delay={i * 0.06} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid border-t border-line lg:grid-cols-2 lg:gap-x-20">
          {bottomFacilities.map((facility, i) => (
            <FacilityItem key={facility.title} facility={facility} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  )
}