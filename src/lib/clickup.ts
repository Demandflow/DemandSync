import fetch, { RequestInit } from 'node-fetch';
import { TaskStatus } from './types';

export class ClickUpService {
    private readonly apiKey: string;
    private readonly workspaceId: string;
    private readonly fullListId = '8cnc6nx-23175';  // From the provided URL
    private readonly listId: string;

    constructor(apiKey: string, workspaceId: string) {
        // Remove pk_ prefix if it exists, we'll add it back in the request
        this.apiKey = apiKey.replace(/^pk_/, '');
        this.workspaceId = workspaceId;
        // Extract numeric part from the full list ID
        const match = this.fullListId.match(/-(\d+)$/);
        if (!match) {
            throw new Error('Invalid list ID format');
        }
        this.listId = match[1];
    }

    private async fetchFromClickUp<T>(path: string, options: RequestInit = {}): Promise<T> {
        const url = `https://api.clickup.com/api/v2${path}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': this.apiKey  // API key without pk_ prefix
        };

        console.log('Making request to:', url);
        console.log('With headers:', { ...headers, Authorization: '***' });

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers
                }
            });

            const responseText = await response.text();
            console.log('Response:', responseText);

            if (!response.ok) {
                throw new Error(`ClickUp API error: ${response.statusText}\nResponse: ${responseText}`);
            }

            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error in fetchFromClickUp:', error);
            throw error;
        }
    }

    private async getListStatuses(): Promise<any[]> {
        try {
            console.log(`Fetching statuses for list ID: ${this.listId}`);
            const response = await this.fetchFromClickUp<any>(`/list/${this.listId}`);
            if (!response.statuses) {
                throw new Error('No statuses found in the ClickUp list response');
            }
            return response.statuses;
        } catch (error) {
            console.error('Error getting list statuses:', error);
            throw error;
        }
    }

    private mapClickUpStatusToOurStatus(clickUpStatus: string): TaskStatus {
        switch (clickUpStatus.toLowerCase()) {
            case 'backlog':
                return TaskStatus.NEW;
            case 'active task':
                return TaskStatus.IN_PROGRESS;
            case 'for review':
                return TaskStatus.IN_REVIEW;
            case 'complete':
                return TaskStatus.ACCEPTED;
            default:
                console.log(`Unmapped ClickUp status: ${clickUpStatus}, defaulting to NEW`);
                return TaskStatus.NEW;
        }
    }

    private mapOurStatusToClickUpStatus(ourStatus: TaskStatus): string {
        switch (ourStatus) {
            case TaskStatus.NEW:
                return 'backlog';
            case TaskStatus.IN_PROGRESS:
                return 'active task';
            case TaskStatus.IN_REVIEW:
                return 'for review';
            case TaskStatus.ACCEPTED:
            case TaskStatus.REJECTED:
                return 'complete';
            default:
                console.log(`Unmapped app status: ${ourStatus}, defaulting to backlog`);
                return 'backlog';
        }
    }

    async syncStatusesWithClickUp(): Promise<void> {
        try {
            const statuses = await this.getListStatuses();
            console.log('\nCurrent ClickUp status mappings:');
            console.log('--------------------------------');
            for (const status of statuses) {
                const ourStatus = this.mapClickUpStatusToOurStatus(status.status);
                console.log(`ClickUp: "${status.status}" -> App: "${ourStatus}"`);
            }
            console.log('--------------------------------\n');
        } catch (error) {
            console.error('Error syncing statuses with ClickUp:', error);
            throw error;
        }
    }

    async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
        try {
            const clickUpStatus = this.mapOurStatusToClickUpStatus(status);
            console.log(`Updating task ${taskId} to status: ${clickUpStatus}`);

            await this.fetchFromClickUp<void>(`/task/${taskId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: clickUpStatus })
            });

            console.log(`Successfully updated task ${taskId} to status: ${clickUpStatus}`);
        } catch (error) {
            console.error('Error updating task status:', error);
            throw error;
        }
    }
} 