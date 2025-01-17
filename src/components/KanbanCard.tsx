'use client';

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import type { TaskWithRelations } from '@/lib/task-manager';

interface KanbanCardProps {
  task: TaskWithRelations;
  index: number;
  onTaskClick?: (task: TaskWithRelations) => void;
}

export default function KanbanCard({ task, index, onTaskClick }: KanbanCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
          onClick={() => onTaskClick?.(task)}
        >
          <h3 className="card-title">{task.title}</h3>
          {task.description && (
            <div className="card-subtitle">{task.description}</div>
          )}
          <div className="card-meta">
            {task.assignees && task.assignees.length > 0 && (
              <div className="avatar-group">
                {task.assignees.map((assignee, i) => (
                  <img
                    key={i}
                    className="avatar"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.name)}&background=random`}
                    alt={assignee.name}
                    title={assignee.name}
                  />
                ))}
              </div>
            )}
            {task.dueDate && (
              <div className="date">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="subtasks">
                {task.subtasks.length} subtask{task.subtasks.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
} 