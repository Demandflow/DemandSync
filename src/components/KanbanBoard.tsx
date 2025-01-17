'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import KanbanCard from './KanbanCard';
import { TaskDetailModal } from './features/TaskDetailModal';
import type { TaskWithRelations, KanbanColumn } from '@/lib/task-manager';

interface KanbanBoardProps {
  tasks: TaskWithRelations[];
  onTaskMove?: (taskId: string, newStatus: KanbanColumn) => void;
  onTaskCreate?: (data: {
    title: string;
    description: string;
    status: KanbanColumn;
    organizationId: string;
  }) => void;
}

const COLUMN_TITLES = {
  'TO DO': 'todo' as const,
  'WORKING ON': 'in_progress' as const,
  'FOR REVIEW': 'in_review' as const,
  'COMPLETE': 'done' as const,
};

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
    <div className="kanban-card">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a name..."
        className="w-full bg-transparent border-none outline-none text-sm"
        autoFocus
      />
    </div>
  );
}

export default function KanbanBoard({ tasks, onTaskMove, onTaskCreate }: KanbanBoardProps) {
  const [addingInColumn, setAddingInColumn] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null);

  // Group tasks by status
  const columns = {
    'TO DO': tasks.filter(task => task.status === 'todo' || !task.status),
    'WORKING ON': tasks.filter(task => task.status === 'in_progress'),
    'FOR REVIEW': tasks.filter(task => task.status === 'in_review'),
    'COMPLETE': tasks.filter(task => task.status === 'done')
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)) {
      return;
    }

    const newStatus = COLUMN_TITLES[destination.droppableId as keyof typeof COLUMN_TITLES];
    console.log('Moving task:', { draggableId, newStatus, source, destination });

    if (onTaskMove) {
      onTaskMove(draggableId, newStatus);
    }
  };

  const handleAddTask = (columnTitle: string) => {
    setAddingInColumn(columnTitle);
  };

  const handleSaveNewTask = (columnTitle: string, title: string) => {
    if (onTaskCreate) {
      onTaskCreate({
        title,
        description: '',
        status: COLUMN_TITLES[columnTitle as keyof typeof COLUMN_TITLES],
        organizationId: 'cm60gyvte0000m4lbvz178mmj', // Using the mock org ID
      });
    }
    setAddingInColumn(null);
  };

  const handleTaskClick = (task: TaskWithRelations) => {
    setSelectedTask(task);
  };

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {Object.entries(columns).map(([columnTitle, columnTasks]) => (
            <div key={columnTitle} className={`kanban-column column-${columnTitle.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="kanban-column-header">
                <span className="column-title">{columnTitle}</span>
                <span className="task-count">{columnTasks.length}</span>
              </div>

              <Droppable droppableId={columnTitle}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-cards ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    {columnTasks.map((task, index) => (
                      <KanbanCard
                        key={task.id}
                        task={task}
                        index={index}
                        onTaskClick={handleTaskClick}
                      />
                    ))}
                    {addingInColumn === columnTitle && (
                      <NewTaskCard
                        onSave={(title) => handleSaveNewTask(columnTitle, title)}
                        onCancel={() => setAddingInColumn(null)}
                      />
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button
                className="add-task-button"
                onClick={() => handleAddTask(columnTitle)}
              >
                + Add Task
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskDetailModal
        task={selectedTask!}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
} 