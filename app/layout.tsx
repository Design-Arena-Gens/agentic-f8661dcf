import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Binance Spot Account Viewer',
  description: 'View your Binance spot account balances',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
