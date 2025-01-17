'use client';

import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './KanbanCard';

interface Task {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  subtasks: string;
  assignees: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export default function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  return (
    <div className={`kanban-column column-${column.id}`}>
      <div className="kanban-column-header">
        <span className="column-title">{column.title}</span>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="kanban-cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <KanbanCard 
                key={task.id}
                task={task}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      <button className="add-task-button">+ Add Task</button>
    </div>
  );
} 