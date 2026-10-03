import { useState } from 'react'
import emailjs from '@emailjs/browser'

const SOCIALS = [
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@nizamgatwu',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.6 5.82a4.28 4.28 0 0 1-3.13-2.4h-3.1v13.4a2.6 2.6 0 1 1-1.87-2.5v-3.1a5.7 5.7 0 1 0 4.97 5.66V9.45a7.4 7.4 0 0 0 4.03 1.18V7.5a4.27 4.27 0 0 1-.9-1.68z" />
      </svg>
    )
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/nijamgatwu',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" />
      </svg>
    )
  },
  {
    name: 'GitHub',
    href: 'https://github.com/Redz-132',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
      </svg>
    )
  }
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    setSending(true)
    setSent(false)
    setError('')

    const form = e.currentTarget

    const formData = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      setSent(true)
      form.reset()
    } catch (err) {
      console.error('EmailJS error:', err)
      setError('Pesan gagal dikirim. Silakan coba lagi.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-20">
      <div className="max-w-[60ch] mb-8">
        <p className="text-teal font-semibold mb-2.5">
          Contact
        </p>

        <h2 className="font-display text-2xl md:text-3xl font-medium mb-3.5">
          Let's Connect
        </h2>

        <p className="text-ink-soft">
          Punya pertanyaan, masukan, atau ingin berdiskusi tentang LaporAman?
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_0.8fr] gap-14">
        <form onSubmit={handleSubmit} className="space-y-4.5">
          <div>
            <label className="field-label" htmlFor="name">
              Nama
            </label>

            <input
              id="name"
              name="name"
              type="text"
              className="field-input"
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              className="field-input"
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="message">
              Pesan
            </label>

            <textarea
              id="message"
              name="message"
              className="field-input min-h-[110px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="btn btn-primary disabled:opacity-50"
          >
            {sending ? 'Mengirim...' : 'Kirim Pesan'}
          </button>

          {sent && (
            <p className="text-teal text-sm font-medium">
              Pesan berhasil dikirim. Terima kasih!
            </p>
          )}

          {error && (
            <p className="text-red-500 text-sm font-medium">
              {error}
            </p>
          )}
        </form>

        <div>
          <h3 className="font-semibold mb-1">
            Temukan saya di
          </h3>

          <div className="flex flex-col gap-2.5 mt-4">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 rounded-lg border border-line dark:border-white/10 font-semibold text-sm hover:border-teal transition-colors"
              >
                {s.icon}
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}