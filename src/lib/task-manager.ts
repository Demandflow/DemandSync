import { type JsonValue } from '@prisma/client/runtime/library'

export type KanbanColumn = 'todo' | 'in_progress' | 'in_review' | 'done'

export interface Assignee {
    id: string;
    name: string;
    email: string;
}

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Comment {
    id: string;
    content: string;
    userId: string;
    createdAt: Date;
    user?: {
        email: string;
    };
}

export type TaskWithRelations = {
    id: string;
    title: string;
    description: string | null;
    status: KanbanColumn;
    organizationId: string;
    clickupTaskId?: string;
    customFields?: JsonValue;
    createdAt: Date;
    updatedAt: Date;
    assignees?: Assignee[];
    subtasks?: Subtask[];
    dueDate?: Date;
    comments?: Comment[];
};

export async function getTasks(organizationId: string): Promise<TaskWithRelations[]> {
    try {
        const response = await fetch(`/api/tasks?organizationId=${organizationId}`)
        if (!response.ok) {
            throw new Error('Failed to fetch tasks')
        }
        return response.json()
    } catch (error) {
        console.error('Error in getTasks:', error)
        throw error
    }
}

export async function updateTaskStatus(taskId: string, status: KanbanColumn): Promise<TaskWithRelations> {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        })
        if (!response.ok) {
            throw new Error('Failed to update task status')
        }
        return response.json()
    } catch (error) {
        console.error('Error in updateTaskStatus:', error)
        throw error
    }
}

export async function createTask(data: {
    title: string;
    description?: string;
    status: KanbanColumn;
    organizationId: string;
}): Promise<TaskWithRelations> {
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            throw new Error('Failed to create task')
        }
        return response.json()
    } catch (error) {
        console.error('Error in createTask:', error)
        throw error
    }
}

export async function updateTask(taskId: string, updates: Partial<TaskWithRelations>): Promise<TaskWithRelations> {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        })
        if (!response.ok) {
            throw new Error('Failed to update task')
        }
        return response.json()
    } catch (error) {
        console.error('Error in updateTask:', error)
        throw error
    }
}

export function groupTasksByStatus(tasks: TaskWithRelations[]): Record<KanbanColumn, TaskWithRelations[]> {
    const columns: Record<KanbanColumn, TaskWithRelations[]> = {
        todo: [],
        in_progress: [],
        in_review: [],
        done: [],
    }

    tasks.forEach(task => {
        if (task.status in columns) {
            columns[task.status].push(task)
        }
    })

    return columns
}

export const COLUMN_TITLES: Record<string, KanbanColumn> = {
    'TO DO': 'todo',
    'WORKING ON': 'in_progress',
    'FOR REVIEW': 'in_review',
    'COMPLETE': 'done',
} as const;

export const COLUMN_DISPLAY_TITLES: Record<KanbanColumn, string> = {
    todo: 'TO DO',
    in_progress: 'WORKING ON',
    in_review: 'FOR REVIEW',
    done: 'COMPLETE',
} as const; 