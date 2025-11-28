import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'
import AOSProvider from '@/components/AOSProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BRIXXO - Construction Marketplace',
  description: 'Connect with verified construction professionals and bring your dream projects to life.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            <AOSProvider>
              {children}
              <Toaster position="top-right" />
            </AOSProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
