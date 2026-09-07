import {
  type Icon,
  InstagramLogo,
  YoutubeLogo,
  TelegramLogo,
  TiktokLogo,
} from '@phosphor-icons/react'
import { site, navLinks, programs, socials } from '../data/content'
import { Logo } from './Logo'

const iconMap: Record<string, Icon> = {
  instagram: InstagramLogo,
  youtube: YoutubeLogo,
  telegram: TelegramLogo,
  tiktok: TiktokLogo,
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-[36ch] text-sm leading-relaxed text-ash">
              Hands-on film training in Dessie for the next generation of Ethiopian
              storytellers. Est. {site.founded}.
            </p>
            <div className="mt-7 flex gap-3">
              {socials.map((social) => {
                const Glyph = iconMap[social.icon]
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ash transition-colors hover:border-gold/60 hover:text-gold"
                  >
                    <Glyph size={16} />
                  </a>
                )
              })}
            </div>
          </div>

          <nav aria-label="Footer explorer">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-ash transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer programs">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
              Programs
            </p>
            <ul className="mt-5 space-y-3">
              {programs.map((p) => (
                <li key={p.title}>
                  <a
                    href="#programs"
                    className="text-sm text-ash transition-colors hover:text-ink"
                  >
                    {p.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
              Contact
            </p>
            <ul className="mt-5 space-y-3 text-sm text-ash">
              <li>{site.address}</li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-ink"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-ink"
                >
                  {site.email}
                </a>
              </li>
              {site.hours.slice(0, 2).map((h) => (
                <li key={h.day} className="font-mono text-[11px] text-faint">
                  {h.day}, {h.time}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            {site.label} · {site.region}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            © {year} {site.name}
          </p>
        </div>
      </div>
    </footer>
  )
}