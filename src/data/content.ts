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
  address: 'Seid Yasin building, 5th floor, Piyassa, Dessie, Amhara, Ethiopia',
  phone: '09 89 81 84 79',
  phoneAlt: '09 21 25 88 15',
  email: 'admissions@addisalemfilm.com',
  hours: [
    { day: 'Monday to Friday', time: '9:00 – 17:00' },
    { day: 'Saturday', time: '9:00 – 13:00' },
    { day: 'Sunday', time: 'Closed' },
  ],
  founded: 2014,
}

export const navLinks: { label: string; href: string }[] = [
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Stories', href: '#stories' },
  { label: 'Contact', href: '#contact' },
]

export const marqueeWords: string[] = [
  'Photography',
  'Videography',
  'Directing',
  'Cinematography',
  'Screenwriting',
  'Film Editing',
  'Sound Design',
  'Film Production',
  'Graphic Design',
  'Motion Design',
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
  { value: '10', label: 'Disciplines taught' },
  { value: '40+', label: 'Alumni working in film today' },
]

export const programs: Program[] = [
  {
    title: 'Photography',
    tagline: 'Framing, exposure, light and composition. Capture images that tell a story before a single word is spoken.',
    level: 'All levels',
    image: img('photo-1502920917128-1aa500764cbd', 1000, 78),
    alt: 'Photographer composing a shot through the viewfinder',
  },
  {
    title: 'Videography',
    tagline: 'From phone shoots to production cameras. Master movement, framing and storytelling in motion.',
    level: 'Foundation + advanced',
    image: img('photo-1574717024653-61fd2cf4d44d', 1000, 78),
    alt: 'Videographer filming with a stabilised camera rig',
  },
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
    image: img('photo-1483058712412-4245e9b90334', 1000, 78),
    alt: 'A writer at a typewriter turning pages into script',
  },
  {
    title: 'Film Editing',
    tagline: 'Timeline craft, sound and colour. Shape raw footage into release-ready films.',
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
    title: 'Film Production',
    tagline: 'Budgets, schedules, permits, crews. Learn what it takes to get a film made and released.',
    level: 'Foundation',
    image: img('photo-1521737604893-d14cc237f11d', 1000, 78),
    alt: 'A small film crew reviewing a scene between takes',
  },
  {
    title: 'Graphic Design',
    tagline: 'Posters, title cards, social assets and brand systems. Visual storytelling beyond the frame.',
    level: 'All levels',
    image: img('photo-1626785774573-4b799315345d', 1000, 78),
    alt: 'Designer working on a poster layout on screen',
  },
  {
    title: 'Motion Design',
    tagline: 'Animate titles, transitions and visual effects. Bring static designs to life with movement.',
    level: 'All levels',
    image: img('photo-1550745165-9bc0b252726f', 1000, 78),
    alt: 'Motion graphics workspace with keyframes on screen',
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
    title: 'One classroom',
    copy: 'The whole school happens in a single room. Lectures, reviews, colour checks and wall screenings all share the same four walls.',
  },
  {
    icon: 'edit',
    title: 'Editing computers',
    copy: 'Dedicated computers loaded with professional editing, grading and sound software, ready for practice after class and on off-hours.',
  },
  {
    icon: 'camera',
    title: 'Cameras, drone & kits',
    copy: 'A fleet of cameras across formats, a drone for the aerial shots, plus lenses, microphones and lighting loaned for student shoots.',
  },
]

export const instructors: Instructor[] = []

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