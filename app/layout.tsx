import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Content Remixer',
  description: 'A tool to creatively remix your content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
