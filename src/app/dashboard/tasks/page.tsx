'use client'

import { useState, useEffect } from 'react'
import KanbanBoard from '@/components/KanbanBoard'
import { getTasks, createTask, updateTaskStatus } from '@/lib/task-manager'
import type { TaskWithRelations, KanbanColumn } from '@/lib/task-manager'

const MOCK_ORG_ID = 'cm60gyvte0000m4lbvz178mmj'

export default function TasksPage() {
    const [tasks, setTasks] = useState<TaskWithRelations[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadTasks()
    }, [])

    async function loadTasks() {
        try {
            const fetchedTasks = await getTasks(MOCK_ORG_ID)
            setTasks(fetchedTasks)
            setLoading(false)
        } catch (err) {
            console.error('Error loading tasks:', err)
            setError('Failed to load tasks')
            setLoading(false)
        }
    }

    async function handleTaskMove(taskId: string, newStatus: KanbanColumn) {
        try {
            // Optimistically update the UI
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId
                        ? { ...task, status: newStatus }
                        : task
                )
            )

            // Update in the backend
            await updateTaskStatus(taskId, newStatus)
        } catch (err) {
            console.error('Error moving task:', err)
            setError('Failed to move task')
            // Revert the optimistic update by reloading tasks
            await loadTasks()
        }
    }

    async function handleTaskCreate(data: {
        title: string;
        description: string;
        status: KanbanColumn;
        organizationId: string;
    }) {
        try {
            // Create the task
            const newTask = await createTask({
                title: data.title,
                description: data.description,
                status: data.status,
                organizationId: data.organizationId,
            })

            // Update the UI
            setTasks(prevTasks => [...prevTasks, newTask])
        } catch (err) {
            console.error('Error creating task:', err)
            setError('Failed to create task')
        }
    }

    if (loading) return <div className="p-4">Loading...</div>
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>

    return (
        <div className="p-4">
            <KanbanBoard
                tasks={tasks}
                onTaskMove={handleTaskMove}
                onTaskCreate={handleTaskCreate}
            />
        </div>
    )
} 