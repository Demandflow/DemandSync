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
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px',
        cursor: 'grab',
        border: '1px solid #e5e7eb',
        userSelect: 'none'
      }}
      className="task-card hover:bg-gray-50 transition-all duration-200"
      onClick={() => onTaskClick?.(task)}
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
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          )}
          {task.subtasks && task.subtasks.length > 0 && (
            <span>
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 