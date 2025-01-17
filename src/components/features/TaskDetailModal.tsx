'use client';

import React from 'react';
import type { TaskWithRelations } from '@/lib/task-manager';

interface TaskDetailModalProps {
    task: TaskWithRelations;
    isOpen: boolean;
    onClose: () => void;
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[100]"
                onClick={onClose}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            />

            {/* Modal Content */}
            <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] bg-white rounded-lg shadow-xl w-[900px] max-h-[80vh] flex overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Main content */}
                <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>

                        {/* Meta information */}
                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Status:</span>
                                <span className="capitalize">{task.status.replace('_', ' ')}</span>
                            </div>
                            {task.dueDate && (
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Due:</span>
                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Assignees */}
                        {task.assignees && task.assignees.length > 0 && (
                            <div className="mt-4">
                                <div className="text-sm font-medium text-gray-600 mb-2">Assignees</div>
                                <div className="flex items-center gap-2">
                                    {task.assignees.map((assignee) => (
                                        <div
                                            key={assignee.id}
                                            className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                                        >
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    assignee.name
                                                )}&background=random`}
                                                alt={assignee.name}
                                                className="w-5 h-5 rounded-full"
                                            />
                                            <span className="text-sm text-gray-700">{assignee.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <div className="text-sm font-medium text-gray-600 mb-2">Description</div>
                        <div className="min-h-[200px] p-4 bg-gray-50 rounded-lg">
                            {task.description || (
                                <span className="text-gray-400">No description provided</span>
                            )}
                        </div>
                    </div>

                    {/* Subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mt-6">
                            <div className="text-sm font-medium text-gray-600 mb-2">Subtasks</div>
                            <div className="space-y-2">
                                {task.subtasks.map((subtask) => (
                                    <div
                                        key={subtask.id}
                                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={subtask.completed}
                                            readOnly
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700">{subtask.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Comments sidebar */}
                <div className="w-80 p-6 bg-gray-50">
                    <div className="text-sm font-medium text-gray-600 mb-4">Comments</div>
                    <div className="space-y-4">
                        {task.comments?.map((comment) => (
                            <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-900">{comment.content}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {(!task.comments || task.comments.length === 0) && (
                            <div className="text-sm text-gray-400">No comments yet</div>
                        )}
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </>
    );
} 