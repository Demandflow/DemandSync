import { NextResponse } from 'next/server'
import { store } from '@/lib/memory-store'

// Temporary user data for development
const MOCK_USER = {
    id: 'user_123',
    email: 'demo@example.com',
    organizationId: 'org_123'
}

export async function POST(
    request: Request,
    { params }: { params: { taskId: string } }
) {
    try {
        const { content } = await request.json()
        const comment = await store.addComment(params.taskId, {
            content,
            userId: MOCK_USER.id,
            userEmail: MOCK_USER.email
        })

        if (!comment) {
            return new NextResponse('Task not found', { status: 404 })
        }

        return NextResponse.json(comment)
    } catch (error) {
        console.error('Error creating comment:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 