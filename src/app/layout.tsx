import '@/styles/globals.css'
import {Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/components/Providers'
export const metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const fonter = Inter({subsets: ['latin']})

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode,
  authModal: React.ReactNode,
}) {
  return (
    <html lang='' className={cn('bg-white text-sky-900 antialiased light',fonter.className)}>
      <body className=' min-h-screen pt-12 bg-slate-50 antialiased'>
        <Providers>
          {/* @ts-expect-error server component */}
          <Navbar/>
          {authModal}
          <Toaster />
          <div className=' container max-w-7xl mx-auto h-full pt-12'>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
