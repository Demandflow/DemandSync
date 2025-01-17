import { NextResponse } from 'next/server'
import { store } from '@/lib/memory-store'
import type { TaskWithRelations, KanbanColumn } from '@/lib/task-manager'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const organizationId = searchParams.get('organizationId')

        if (!organizationId) {
            return new NextResponse('Organization ID is required', { status: 400 })
        }

        const tasks = await store.getTasks(organizationId)
        return NextResponse.json(tasks)
    } catch (error) {
        console.error('Error fetching tasks:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const task = await store.createTask({
            title: data.title,
            description: data.description,
            status: data.status as KanbanColumn,
            organizationId: data.organizationId,
        })
        return NextResponse.json(task)
    } catch (error) {
        console.error('Error creating task:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const { taskId, ...updates } = await request.json()
        const task = await store.updateTask(taskId, updates)

        if (!task) {
            return new NextResponse('Task not found', { status: 404 })
        }

        return NextResponse.json(task)
    } catch (error) {
        console.error('Error updating task:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 