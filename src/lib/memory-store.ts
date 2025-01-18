import { TaskWithRelations, KanbanColumn } from './task-manager';

class MemoryStore {
    private tasks: Map<string, TaskWithRelations>;
    private clickupIdIndex: Map<string, string>;

    constructor() {
        this.tasks = new Map();
        this.clickupIdIndex = new Map();
    }

    // Create a new task
    async createTask(data: {
        title: string;
        description?: string;
        status: KanbanColumn;
        organizationId: string;
    }): Promise<TaskWithRelations> {
        const task: TaskWithRelations = {
            id: Math.random().toString(36).substring(7),
            title: data.title,
            description: data.description || null,
            status: data.status,
            organizationId: data.organizationId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.tasks.set(task.id, task);
        return task;
    }

    // Update an existing task
    async updateTask(id: string, updates: Partial<TaskWithRelations>): Promise<TaskWithRelations> {
        const task = this.tasks.get(id);
        if (!task) throw new Error('Task not found');

        const updated = {
            ...task,
            ...updates,
            updatedAt: new Date()
        };
        this.tasks.set(id, updated);

        // Update clickup ID index if it changed
        if (updates.clickupTaskId && updates.clickupTaskId !== task.clickupTaskId) {
            if (task.clickupTaskId) {
                this.clickupIdIndex.delete(task.clickupTaskId);
            }
            this.clickupIdIndex.set(updates.clickupTaskId, id);
        }

        return updated;
    }

    // Delete a task
    async deleteTask(id: string) {
        const task = this.tasks.get(id);
        if (!task) return;

        this.tasks.delete(id);
        if (task.clickupTaskId) {
            this.clickupIdIndex.delete(task.clickupTaskId);
        }
    }

    // Get a task by ID
    async getTask(id: string): Promise<TaskWithRelations | undefined> {
        return this.tasks.get(id);
    }

    // Get all tasks, optionally filtered by organization ID
    async getTasks(organizationId?: string): Promise<TaskWithRelations[]> {
        const tasks = Array.from(this.tasks.values());
        if (organizationId) {
            return tasks.filter(task => task.organizationId === organizationId);
        }
        return tasks;
    }

    // Find a task by ClickUp ID
    async findTaskByClickUpId(clickupId: string): Promise<TaskWithRelations | null> {
        const id = this.clickupIdIndex.get(clickupId);
        if (!id) return null;
        return this.tasks.get(id) || null;
    }
}

export const store = new MemoryStore(); 