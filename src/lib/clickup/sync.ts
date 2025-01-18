import { ClickUpClient } from './client';
import { ClickUpBoardMapping, ClickUpTask, SyncedTask } from './types';
import { store } from '../memory-store';
import { io } from '../socket';

export class ClickUpSync {
    private client: ClickUpClient;
    private boardMappings: Map<string, ClickUpBoardMapping>;

    constructor(apiKey: string) {
        this.client = new ClickUpClient(apiKey);
        this.boardMappings = new Map();
    }

    // Board mapping management
    async addBoardMapping(mapping: ClickUpBoardMapping) {
        this.boardMappings.set(mapping.companyId, mapping);

        // Set up webhook for this board
        await this.client.createWebhook(mapping.clickupSpaceId,
            `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/clickup`,
            ['taskCreated', 'taskUpdated', 'taskDeleted', 'taskStatusUpdated', 'taskAssigneeUpdated', 'taskDueDateUpdated', 'taskCommentPosted']
        );
    }

    getBoardMapping(companyId: string) {
        return this.boardMappings.get(companyId);
    }

    // Task synchronization
    private mapToClickUpTask(task: SyncedTask, mapping: ClickUpBoardMapping): Partial<ClickUpTask> {
        return {
            name: task.name,
            description: task.description,
            status: {
                status: mapping.syncConfig.statuses[task.status] || task.status,
                color: '#000000'
            },
            assignees: task.assignees,
            dueDate: task.dueDate,
            priority: task.priority ? { priority: task.priority, color: '#000000' } : undefined,
            customFields: Object.entries(task.customFields || {}).map(([key, value]) => ({
                id: mapping.syncConfig.customFields?.[key]?.fieldId || '',
                value
            }))
        };
    }

    private mapFromClickUpTask(clickupTask: ClickUpTask, mapping: ClickUpBoardMapping): Partial<SyncedTask> {
        // Reverse map the status
        const status = Object.entries(mapping.syncConfig.statuses)
            .find(([_, clickupStatus]) => clickupStatus === clickupTask.status.status)?.[0]
            || clickupTask.status.status;

        // Map custom fields back
        const customFields: Record<string, any> = {};
        clickupTask.customFields?.forEach(field => {
            const [key] = Object.entries(mapping.syncConfig.customFields || {})
                .find(([_, config]) => config.fieldId === field.id) || [];
            if (key) {
                customFields[key] = field.value;
            }
        });

        return {
            name: clickupTask.name,
            description: clickupTask.description,
            status,
            assignees: clickupTask.assignees.map(a => a.id),
            dueDate: clickupTask.dueDate,
            priority: clickupTask.priority?.priority,
            customFields,
            lastSyncedAt: new Date().toISOString()
        };
    }

    // Push updates to ClickUp
    async pushTaskToClickUp(task: SyncedTask) {
        const mapping = this.getBoardMapping(task.companyId);
        if (!mapping) throw new Error('Board mapping not found');

        const clickupTask = this.mapToClickUpTask(task, mapping);

        if (task.clickupId) {
            // Update existing task
            await this.client.updateTask(task.clickupId, clickupTask);
        } else {
            // Create new task
            const created = await this.client.createTask(mapping.clickupListId, clickupTask);
            await store.updateTask(task.id, {
                clickupId: created.id,
                lastSyncedAt: new Date().toISOString()
            });
        }
    }

    // Pull updates from ClickUp
    async pullTaskFromClickUp(clickupTaskId: string, companyId: string) {
        const mapping = this.getBoardMapping(companyId);
        if (!mapping) throw new Error('Board mapping not found');

        const clickupTask = await this.client.getTask(clickupTaskId);
        const updates = this.mapFromClickUpTask(clickupTask, mapping);

        // Find our task by ClickUp ID
        const task = await store.findTaskByClickUpId(clickupTaskId);
        if (task) {
            await store.updateTask(task.id, updates);
            io.emit('task:update', { id: task.id, ...updates });
        }
    }

    // Initial sync
    async syncBoard(companyId: string) {
        const mapping = this.getBoardMapping(companyId);
        if (!mapping) throw new Error('Board mapping not found');

        const clickupTasks = await this.client.getListTasks(mapping.clickupListId);

        for (const clickupTask of clickupTasks) {
            const task = await store.findTaskByClickUpId(clickupTask.id);
            const updates = this.mapFromClickUpTask(clickupTask, mapping);

            if (task) {
                await store.updateTask(task.id, updates);
            } else {
                await store.createTask({
                    ...updates as SyncedTask,
                    id: crypto.randomUUID(),
                    clickupId: clickupTask.id,
                    companyId
                });
            }
        }
    }
} 