import emailjs from '@emailjs/browser'
import { programs } from '../data/content'

export type EnrollmentNotice = {
  name: string
  phone: string
  program: string
  message: string
}

/* Sends the "new enrollment" notification email via EmailJS (client-side,
   host-agnostic). Config lives in the EmailJS dashboard; only the three
   public-ish IDs ship in the bundle. Silently skips when not configured. */

export function emailConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  )
}

export async function notifyEnrollment(input: EnrollmentNotice): Promise<void> {
  if (!emailConfigured()) return
  const match = programs.find((p) => p.title === input.program)
  const programDetail = match
    ? `${match.title} — ${match.duration} · ${match.schedule}`
    : input.program
  const date = new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
    {
      from_name: input.name.trim(),
      phone: input.phone.trim(),
      program: match?.title ?? input.program,
      program_detail: programDetail,
      date,
      message: input.message.trim() || 'No additional note left.',
    },
    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string },
  )
}