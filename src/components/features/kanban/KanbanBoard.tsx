'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult, Draggable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';
import { TaskDetailModal } from '../tasks/TaskDetailModal';
import type { TaskWithRelations, KanbanColumn } from '@/lib/task-manager';
import { COLUMN_TITLES, COLUMN_DISPLAY_TITLES } from '@/lib/task-manager';

interface KanbanBoardProps {
  tasks: TaskWithRelations[];
  onTaskMove?: (taskId: string, newStatus: KanbanColumn) => void;
  onTaskCreate?: (data: {
    title: string;
    description: string;
    status: KanbanColumn;
    organizationId: string;
  }) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<TaskWithRelations>) => Promise<void>;
}

interface NewTaskCardProps {
  onSave: (title: string) => void;
  onCancel: () => void;
}

function NewTaskCard({ onSave, onCancel }: NewTaskCardProps) {
  const [title, setTitle] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && title.trim()) {
      e.preventDefault();
      onSave(title);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px',
        cursor: 'text',
        border: '1px solid #e5e7eb'
      }}
      className="task-card hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a name..."
            className="text-sm font-medium text-gray-900 line-clamp-2 w-full bg-transparent border-0 outline-none focus:ring-0 p-0"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard({ tasks = [], onTaskMove, onTaskCreate, onTaskUpdate }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<KanbanColumn | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onTaskMove) return;

    const sourceColumn = result.source.droppableId as KanbanColumn;
    const destinationColumn = result.destination.droppableId as KanbanColumn;
    const taskId = result.draggableId;

    if (sourceColumn !== destinationColumn) {
      onTaskMove(taskId, destinationColumn);
    }
  };

  const handleAddTask = (columnId: KanbanColumn) => {
    setAddingToColumn(columnId);
  };

  const handleSaveNewTask = async (title: string) => {
    if (addingToColumn && onTaskCreate) {
      await onTaskCreate({
        title,
        description: '',
        status: addingToColumn,
        organizationId: 'cm60gyvte0000m4lbvz178mmj', // TODO: Get from context
      });
      setAddingToColumn(null);
    }
  };

  const groupedTasks = Object.values(COLUMN_TITLES).reduce<Record<KanbanColumn, TaskWithRelations[]>>(
    (acc, status) => {
      acc[status] = tasks.filter(task => task.status === status);
      return acc;
    },
    {
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    }
  );

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {Object.entries(COLUMN_DISPLAY_TITLES).map(([status, title]) => (
            <div key={status} className="kanban-column">
              <div className="kanban-column-header">
                <h2 className="column-title">{title}</h2>
                <button
                  onClick={() => handleAddTask(status as KanbanColumn)}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Add task</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="kanban-column-content"
                  >
                    {addingToColumn === status && (
                      <NewTaskCard
                        onSave={handleSaveNewTask}
                        onCancel={() => setAddingToColumn(null)}
                      />
                    )}
                    {groupedTasks[status as KanbanColumn]?.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard
                              task={task}
                              index={index}
                              onTaskClick={() => setSelectedTask(task.id)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        taskId={selectedTask}
        onUpdate={onTaskUpdate || (async () => { })}
      />
    </>
  );
} 