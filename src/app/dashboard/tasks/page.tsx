'use client'

import { useEffect, useState } from 'react'
import KanbanBoard from '@/components/KanbanBoard'

interface Task {
    id: string
    title: string
    description: string
    status: 'todo' | 'in_progress' | 'in_review' | 'done'
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('/api/tasks')
                const data = await response.json()
                setTasks(data)
            } catch (error) {
                console.error('Failed to fetch tasks:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTasks()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="text-sm text-gray-500">Loading tasks...</div>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-4rem)]">
            <div className="flex justify-between items-center py-4 px-6 border-b">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold text-gray-900">Master Database</h1>
                    <button className="text-sm text-gray-500 hover:text-gray-900">
                        Board view
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 bg-blue-600 text-white"
                        onClick={() => {
                            // TODO: Implement new task creation
                        }}
                    >
                        New
                    </button>
                </div>
            </div>
            <KanbanBoard initialTasks={tasks} />
        </div>
    )
} 