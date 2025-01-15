'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface Task {
    id: string
    title: string
    description: string
    status: 'todo' | 'in_progress' | 'in_review' | 'done'
}

interface Column {
    id: string
    title: string
    taskIds: string[]
}

interface KanbanBoardProps {
    initialTasks: Task[]
}

const columnTitles = {
    todo: 'Backlog',
    in_progress: 'Working on',
    in_review: 'Blocked',
    done: 'Complete'
}

export default function KanbanBoard({ initialTasks }: KanbanBoardProps) {
    const [tasks, setTasks] = useState<{ [key: string]: Task }>(
        initialTasks.reduce((acc, task) => ({ ...acc, [task.id]: task }), {})
    )

    const [columns, setColumns] = useState<{ [key: string]: Column }>({
        todo: {
            id: 'todo',
            title: columnTitles.todo,
            taskIds: initialTasks.filter(t => t.status === 'todo').map(t => t.id)
        },
        in_progress: {
            id: 'in_progress',
            title: columnTitles.in_progress,
            taskIds: initialTasks.filter(t => t.status === 'in_progress').map(t => t.id)
        },
        in_review: {
            id: 'in_review',
            title: columnTitles.in_review,
            taskIds: initialTasks.filter(t => t.status === 'in_review').map(t => t.id)
        },
        done: {
            id: 'done',
            title: columnTitles.done,
            taskIds: initialTasks.filter(t => t.status === 'done').map(t => t.id)
        }
    })

    const [columnOrder] = useState(['todo', 'in_progress', 'in_review', 'done'])

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result

        if (!destination) return

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        const start = columns[source.droppableId]
        const finish = columns[destination.droppableId]

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds)
            newTaskIds.splice(source.index, 1)
            newTaskIds.splice(destination.index, 0, draggableId)

            const newColumn = {
                ...start,
                taskIds: newTaskIds
            }

            setColumns({
                ...columns,
                [newColumn.id]: newColumn
            })
            return
        }

        // Moving from one list to another
        const startTaskIds = Array.from(start.taskIds)
        startTaskIds.splice(source.index, 1)
        const newStart = {
            ...start,
            taskIds: startTaskIds
        }

        const finishTaskIds = Array.from(finish.taskIds)
        finishTaskIds.splice(destination.index, 0, draggableId)
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds
        }

        // Update task status
        const updatedTask = {
            ...tasks[draggableId],
            status: destination.droppableId as Task['status']
        }

        setColumns({
            ...columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
        })

        setTasks({
            ...tasks,
            [draggableId]: updatedTask
        })
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 p-6 overflow-x-auto min-h-[calc(100vh-10rem)]">
                {columnOrder.map(columnId => {
                    const column = columns[columnId]
                    const columnTasks = column.taskIds.map(taskId => tasks[taskId])

                    return (
                        <div key={column.id} className="flex-shrink-0 w-80">
                            <div className="rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                        <h3 className="font-medium text-sm text-gray-700">
                                            {column.title}
                                        </h3>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {columnTasks.length}
                                    </span>
                                </div>
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`min-h-[8rem] transition-colors ${snapshot.isDraggingOver ? 'bg-gray-50' : ''
                                                }`}
                                        >
                                            {columnTasks.map((task, index) => (
                                                <Draggable
                                                    key={task.id}
                                                    draggableId={task.id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white p-3 mb-2 rounded border border-gray-200 hover:border-gray-300 ${snapshot.isDragging
                                                                ? 'shadow-lg'
                                                                : ''
                                                                }`}
                                                        >
                                                            <h4 className="text-sm font-medium text-gray-900">
                                                                {task.title}
                                                            </h4>
                                                            {task.description && (
                                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                                    {task.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
    )
} 