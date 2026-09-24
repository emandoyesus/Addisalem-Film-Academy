/* ------------------------------------------------------------------
   ADDISALEM FILM TRAINING CENTER — site content
   Edit everything here. Copy, numbers, contacts, instructors and
   images all flow from this single file.
------------------------------------------------------------------- */

export type HoursEntry = { day: string; time: string }

export type Program = {
  title: string
  duration: string
  focus: string
  tagline: string
  courses: string[]
  toolkit?: string
  bestFor: string
  image: string
  alt: string
}

export type Facility = {
  icon: 'stageset' | 'screen' | 'edit' | 'camera' | 'library' | 'audio'
  title: string
  copy: string
  items?: string[]
}

export type Story = { quote: string; name: string; role: string }

export type GalleryItem = {
  id: string
  caption: string
  w: number
  contain?: boolean
  /** Optional smaller tile for the strip; `id` stays the full-size asset. */
  src?: string
}

export type Stat = { value: string; label: string }

export type Social = { label: string; href: string; icon: string }

export type AnnouncementTag = 'Sitcom' | 'Edit' | 'News' | 'Short Film' | 'None'

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
  /** Feed position; ascending, 0 = featured. Omitted for legacy docs. */
  order?: number
}

export type SiteInfo = {
  name: string
  label: string
  city: string
  region: string
  address: string
  mapUrl: string
  phone: string
  phoneAlt: string
  email: string
  hours: HoursEntry[]
  founded: number
}

/** Unsplash image helper. Swap any `id` for a real photo of the
    center, or replace the whole `img(...)` call with a local asset. */
export const img = (id: string, w = 1200, q = 80): string =>
  id.startsWith('/') || id.startsWith('http')
    ? id
    : `https://images.unsplash.com/${id}?q=${q}&w=${w}&auto=format&fit=crop`

export const images = {
  about: img('photo-1485846234645-a62644f84728', 1200, 80),
  facilities: img('photo-1553377102-7479aacccd00', 1400, 80),
}

export const site: SiteInfo = {
  name: 'Addisalem Film Academy',
  label: 'ADDISALEM',
  city: 'Dessie',
  region: 'Dessie, Ethiopia',
  address: 'Seid Yasin building, Piyassa, Dessie, Ethiopia',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=Seid+Yasin+building%2C+Piyassa%2C+Dessie%2C+Ethiopia',
  phone: '09 89 81 84 79',
  phoneAlt: '09 21 25 88 15',
  email: 'addisalemfilms@gmail.com',
  hours: [
    { day: 'Monday to Friday', time: '9:00 – 17:00' },
    { day: 'Saturday', time: '9:00 – 13:00' },
    { day: 'Sunday', time: 'Closed' },
  ],
  founded: 2011,
}

export const navLinks: { label: string; href: string }[] = [
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Stories', href: '#stories' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
]

