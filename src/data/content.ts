/* ------------------------------------------------------------------
   ADDISALEM FILM TRAINING CENTER — site content
   Edit everything here. Copy, numbers, contacts, instructors and
   images all flow from this single file.
------------------------------------------------------------------- */

export type HoursEntry = { day: string; time: string }

export type Program = {
  title: string
  tagline: string
  level: string
  image: string
  alt: string
  note?: string
}

export type PathStage = {
  step: string
  title: string
  length: string
  copy: string
  tags: string[]
}

export type Facility = {
  icon: 'stageset' | 'screen' | 'edit' | 'camera' | 'library'
  title: string
  copy: string
}

export type Instructor = {
  name: string
  role: string
  bio: string
  image: string
  alt: string
}

export type Story = { quote: string; name: string; role: string }

export type GalleryItem = { id: string; caption: string; w: number }

export type Stat = { value: string; label: string }

export type Social = { label: string; href: string; icon: string }

export type AnnouncementTag = 'Sitcom' | 'Edit' | 'News'

export type Announcement = {
  id: string
  title: string
  /** Display date shown on the card, e.g. "1 Sep 2026". */
  date: string
  tag: AnnouncementTag
  description: string
  /** Paste a YouTube video ID to embed it (thumbnail + in-page player).
      Leave empty for text-only announcements. */
  videoId?: string
  /** Any external link, e.g. the channel video URL. */
  href?: string
}

export type SiteInfo = {
  name: string
  label: string
  city: string
  region: string
  address: string
  phone: string
  phoneAlt: string
  email: string
  hours: HoursEntry[]
  founded: number
}

/** Sorted by most common brand gold-orange in the official logo. */
export const BRAND_GOLD = '#ffba21'

/** Unsplash image helper. Swap any `id` for a real photo of the
    center, or replace the whole `img(...)` call with a local asset. */
export const img = (id: string, w = 1200, q = 80): string =>
  `https://images.unsplash.com/${id}?q=${q}&w=${w}&auto=format&fit=crop`

export const images = {
  hero: img('photo-1489599849927-2ee91cede3ba', 2000, 80),
  about: img('photo-1502920917128-1aa500764cbd', 1200, 80),
  facilities: img('photo-1521737604893-d14cc237f11d', 1400, 80),
}

export const site: SiteInfo = {
  name: 'Addisalem Film Training Center',
  label: 'ADDISALEM',
  city: 'Dessie',
  region: 'Amhara, Ethiopia',
  // TODO(owner): replace with the real registered address
  address: 'Ras Abebe Aregay Avenue, Dessie, Amhara, Ethiopia',
  // TODO(owner): replace with real contact numbers
  phone: '+251 91 100 0000',
  phoneAlt: '+251 33 200 0000',
  email: 'admissions@addisalemfilm.com',
  hours: [
    { day: 'Monday to Friday', time: '9:00 – 17:00' },
    { day: 'Saturday', time: '9:00 – 13:00 (workshops)' },
    { day: 'Sunday', time: 'Closed' },
  ],
  founded: 2014,
}

export const navLinks: { label: string; href: string }[] = [
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Instructors', href: '#instructors' },
  { label: 'Stories', href: '#stories' },
  { label: 'Contact', href: '#contact' },
]

export const marqueeWords: string[] = [
  'Directing',
  'Cinematography',
  'Screenwriting',
  'Editing',
  'Sound Design',
  'Producing',
  'Documentary',
  'Animation',
]

/* TODO(owner): point this at the real channel URL */
export const youtubeChannel = 'https://www.youtube.com/@AddisalemFilmAcademy'

/** Convert any YouTube link into a watchable ID, or return null. */
export function toVideoId(value: string): string | null {
  const trimmed = value.trim()
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed
  const match =
    trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/) ??
    trimmed.match(/[\w-]{11}/)
  return match ? match[1] : null
}

