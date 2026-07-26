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
    'Tenure designs, builds, and manages AI employees: their own workstation, their own email, and access to your tools. It just never sleeps.',
  openGraph: {
    title: 'Tenure: AI Employment Firm',
    description: 'A real employee. It just never sleeps. See it work.',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#040b06',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body>
        {/* Scroll-reveal hides .reveal content until IntersectionObserver
            fires; without JS that would never happen, so show it plainly. */}
        <noscript>
          <style>{'.reveal { opacity: 1 !important; transform: none !important; }'}</style>
        </noscript>
        {/* Fixed, persistent backdrop standing in for Riopack's video: an
            activity grid of staggered pulsing dots in the accent color.
            Content floats over it in glass panels. */}
        <div className="bg" aria-hidden="true">
          <div className="bg__grid">
            {Array.from({ length: 48 }, (_, i) => (
              <span className="bg__dot" key={i} />
            ))}
          </div>
        </div>
        <div className="page">{children}</div>
      </body>
    </html>
  )
}
