'use client'

import { useState, useEffect } from 'react'
import KanbanBoard from '@/components/features/kanban/KanbanBoard'
import { getTasks, createTask, updateTaskStatus, updateTask } from '@/lib/task-manager'
import type { TaskWithRelations, KanbanColumn } from '@/lib/task-manager'
import { XCircle } from 'lucide-react'

// TODO: Replace with actual organization ID from auth context
const MOCK_ORG_ID = 'cm60gyvte0000m4lbvz178mmj'

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-900">Loading tasks...</span>
        </div>
    )
}

function ErrorAlert({ message, onDismiss }: { message: string; onDismiss: () => void }) {
    return (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center">
            <span>{message}</span>
            <button onClick={onDismiss} className="ml-3 text-red-500 hover:text-red-700">
                <XCircle size={20} />
            </button>
        </div>
    )
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<TaskWithRelations[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadTasks()
    }, [])

    async function loadTasks() {
        try {
            setLoading(true)
            const fetchedTasks = await getTasks(MOCK_ORG_ID)
            setTasks(fetchedTasks)
            setError(null)
        } catch (err) {
            console.error('Error loading tasks:', err)
            setError('Failed to load tasks')
        } finally {
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
            setError(null)
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
            const newTask = await createTask(data)
            setTasks(prevTasks => [...prevTasks, newTask])
            setError(null)
        } catch (err) {
            console.error('Error creating task:', err)
            setError('Failed to create task')
        }
    }

    async function handleTaskUpdate(taskId: string, updates: Partial<TaskWithRelations>) {
        try {
            const updatedTask = await updateTask(taskId, updates)
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, ...updatedTask } : task
                )
            )
            setError(null)
        } catch (err) {
            console.error('Error updating task:', err)
            setError('Failed to update task')
        }
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <KanbanBoard
                tasks={tasks}
                onTaskMove={handleTaskMove}
                onTaskCreate={handleTaskCreate}
                onTaskUpdate={handleTaskUpdate}
            />
            {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
        </div>
    )
} 