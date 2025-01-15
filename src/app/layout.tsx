import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'DemandSync - Client Portal',
    description: 'Real-time client portal synchronized with ClickUp',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <ClerkProvider>
                <body className={inter.className}>
                    <main className="min-h-screen bg-gray-50">
                        {children}
                    </main>
                </body>
            </ClerkProvider>
        </html>
    )
} 