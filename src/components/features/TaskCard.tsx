import React from 'react'
import { Card } from '../ui/Card'

interface TaskCardProps {
    id: string
    title: string
    description?: string
    status: string
    onDragStart?: (e: React.DragEvent) => void
    onClick?: () => void
}

export function TaskCard({ id, title, description, status, onDragStart, onClick }: TaskCardProps) {
    return (
        <Card
            draggable
            onDragStart={onDragStart}
            onClick={onClick}
            className="cursor-pointer hover:shadow-md transition-shadow duration-200"
        >
            <div className="space-y-2">
                <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {status}
                    </span>
                </div>
                {description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
                )}
            </div>
        </Card>
    )
} 