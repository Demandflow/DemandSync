const CLICKUP_API_BASE = 'https://api.clickup.com/api/v2'

export class ClickUpClient {
    private apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    private async fetch(endpoint: string, options: RequestInit = {}) {
        const response = await fetch(`${CLICKUP_API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': this.apiKey,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        })

        if (!response.ok) {
            throw new Error(`ClickUp API error: ${response.statusText}`)
        }

        return response.json()
    }

    async getWorkspaceTasks(workspaceId: string) {
        return this.fetch(`/team/${workspaceId}/task`)
    }

    async getTask(taskId: string) {
        return this.fetch(`/task/${taskId}`)
    }

    async createTask(listId: string, task: {
        name: string
        description?: string
        status?: string
        customFields?: Record<string, any>
    }) {
        return this.fetch(`/list/${listId}/task`, {
            method: 'POST',
            body: JSON.stringify(task),
        })
    }

    async updateTask(taskId: string, updates: {
        name?: string
        description?: string
        status?: string
        customFields?: Record<string, any>
    }) {
        return this.fetch(`/task/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        })
    }

    async createComment(taskId: string, comment: string) {
        return this.fetch(`/task/${taskId}/comment`, {
            method: 'POST',
            body: JSON.stringify({ comment_text: comment }),
        })
    }
} 