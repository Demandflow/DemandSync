import { NextResponse } from 'next/server'
import { store } from '@/lib/memory-store'

// Temporary user data for development
const MOCK_USER = {
    id: 'user_123',
    email: 'demo@example.com',
    organizationId: 'org_123'
}

export async function GET(
    request: Request,
    { params }: { params: { taskId: string } }
) {
    try {
        const task = await store.getTask(params.taskId)
        if (!task) {
            return new NextResponse('Task not found', { status: 404 })
        }
        return NextResponse.json(task)
    } catch (error) {
        console.error('Error fetching task:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { taskId: string } }
) {
    try {
        const updates = await request.json()
        const task = await store.updateTask(params.taskId, updates)
        if (!task) {
            return new NextResponse('Task not found', { status: 404 })
        }
        return NextResponse.json(task)
    } catch (error) {
        console.error('Error updating task:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 