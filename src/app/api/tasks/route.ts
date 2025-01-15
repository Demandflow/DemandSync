import { NextResponse } from 'next/server'
import { store } from '@/lib/memory-store'

// Temporary user data for development
const MOCK_USER = {
    id: 'user_123',
    email: 'demo@example.com',
    organizationId: 'org_123'
}

export async function GET() {
    try {
        const tasks = await store.getTasks(MOCK_USER.organizationId)
        return NextResponse.json(tasks)
    } catch (error) {
        console.error('Error fetching tasks:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { title, description } = await request.json()

        const task = await store.createTask({
            title,
            description,
            status: 'todo',
            organizationId: MOCK_USER.organizationId,
            clickupTaskId: Math.random().toString(36).substring(7)
        })

        return NextResponse.json(task)
    } catch (error) {
        console.error('Error creating task:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 