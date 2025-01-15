import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'

interface Comment {
    id: string
    content: string
    userId: string
    createdAt: string
    user: {
        email: string
    }
}

interface TaskDetails {
    id: string
    title: string
    description: string
    status: string
    comments: Comment[]
    createdAt: string
    updatedAt: string
}

interface TaskDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    taskId: string | null
    onUpdate: (taskId: string, updates: Partial<TaskDetails>) => Promise<void>
}

export function TaskDetailsModal({ isOpen, onClose, taskId, onUpdate }: TaskDetailsModalProps) {
    const [task, setTask] = useState<TaskDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [newComment, setNewComment] = useState('')

    useEffect(() => {
        if (taskId) {
            fetchTaskDetails()
        }
    }, [taskId])

    const fetchTaskDetails = async () => {
        if (!taskId) return
        try {
            setLoading(true)
            const response = await fetch(`/api/tasks/${taskId}`)
            const data = await response.json()
            setTask(data)
            setTitle(data.title)
            setDescription(data.description || '')
        } catch (error) {
            console.error('Error fetching task details:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!taskId || !task) return
        try {
            await onUpdate(taskId, { title, description })
            setEditing(false)
            fetchTaskDetails()
        } catch (error) {
            console.error('Error updating task:', error)
        }
    }

    const handleAddComment = async () => {
        if (!taskId || !newComment.trim()) return
        try {
            await fetch(`/api/tasks/${taskId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            })
            setNewComment('')
            fetchTaskDetails()
        } catch (error) {
            console.error('Error adding comment:', error)
        }
    }

    if (!task && !loading) return null

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden">
                    <div className="p-6 flex flex-col h-full">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <p className="text-gray-500">Loading task details...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="text-xl font-medium w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-primary-500"
                                        />
                                    ) : (
                                        <Dialog.Title className="text-xl font-medium">
                                            {task?.title}
                                        </Dialog.Title>
                                    )}
                                    <div className="flex gap-2">
                                        {editing ? (
                                            <>
                                                <button
                                                    onClick={() => setEditing(false)}
                                                    className="text-sm text-gray-600 hover:text-gray-900"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    className="text-sm text-primary-600 hover:text-primary-900"
                                                >
                                                    Save
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setEditing(true)}
                                                className="text-sm text-gray-600 hover:text-gray-900"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1 overflow-y-auto">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                                        {editing ? (
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                rows={4}
                                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-600">{task?.description || 'No description'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {task?.status}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-4">Comments</h3>
                                        <div className="space-y-4 mb-4">
                                            {task?.comments.map((comment) => (
                                                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm text-gray-600">{comment.content}</p>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(comment.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">{comment.user.email}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment..."
                                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                            />
                                            <button
                                                onClick={handleAddComment}
                                                disabled={!newComment.trim()}
                                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
} 