import { type Icon, Buildings, FilmSlate, Monitor, VideoCamera, Books } from '@phosphor-icons/react'
import { Reveal } from './ui'
import { images, facilities } from '../data/content'

const iconMap: Record<string, Icon> = {
  stageset: Buildings,
  screen: FilmSlate,
  edit: Monitor,
  camera: VideoCamera,
  library: Books,
}

export function Facilities() {
  return (
    <section id="facilities" className="scroll-mt-24 bg-canvas-soft py-20 md:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <Reveal className="relative order-2 lg:order-1">
            <div className="absolute -left-3 -top-3 h-full w-full rounded-2xl border border-gold/40 md:-left-5 md:-top-5" />
            <img
              src={images.facilities}
              alt="Students and crew working together on a training set"
              width={1400}
              height={1050}
              loading="lazy"
              className="relative aspect-[4/3] w-full rounded-2xl object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-black/70 p-5 backdrop-blur-md">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                Set day · every week
              </p>
              <p className="mt-1 text-sm text-white">
                Theory gets a foot on the floor. Crew roles rotate so everyone directs,
                shoots and grips.
              </p>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <h2 className="max-w-[16ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
              A working studio, not just a classroom.
            </h2>
            <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-ash md:text-lg">
              Everything students need to make real films is under one roof in Dessie,
              from the sound stage to the screening room.
            </p>

            <ul className="mt-10 space-y-0 border-t border-line">
              {facilities.map((facility, i) => {
                const Glyph = iconMap[facility.icon] ?? FilmSlate
                return (
                  <Reveal key={facility.title} delay={i * 0.06}>
                    <li className="grid grid-cols-[auto_1fr] gap-5 border-b border-line py-6">
                      <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-gold">
                        <Glyph size={20} weight="duotone" />
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                          {facility.title}
                        </h3>
                        <p className="mt-1.5 max-w-[52ch] text-sm leading-relaxed text-ash">
                          {facility.copy}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}