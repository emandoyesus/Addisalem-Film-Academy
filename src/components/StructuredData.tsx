import { site, siteDescription, siteUrl, socials } from '../data/content'

/* Dessie city centre, used for the map-pack coordinates. */
const geo = { latitude: 11.1333, longitude: 39.6333 }

/* schema.org wants E.164, so turn the displayed local number into one:
   "09 21 25 88 15" -> "+251921258815". */
const tel = (local: string) => `+251${local.replace(/\D/g, '').replace(/^0/, '')}`

/* Google renders JavaScript before parsing structured data, so building the
   graph from content.ts keeps the address, numbers and hours identical to what
   visitors actually read — edit the content file and this follows. */
export function StructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#business`,
    name: site.name,
    description: siteDescription,
    url: siteUrl,
    logo: `${siteUrl}/logo.jpg`,
    image: `${siteUrl}/logo.jpg`,
    telephone: tel(site.phone),
    email: site.email,
    foundingDate: '2018',
    currenciesAccepted: 'ETB',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Piyassa',
      addressLocality: site.city,
      addressRegion: 'Amhara',
      addressCountry: 'ET',
    },
    geo: { '@type': 'GeoCoordinates', ...geo },
    hasMap: site.mapUrl,
    areaServed: [
      { '@type': 'City', name: 'Dessie' },
      { '@type': 'AdministrativeArea', name: 'Amhara Region' },
    ],
    openingHoursSpecification: site.schemaHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: socials.map((s) => s.href),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
