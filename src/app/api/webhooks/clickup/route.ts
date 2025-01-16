import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { store } from '@/lib/memory-store'
import { io } from '@/lib/socket'

// Verify webhook signature
function verifyWebhook(signature: string, body: string): boolean {
    // TODO: Implement signature verification using CLICKUP_WEBHOOK_SECRET
    return true
}

export async function POST(request: Request) {
    try {
        const signature = headers().get('x-signature') || ''
        const body = await request.text()

        if (!verifyWebhook(signature, body)) {
            return new NextResponse('Invalid signature', { status: 401 })
        }

        const event = JSON.parse(body)
        const { task_id, history_items } = event

        // Find the task in our store
        const task = await store.getTask(task_id)
        if (!task) {
            return new NextResponse('Task not found', { status: 404 })
        }

        // Process different types of updates
        for (const item of history_items) {
            switch (item.field) {
                case 'status':
                    await store.updateTask(task.id, { status: item.after.status })
                    // Emit real-time update
                    io.emit('task:update', {
                        id: task.id,
                        status: item.after.status,
                    })
                    break

                case 'content':
                    await store.updateTask(task.id, { description: item.after.content })
                    io.emit('task:update', {
                        id: task.id,
                        description: item.after.content,
                    })
                    break
            }
        }

        return new NextResponse('OK')
    } catch (error) {
        console.error('Webhook error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 