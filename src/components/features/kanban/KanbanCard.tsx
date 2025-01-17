'use client';

import React from 'react';
import type { TaskWithRelations } from '@/lib/task-manager';

interface KanbanCardProps {
  task: TaskWithRelations;
  index: number;
  onTaskClick?: (task: TaskWithRelations) => void;
}

export default function KanbanCard({ task, index, onTaskClick }: KanbanCardProps) {
  return (
    <div
      onClick={() => onTaskClick?.(task)}
      className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-3 mb-2 cursor-pointer hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-shadow duration-200"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</h3>
          {task.assignees && task.assignees.length > 0 && (
            <div className="flex -space-x-1">
              {task.assignees.map((assignee) => (
                <div
                  key={assignee.id}
                  className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center"
                  title={assignee.name}
                >
                  <span className="text-xs font-medium text-blue-800">
                    {assignee.name.charAt(0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 