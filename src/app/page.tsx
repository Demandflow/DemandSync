'use client'

import React, { useEffect } from 'react'
import { SignIn } from '@clerk/nextjs'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Home() {
    const { isSignedIn, isLoaded } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push('/dashboard')
        }
    }, [isLoaded, isSignedIn, router])

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="mb-8 text-4xl font-bold">Welcome to DemandSync</h1>
            <SignIn afterSignInUrl="/dashboard" />
        </main>
    )
} 