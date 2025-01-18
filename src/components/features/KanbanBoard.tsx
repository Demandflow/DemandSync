import React from 'react'
import { TaskCard } from './TaskCard'
import { KanbanColumn, COLUMN_DISPLAY_TITLES } from '@/lib/task-manager'

interface Task {
    id: string
    title: string
    description?: string
    status: KanbanColumn
}

interface KanbanBoardProps {
    tasks: Task[]
    onTaskMove: (taskId: string, newStatus: KanbanColumn) => void
    onTaskClick: (taskId: string) => void
}

const STATUSES = ['BACKLOG', 'TO_DO', 'ACTIVE_TASK', 'FOR_REVIEW', 'COMPLETE'] as const

export function KanbanBoard({ tasks, onTaskMove, onTaskClick }: KanbanBoardProps) {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: KanbanColumn) => {
        e.preventDefault()
        const taskId = e.dataTransfer.getData('taskId')
        onTaskMove(taskId, status)
    }

    return (
        <div className="flex gap-4 h-full overflow-x-auto pb-4">
            {STATUSES.map((status) => (
                <div
                    key={status}
                    className="flex-1 min-w-[300px] bg-gray-50 rounded-lg p-4"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                >
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {COLUMN_DISPLAY_TITLES[status]}
                    </h3>
                    <div className="space-y-3">
                        {tasks
                            .filter((task) => task.status === status)
                            .map((task) => (
                                <TaskCard
                                    key={task.id}
                                    {...task}
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    onClick={() => onTaskClick(task.id)}
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    )
} 