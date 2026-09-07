import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  MapPin,
  Phone,
  Envelope,
  Clock,
  CheckCircle,
  PaperPlaneTilt,
} from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { site, programs } from '../data/content'

type FormValues = {
  name: string
  phone: string
  program: string
  message: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

type Status = 'idle' | 'sending' | 'sent'

const initialValues: FormValues = {
  name: '',
  phone: '',
  program: '',
  message: '',
}

export function Contact() {
  const reduce = useReducedMotion()
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  const set =
    (key: keyof FormValues) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }))
      setErrors((er) => ({ ...er, [key]: undefined }))
    }

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!values.name.trim()) next.name = 'Please tell us your name.'
    if (!values.phone.trim()) next.phone = 'Phone or Telegram number is required.'
    if (!values.program) next.program = 'Choose the program you are interested in.'
    if (values.message.trim().length > 0 && values.message.trim().length < 10)
      next.message = 'A sentence or two helps us prepare your visit.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    /* TODO(owner): connect to your form backend / email service here */
    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 900)
  }

  const inputBase =
    'w-full rounded-xl border bg-canvas px-4 py-3 text-sm text-ink placeholder:text-faint transition-colors focus:outline-none focus:ring-2 focus:ring-gold/60'

  const fieldClass = (hasError: boolean) =>
    `${inputBase} ${hasError ? 'border-gold' : 'border-line-strong focus:border-gold/50'}`

  const infoItems = [
    { icon: MapPin, label: 'Visit', lines: [site.address] },
    { icon: Phone, label: 'Call us', lines: [site.phone, site.phoneAlt] },
    { icon: Envelope, label: 'Email', lines: [site.email] },
    { icon: Clock, label: 'Hours', lines: site.hours.map((h) => `${h.day}, ${h.time}`) },
  ]

  return (
    <section id="contact" className="scroll-mt-24 bg-canvas-soft py-20 md:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8">
        <div className="max-w-[60ch]">
          <h2 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
            Admissions are open for the next intake.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ash md:text-lg">
            Send an application and come for a campus tour. We take final films over
            prepared notes, so a phone in your pocket is enough to begin.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {infoItems.map((item) => (
                <li key={item.label}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-gold">
                    <item.icon size={18} weight="duotone" />
                  </span>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                    {item.label}
                  </p>
                  {item.lines.map((line) => (
                    <p
                      key={line}
                      className="mt-2 text-sm leading-relaxed text-ash first:mt-3 first:text-ink"
                    >
                      {line}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl border border-gold/40 bg-gold-soft p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                No experience required
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                Around half of every intake starts from zero. The other half brings
                clips, scripts or a stubborn curiosity. Both kinds graduate.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {status === 'sent' ? (
              <div className="flex h-full flex-col items-start justify-center rounded-2xl border border-line bg-surface p-8 md:p-10">
                <CheckCircle size={40} weight="duotone" className="text-gold" />
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink">
                  Application received.
                </h3>
                <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-ash">
                  The admissions office will call you on {values.phone} within two
                  working days to arrange a visit.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setValues(initialValues)
                    setStatus('idle')
                  }}
                  className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-gold underline-offset-4 hover:underline"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                className="rounded-2xl border border-line bg-surface p-7 md:p-9"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={values.name}
                      onChange={set('name')}
                      placeholder="Leul Assefa"
                      aria-invalid={Boolean(errors.name)}
                      className={fieldClass(Boolean(errors.name))}
                    />
                    {errors.name && (
                      <p className="mt-2 text-xs text-gold">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-ink">
                      Phone or Telegram
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={values.phone}
                      onChange={set('phone')}
                      placeholder="+251 9_ ___ ____"
                      aria-invalid={Boolean(errors.phone)}
                      className={fieldClass(Boolean(errors.phone))}
                    />
                    {errors.phone && (
                      <p className="mt-2 text-xs text-gold">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="program" className="mb-2 block text-sm font-medium text-ink">
                    Program of interest
                  </label>
                  <select
                    id="program"
                    value={values.program}
                    onChange={set('program')}
                    aria-invalid={Boolean(errors.program)}
                    className={`${fieldClass(Boolean(errors.program))} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%3E%3Cpath%20d%3D%22M1%201l5%205%205-5%22%20stroke%3D%22%23808080%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
                  >
                    <option value="">Select a program</option>
                    {programs.map((p) => (
                      <option key={p.title} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                    <option value="Not sure yet">Not sure yet, advise me</option>
                  </select>
                  {errors.program && (
                    <p className="mt-2 text-xs text-gold">{errors.program}</p>
                  )}
                </div>

                <div className="mt-5">
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">
                    Anything to add
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                      optional
                    </span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={values.message}
                    onChange={set('message')}
                    placeholder="Tell us a story you would like to make one day."
                    aria-invalid={Boolean(errors.message)}
                    className={`${fieldClass(Boolean(errors.message))} resize-none`}
                  />
                  {errors.message && (
                    <p className="mt-2 text-xs text-gold">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-gold-ink transition-all duration-300 hover:bg-gold-deep active:translate-y-[-1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gold-ink/40 border-t-gold-ink" />
                      Sending
                    </>
                  ) : (
                    <>
                      Enroll this intake <PaperPlaneTilt size={14} />
                    </>
                  )}
                </button>
                <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  Or call {site.phone} during office hours
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}