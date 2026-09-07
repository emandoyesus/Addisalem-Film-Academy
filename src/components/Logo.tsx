export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <span
      className={`inline-block overflow-hidden rounded-xl border border-line-strong ${className}`}
    >
      <img
        src="/logo.jpg"
        alt="Addisalem Film Training Center logo"
        width={72}
        height={72}
        className="h-full w-full object-cover"
        loading="eager"
      />
    </span>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="Addisalem Film Training Center, home">
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-sm font-bold tracking-tight text-ink">ADDISALEM</span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-faint">
            Film Training Center
          </span>
        </span>
      )}
    </a>
  )
}