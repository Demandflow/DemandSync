import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    draggable?: boolean
    onDragStart?: (e: React.DragEvent) => void
}

export function Card({ children, className = '', onClick, draggable, onDragStart }: CardProps) {
    return (
        <div
            className={`bg-white rounded-lg shadow-sm p-4 ${className}`}
            onClick={onClick}
            draggable={draggable}
            onDragStart={onDragStart}
        >
            {children}
        </div>
    )
} 