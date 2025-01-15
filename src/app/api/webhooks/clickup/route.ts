import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma/client'
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

        // Find the task in our database using ClickUp task ID
        const task = await prisma.task.findFirst({
            where: { clickupTaskId: task_id },
            include: { organization: true },
        })

        if (!task) {
            return new NextResponse('Task not found', { status: 404 })
        }

        // Process different types of updates
        for (const item of history_items) {
            switch (item.field) {
                case 'status':
                    await prisma.task.update({
                        where: { id: task.id },
                        data: { status: item.after.status },
                    })
                    // Emit real-time update
                    io.to(`org_${task.organizationId}`).emit('task:update', {
                        id: task.id,
                        status: item.after.status,
                    })
                    break

                case 'content':
                    await prisma.task.update({
                        where: { id: task.id },
                        data: { description: item.after.content },
                    })
                    io.to(`org_${task.organizationId}`).emit('task:update', {
                        id: task.id,
                        description: item.after.content,
                    })
                    break

                // Add more cases for other field updates
            }
        }

        return new NextResponse('OK')
    } catch (error) {
        console.error('Webhook error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 