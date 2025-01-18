import { NextResponse } from 'next/server'
import { ClickUpSync } from '@/lib/clickup/sync'
import { store } from '@/lib/memory-store'
import { io } from '@/lib/socket'
import crypto from 'crypto'

const sync = new ClickUpSync(process.env.CLICKUP_API_KEY!)

// Verify webhook signature
function verifyWebhook(signature: string, body: string) {
    const hmac = crypto.createHmac('sha256', process.env.CLICKUP_WEBHOOK_SECRET!)
    const digest = hmac.update(body).digest('hex')
    return signature === digest
}

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = req.headers.get('x-signature')

        // Verify webhook signature
        if (!signature || !verifyWebhook(signature, body)) {
            return new NextResponse('Invalid signature', { status: 401 })
        }

        const event = JSON.parse(body)
        const { task_id, history_items } = event

        // Get company ID from task
        const task = await store.findTaskByClickUpId(task_id)
        if (!task) {
            return new NextResponse('Task not found', { status: 404 })
        }

        // Pull latest task data from ClickUp
        await sync.pullTaskFromClickUp(task_id, task.companyId)

        // Emit real-time update
        io.to(`company:${task.companyId}`).emit('task:update', {
            taskId: task.id,
            updates: history_items
        })

        return new NextResponse('OK')
    } catch (error) {
        console.error('Webhook error:', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
} 