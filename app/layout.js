import { Schibsted_Grotesk } from 'next/font/google'
import './globals.css'

// One typeface, not two. Schibsted Grotesk carries a newspaper's lineage
// (built for a Scandinavian news publisher): direct, confident, built to
// state a result plainly rather than decorate one. No second family
// competing for identity, and no legal/certificate association to retire
// again later.
const grotesk = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-grotesk',
  display: 'swap',
})

export const metadata = {
  title: 'Tenure: AI Employment Firm',
  description:
    'Tenure delivers the outcome: every inquiry answered before it goes cold. We design, build, and manage the AI employee that does it.',
  openGraph: {
    title: 'Tenure: AI Employment Firm',
    description: 'Every inquiry answered before it goes cold. See it work.',
    type: 'website',
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1f5f1' },
    { media: '(prefers-color-scheme: dark)', color: '#080f0a' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body>{children}</body>
    </html>
  )
}