export function youtubeThumb(videoId: string, hq = false): string {
  return hq
    ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function youtubeEmbed(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
}

/* Sample announcements. To publish a new sitcom episode or edit:
   1. Copy an entry below, paste at the TOP of this array (it becomes the featured card).
   2. Set `videoId` to your YouTube video's ID, or `href` to the channel link.
   Leave `videoId` empty for a text-only announcement. */
export const announcements: Announcement[] = [
  {
    id: 'sitcom-teaser',
    title: 'Sitcom teaser: our first episode is cutting',
    date: '7 Sep 2026',
    tag: 'Sitcom',
    description:
      'A two-minute taste of the first episode, shot on the studio set and cut by our editing students. The full episode lands on the channel on Friday.',
    videoId: '',
    href: 'https://www.youtube.com/@AddisalemFilmAcademy',
  },
  {
    id: 'student-edit',
    title: 'Student edit of the day: dawn over Tossa',
    date: '1 Sep 2026',
    tag: 'Edit',
    description:
      'A weekend-shot short, graded in the post-lab by a second-year colour trainee.',
    videoId: '',
    href: 'https://www.youtube.com/@AddisalemFilmAcademy',
  },
  {
    id: 'november-intake',
    title: 'Admissions open for the November intake',
    date: '22 Aug 2026',
    tag: 'News',
    description:
      'Early-bird applications for foundation courses close on 15 October. Campus tours run every Saturday morning.',
  },
]

/* TODO(owner): replace these figures with real numbers */
export const stats: Stat[] = [
  { value: '850+', label: 'Graduates since 2014' },
  { value: '120+', label: 'Short films produced by students' },
  { value: '2', label: 'Instructors, teaching full-time' },
  { value: '40+', label: 'Alumni working in film today' },
]

export const programs: Program[] = [
  {
    title: 'Directing',
    tagline: 'Scene work, blocking and leading actors, from first read of the script to final cut.',
    level: 'Foundation + advanced',
    image: img('photo-1503095396549-807759245b35', 1000, 78),
    alt: 'Stage light racks above a directing session',
  },
  {
    title: 'Cinematography',
    tagline: 'Camera language, exposure, lenses and light. Learn to shoot on real production cameras.',
    level: 'Foundation + advanced',
    image: img('photo-1524678606370-a47ad25cb82a', 1000, 78),
    alt: 'High-end camera body being prepared for a shoot',
  },
  {
    title: 'Screenwriting',
    tagline: 'Structure, character and dialogue. Write the Ethiopian stories only you can tell.',
    level: 'All levels',
    note: 'Workshops run Saturday mornings, and in the evening twice a week.',
    image: img('photo-1483058712412-4245e9b90334', 1000, 78),
    alt: 'A writer at a typewriter turning pages into script',
  },
  {
    title: 'Editing & Post',
    tagline: 'Timeline craft, sound and colour. Finish projects students polish into release-ready films.',
    level: 'Foundation + advanced',
    image: img('photo-1512316609839-ce289d3eba0a', 1000, 78),
    alt: 'Colour grading session in the edit suite',
  },
  {
    title: 'Sound Design',
    tagline: 'Record, design and mix. Build a soundtrack that carries a film on its own.',
    level: 'All levels',
    note: 'Recording kit available on loan to enrolled students.',
    image: img('photo-1524368535928-5b5e00ddc76b', 1000, 78),
    alt: 'Studio condenser microphone in a recording booth',
  },
  {
    title: 'Producing & Management',
    tagline: 'Budgets, schedules, permits, crews. Learn what it takes to get a film made and released.',
    level: 'Foundation',
    image: img('photo-1521737604893-d14cc237f11d', 1000, 78),
    alt: 'A small film crew reviewing a scene between takes',
  },
]

export const path: PathStage[] = [
  {
    step: '01',
    title: 'Foundation',
    length: '12 weeks',
    copy: 'Camera vocabulary, framing, exposure, story structure. Your first exercises are on a phone camera, your first graded work on a real set.',
    tags: ['Camera language', 'Story basics', 'Set etiquette'],
  },
  {
    step: '02',
    title: 'Craft',
    length: '6 months',
    copy: 'Pick a discipline: directing, camera, editing or sound. Teach it through weekly set days, feedback screenings and supervised crew roles.',
    tags: ['Discipline focus', 'Weekly set days', 'Feedback screenings'],
  },
  {
    step: '03',
    title: 'Studio',
    length: '6 months',
    copy: 'A graduation film made crew-first, with a working crew of current students. Portfolios, festival submissions and industry introductions.',
    tags: ['Graduation film', 'Portfolio', 'Industry placement'],
  },
]

export const facilities: Facility[] = [
  {
    icon: 'stageset',
    title: 'Studio & sets',
    copy: 'A lighting studio that re-dresses as interior sets, plus practical locations across Dessie.',
  },
  {
    icon: 'screen',
    title: 'Screening room',
    copy: 'A 120-seat theatre where weekly film nights and graduation premieres happen in real dark.',
  },
  {
    icon: 'edit',
    title: 'Edit & colour suites',
    copy: 'Twelve 4K workstations running professional editing, grading and sound software.',
  },
  {
    icon: 'camera',
    title: 'Camera & sound kits',
    copy: 'Cinema cameras, lenses, microphones and lighting loaned to enrolled students for shoots.',
  },
  {
    icon: 'library',
    title: 'Film library',
    copy: 'Ethiopian cinema history, reference docs and a growing shelf of scripts and theory.',
  },
]

export const instructors: Instructor[] = [
  {
    name: 'Addisalem',
    role: 'Instructor',
    // TODO(owner): replace with staff portrait and a real bio
    bio: 'Instructor at Addisalem. Teaches hands-on, set-side.',
    image: img('photo-1507003211169-0a1dd7228f2d', 800, 80),
    alt: 'Portrait of Addisalem',
  },
  {
    name: 'Selam',
    role: 'Instructor',
    // TODO(owner): replace with staff portrait and a real bio
    bio: 'Instructor at Addisalem. Teaches hands-on, set-side.',
    image: img('photo-1544005313-94ddf0286df2', 800, 80),
    alt: 'Portrait of Selam',
  },
]

export const stories: Story[] = [
  {
    quote:
      'I came for a weekend phone-film workshop and stayed for three years. Now I shoot commercial work in Addis.',
    name: 'Almaz Kebede',
    role: 'Directing graduate · 2022',
  },
  {
    quote:
      'The set days did more for me than a year of theory. You learn speed, stillness and how to ask for what you need.',
    name: 'Biruk Tadesse',
    role: 'Cinematography graduate · 2023',
  },
  {
    quote:
      'My short premiered at a Dessie festival to a full room. Addisalem gave me the craft, and the room gave me courage.',
    name: 'Hanna Mesfin',
    role: 'Editing graduate · 2024',
  },
]

export const gallery: GalleryItem[] = [
  { id: 'photo-1521737604893-d14cc237f11d', caption: 'On set', w: 3200 },
  { id: 'photo-1503095396549-807759245b35', caption: 'Screening night', w: 2400 },
  { id: 'photo-1505686994434-e3cc5abf1330', caption: 'Under the lights', w: 2400 },
  { id: 'photo-1512316609839-ce289d3eba0a', caption: 'In the edit bay', w: 2400 },
  { id: 'photo-1509042239860-f550ce710b93', caption: 'Break, the Ethiopian way', w: 2400 },
  { id: 'photo-1534088568595-a066f410bcda', caption: 'Prep day', w: 2400 },
  { id: 'photo-1478720568477-152d9b164e26', caption: 'In the can', w: 2400 },
]

export const socials: Social[] = [
  { label: 'Instagram', href: '#', icon: 'instagram' },
  { label: 'YouTube', href: '#', icon: 'youtube' },
  { label: 'Telegram', href: '#', icon: 'telegram' },
  { label: 'TikTok', href: '#', icon: 'tiktok' },
]