export const marqueeWords: string[] = [
  'Photography',
  'Videography',
  'Screen Writing',
  'Film Acting',
  'Cinematography',
  'Film Lighting',
  'Sound Design',
  'Directing',
  'Film Production',
  'Video Editing',
  'Graphics Design',
  'Motion Design',
  'Digital Marketing',
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

/** Small-first srcset so cards on phones fetch the ~8 KB thumbnail instead of
    the 480–1280px one. Stops at `sddefault` because `maxresdefault` is not
    guaranteed to exist for every upload. */
export function youtubeThumbSrcSet(videoId: string): string {
  const base = `https://i.ytimg.com/vi/${videoId}`
  return [
    `${base}/mqdefault.jpg 320w`,
    `${base}/hqdefault.jpg 480w`,
    `${base}/sddefault.jpg 640w`,
  ].join(', ')
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
  { value: '850+', label: 'Graduates since 2011' },
  { value: '120+', label: 'Short films produced by students' },
  { value: '10', label: 'Disciplines taught' },
  { value: '12+', label: 'Alumni working in film today' },
]

export const programs: Program[] = [
  {
    title: 'The 2-Month Intensive',
    duration: '2 months',
    focus: 'Core Visual Media Skills',
    tagline:
      'Photography, videography, photo and video editing, with digital marketing.',
    courses: [
      'Photography',
      'Videography',
      'Graphic Design',
      'Motion Design',
      'Photo & Video Editing',
      'Digital Marketing',
    ],
    toolkit:
      'Hands-on photo and video editing using industry-standard software: Premiere Pro (Pr), After Effects (Ae), Photoshop (Ps), Illustrator (Ai), InDesign (ID), and Cinema 4D (C4D).',
    bestFor:
      'Creators, marketers, and aspiring editors who need to build immediate, practical skills.',
    image: img('photo-1626785774573-4b799315345d', 1000, 78),
    alt: 'Designer working on a poster layout on screen',
  },
  {
    title: 'The 5-Month Immersive',
    duration: '5 months',
    focus: 'The Complete Filmmaking Journey',
    tagline: 'The full AFA curriculum, from script to screen.',
    courses: [
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
    ],
    bestFor: 'Dedicated students ready for a full-time, fast-paced crew experience.',
    image: img('photo-1503095396549-807759245b35', 1000, 78),
    alt: 'Stage light racks above a film set',
  },
  {
    title: 'The 10-Month Extended',
    duration: '10 months',
    focus: 'The Complete Curriculum, Flexible Pace',
    tagline:
      'The exact same full curriculum as the 5-month program, but with a flexible weekly schedule.',
    courses: [
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
    ],
    bestFor:
      'Working professionals or university students balancing other commitments.',
    image: img('photo-1524678606370-a47ad25cb82a', 1000, 78),
    alt: 'High-end camera body being prepared for a shoot',
  },
]

export const facilities: Facility[] = [
  {
    icon: 'stageset',
    title: 'Classroom',
    copy: 'Lectures, reviews, colour checks and wall screenings all share the same four walls.',
  },
  {
    icon: 'camera',
    title: 'Camera & Grip',
    copy: '',
    items: [
      'Digital Cinema & DSLR cameras',
      'Drone',
      'Tripod, monopod and Gimbal',
      'Spot and flood light',
    ],
  },
  {
    icon: 'audio',
    title: 'Production Audio',
    copy: 'Field Recording with Zoom H6. Microphones: wireless neck mic and shotgun mics, including the Sennheiser MKE 600.',
  },
  {
    icon: 'edit',
    title: 'The Post-Production Suite',
    copy: 'The Workstations: Dedicated editing computers available for students to practice during off-hours. The Software: the complete Adobe Creative Cloud (Premiere Pro, After Effects, Photoshop, Illustrator, InDesign) for editing and motion design.',
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
  { id: '/media/gallery/01-add-award.jpg', src: '/media/gallery/01-add-award-900.webp', caption: 'ADD Award', w: 2500, contain: true },
  { id: '/media/gallery/02-actor.jpg', src: '/media/gallery/02-actor-900.webp', caption: 'Best actor of the year', w: 1280, contain: true },
  { id: '/media/gallery/03-cinematographer.jpg', src: '/media/gallery/03-cinematographer-900.webp', caption: 'Best cinematographer of the year', w: 1280, contain: true },
  { id: '/media/gallery/04-director.jpg', src: '/media/gallery/04-director-900.webp', caption: 'Best director of the year', w: 1280, contain: true },
  { id: '/media/gallery/05-graphics-designer.jpg', src: '/media/gallery/05-graphics-designer-900.webp', caption: 'Best graphics designer of the year', w: 1280, contain: true },
  { id: '/media/gallery/06-script-writer.jpg', src: '/media/gallery/06-script-writer-900.webp', caption: 'Best script writer of the year', w: 1280, contain: true },
  { id: '/media/gallery/07-video-editor.jpg', src: '/media/gallery/07-video-editor-900.webp', caption: 'Best video editor of the year', w: 1280, contain: true },
]

export const socials: Social[] = [
  { label: 'YouTube', href: youtubeChannel, icon: 'youtube' },
  { label: 'Telegram', href: 'https://t.me/Addisalemfilmacademy', icon: 'telegram' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@addisalemfilms', icon: 'tiktok' },
  { label: 'Instagram', href: 'https://www.instagram.com/aschalew.addisalem', icon: 'instagram' },
]