import { Libre_Caslon_Display, Libre_Caslon_Text, Public_Sans } from 'next/font/google'
import './globals.css'

// Caslon: the historical face of legal and government printing — contracts,
// statutes, records. Public Sans: the US federal design system's face, which is
// the visual world an immigration attorney already works inside.
const caslonDisplay = Libre_Caslon_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-caslon-display',
  display: 'swap',
})

const caslonText = Libre_Caslon_Text({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-caslon-text',
  display: 'swap',
})

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
})

export const metadata = {
  title: 'Tenure — AI Employment Firm',
  description:
    'Tenure designs, hires, trains, and manages AI employees for US immigration law firms. Interview the candidate before you hire it.',
  openGraph: {
    title: 'Tenure — AI Employment Firm',
    description:
      'Meet your next hire: a managed AI Intake Coordinator for immigration law firms.',
    type: 'website',
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f1f0' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1a1a' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${caslonDisplay.variable} ${caslonText.variable} ${publicSans.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
