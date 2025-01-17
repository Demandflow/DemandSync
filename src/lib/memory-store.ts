import { TaskWithRelations, KanbanColumn } from './task-manager'

class MemoryStore {
    private tasks: Map<string, TaskWithRelations> = new Map()

    constructor() {
        // Add some mock data
        const mockTasks: TaskWithRelations[] = [
            {
                id: '1',
                title: 'GradientFlow Quality of Life Updates',
                description: 'Implement quality of life improvements for GradientFlow',
                status: 'todo',
                organizationId: 'cm60gyvte0000m4lbvz178mmj',
                createdAt: new Date(),
                updatedAt: new Date(),
                assignees: [
                    { id: 'user1', name: 'John Doe', email: 'john@example.com' },
                    { id: 'user2', name: 'Jane Smith', email: 'jane@example.com' }
                ],
                subtasks: [
                    { id: 'sub1', title: 'Update UI', completed: false },
                    { id: 'sub2', title: 'Improve performance', completed: false }
                ],
                dueDate: new Date('2024-03-15')
            },
            {
                id: '2',
                title: 'Setup Design Files',
                description: 'Create and organize design files for the project',
                status: 'todo',
                organizationId: 'cm60gyvte0000m4lbvz178mmj',
                createdAt: new Date(),
                updatedAt: new Date(),
                assignees: [
                    { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com' }
                ],
                subtasks: [
                    { id: 'sub3', title: 'Create style guide', completed: false },
                    { id: 'sub4', title: 'Design components', completed: false }
                ]
            },
            {
                id: '3',
                title: 'Cursor Tool Development',
                description: 'Develop new features for the cursor tool',
                status: 'todo',
                organizationId: 'cm60gyvte0000m4lbvz178mmj',
                createdAt: new Date(),
                updatedAt: new Date(),
                assignees: [
                    { id: 'user1', name: 'John Doe', email: 'john@example.com' },
                    { id: 'user4', name: 'Sarah Wilson', email: 'sarah@example.com' }
                ]
            }
        ]

        mockTasks.forEach(task => {
            this.tasks.set(task.id, task)
        })
    }

    async getTasks(organizationId: string): Promise<TaskWithRelations[]> {
        return Array.from(this.tasks.values())
            .filter(task => task.organizationId === organizationId)
    }

    async getTask(taskId: string): Promise<TaskWithRelations | null> {
        return this.tasks.get(taskId) || null
    }

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
            updatedAt: new Date()
        }

        this.tasks.set(task.id, task)
        return task
    }

    async updateTask(taskId: string, updates: Partial<TaskWithRelations>): Promise<TaskWithRelations | null> {
        const task = this.tasks.get(taskId)
        if (!task) return null

        const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date()
        }

        this.tasks.set(taskId, updatedTask)
        return updatedTask
    }

    async deleteTask(taskId: string): Promise<boolean> {
        return this.tasks.delete(taskId)
    }
}

export const store = new MemoryStore() 