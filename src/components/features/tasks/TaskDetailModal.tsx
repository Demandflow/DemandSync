'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { TaskWithRelations } from '@/lib/task-manager';
import { Calendar, Clock, Plus, MoreHorizontal, Search, X, Star, Maximize2, Send } from 'lucide-react';

interface TaskDetailModalProps {
    taskId: string | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (taskId: string, updates: Partial<TaskWithRelations>) => Promise<void>;
}

export function TaskDetailModal({ taskId, isOpen, onClose, onUpdate }: TaskDetailModalProps) {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [task, setTask] = useState<TaskWithRelations | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (taskId && isOpen) {
            fetchTaskDetails();
        }
    }, [taskId, isOpen]);

    const fetchTaskDetails = async () => {
        if (!taskId) return;
        try {
            setLoading(true);
            const response = await fetch(`/api/tasks/${taskId}`);
            const data = await response.json();
            setTask(data);
        } catch (error) {
            console.error('Error fetching task details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-6xl max-h-[90vh] flex flex-col">
                {/* Top Navigation Bar */}
                <nav className="border-b px-4 py-2 flex items-center justify-between rounded-t-lg">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm">Task Board</span>
                        <span className="text-sm text-gray-500">Task Details</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="px-3 py-1 bg-emerald-500 text-white rounded-md text-sm">Share</button>
                        <div className="flex items-center space-x-2">
                            <Star className="text-gray-500" size={16} />
                            <Maximize2 className="text-gray-500" size={16} />
                            <button onClick={onClose}>
                                <X className="text-gray-500" size={16} />
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <div className="flex flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex-1 p-6 flex items-center justify-center">
                            <p className="text-gray-500">Loading task details...</p>
                        </div>
                    ) : task ? (
                        /* Left Side - Task Details */
                        <div className="flex-1 p-6 overflow-y-auto">
                            <div className="flex items-center space-x-2 mb-6">
                                <h1 className="text-xl font-semibold">{task.title}</h1>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600">{task.description || 'No description provided.'}</p>
                                </div>
                                {task.assignees && task.assignees.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">Assignees</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {task.assignees.map(assignee => (
                                                <span
                                                    key={assignee.id}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {assignee.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {task.comments && task.comments.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">Comments</h3>
                                        <div className="space-y-4">
                                            {task.comments.map(comment => (
                                                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-sm text-gray-600">{comment.content}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 p-6 flex items-center justify-center">
                            <p className="text-gray-500">Task not found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
} 