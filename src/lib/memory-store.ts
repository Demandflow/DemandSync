// Temporary in-memory store for development
interface Task {
    id: string
    title: string
    description?: string
    status: string
    organizationId: string
    clickupTaskId: string
    createdAt: string
    updatedAt: string
    comments: Array<{
        id: string
        content: string
        userId: string
        createdAt: string
        user: {
            email: string
        }
    }>
}

class MemoryStore {
    private tasks: Map<string, Task> = new Map()

    async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) {
        const id = Math.random().toString(36).substring(7)
        const now = new Date().toISOString()
        const newTask: Task = {
            ...task,
            id,
            createdAt: now,
            updatedAt: now,
            comments: []
        }
        this.tasks.set(id, newTask)
        return newTask
    }

    async getTask(id: string) {
        return this.tasks.get(id)
    }

    async getTasks(organizationId: string) {
        return Array.from(this.tasks.values())
            .filter(task => task.organizationId === organizationId)
    }

    async updateTask(id: string, updates: Partial<Task>) {
        const task = this.tasks.get(id)
        if (!task) return null

        const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString()
        }
        this.tasks.set(id, updatedTask)
        return updatedTask
    }

    async addComment(taskId: string, comment: { content: string; userId: string; userEmail: string }) {
        const task = this.tasks.get(taskId)
        if (!task) return null

        const commentId = Math.random().toString(36).substring(7)
        const newComment = {
            id: commentId,
            content: comment.content,
            userId: comment.userId,
            createdAt: new Date().toISOString(),
            user: {
                email: comment.userEmail
            }
        }

        task.comments.push(newComment)
        this.tasks.set(taskId, task)
        return newComment
    }
}

export const store = new MemoryStore()

// Add some sample data
store.createTask({
    title: 'Set up authentication',
    description: 'Implement Clerk authentication and protect routes',
    status: 'in_progress',
    organizationId: 'org_123',
    clickupTaskId: 'click_123'
})

store.createTask({
    title: 'Create Kanban board',
    description: 'Build drag and drop interface for task management',
    status: 'done',
    organizationId: 'org_123',
    clickupTaskId: 'click_456'
})

store.createTask({
    title: 'Implement real-time updates',
    description: 'Add Socket.io for live task updates',
    status: 'todo',
    organizationId: 'org_123',
    clickupTaskId: 'click_789'
}) 