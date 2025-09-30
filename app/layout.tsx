import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { CometCursor } from '@/components/effects/CometCursor'
import { CartDrawer } from '@/components/cart/CartDrawer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Éclat — Lingerie Fine',
  description: 'Premium lingerie with elegant design and exceptional comfort',
  keywords: ['lingerie', 'premium', 'elegant', 'fashion'],
  authors: [{ name: 'Éclat' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eclat-lingerie.com',
    title: 'Éclat — Lingerie Fine',
    description: 'Premium lingerie with elegant design and exceptional comfort',
    siteName: 'Éclat',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="relative min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <CartDrawer />
            <CometCursor />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
