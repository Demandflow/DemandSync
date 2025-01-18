'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { TaskWithRelations } from '@/lib/task-manager';
import { X, Send, Calendar, Users, Flag } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface TaskDetailModalProps {
    taskId: string | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (taskId: string, updates: Partial<TaskWithRelations>) => Promise<void>;
}

export function TaskDetailModal({ taskId, isOpen, onClose, onUpdate }: TaskDetailModalProps) {
    const [mounted, setMounted] = useState(false);
    const [task, setTask] = useState<TaskWithRelations | null>(null);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (taskId && isOpen) {
            setLoading(true);
            fetch(`/api/tasks/${taskId}`)
                .then(res => res.json())
                .then(data => {
                    setTask(data);
                })
                .catch(error => {
                    console.error('Error fetching task:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setTask(null);
        }
    }, [taskId, isOpen]);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement comment submission
        setComment('');
    };

    const handleDescriptionChange = async (html: string) => {
        if (taskId && task) {
            await onUpdate(taskId, { ...task, description: html });
        }
    };

    if (!mounted || typeof window === 'undefined' || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="absolute inset-0 overflow-hidden">
                <div className="min-h-full flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-xl w-[65vw] shadow-2xl flex h-[60vh]">
                        {/* Main Content */}
                        <div className="w-2/3 border-r border-gray-200 flex flex-col">
                            {/* Header */}
                            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                                <h2 className="text-2xl font-display font-semibold text-gray-900">
                                    {loading ? 'Loading...' : task?.title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            {loading ? (
                                <div className="p-6 flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
                                </div>
                            ) : task ? (
                                <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                                    {/* Metadata Grid */}
                                    <div className="grid grid-cols-3 gap-6">
                                        {/* Status */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Flag className="w-4 h-4 text-gray-400" />
                                                <h3 className="text-sm font-display font-semibold text-gray-500">Status</h3>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-green-100 text-green-800">
                                                {task.status}
                                            </span>
                                        </div>

                                        {/* Assignees */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <h3 className="text-sm font-display font-semibold text-gray-500">Assignees</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {task.assignees?.map((assignee) => (
                                                    <div key={assignee.id} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-base">
                                                        {assignee.name}
                                                    </div>
                                                ))}
                                                {(!task.assignees || task.assignees.length === 0) && (
                                                    <span className="text-base text-gray-500">No assignees</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Due Date */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <h3 className="text-sm font-display font-semibold text-gray-500">Due Date</h3>
                                            </div>
                                            <span className="text-base text-gray-600">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-3 flex-grow">
                                        <h3 className="text-sm font-display font-semibold text-gray-500">Description</h3>
                                        <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
                                            <RichTextEditor
                                                content={task.description || ''}
                                                onChange={handleDescriptionChange}
                                                editable={!loading}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Comments Section */}
                        <div className="w-1/3 flex flex-col">
                            <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
                                <h3 className="font-display font-semibold">Activity</h3>
                            </div>
                            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                                {task?.comments?.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                            {comment.user?.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-display font-semibold">{comment.user?.email}</span>
                                                <span className="text-sm text-gray-500">2h ago</span>
                                            </div>
                                            <p className="text-base text-gray-700 font-regular">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 p-4 flex-shrink-0">
                                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 font-regular"
                                    />
                                    <button
                                        type="submit"
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        disabled={!comment.trim()}
                                    >
                                        <Send className="w-4 h-4 text-gray-500" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
} 