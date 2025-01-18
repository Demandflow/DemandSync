export interface ClickUpBoardMapping {
    companyId: string;
    clickupListId: string;  // ClickUp uses lists as boards
    clickupSpaceId: string; // Parent space ID
    syncConfig: {
        statuses: {
            [key: string]: string; // Map our status to ClickUp status
        };
        customFields?: {
            [key: string]: {
                fieldId: string;
                type: 'text' | 'number' | 'date' | 'dropdown';
            };
        };
    };
}

export interface ClickUpTask {
    id: string;
    name: string;
    description: string;
    status: {
        status: string;
        color: string;
    };
    list: {
        id: string;
    };
    space: {
        id: string;
    };
    customFields?: {
        id: string;
        value: any;
    }[];
    assignees: {
        id: string;
        username: string;
        email: string;
        profilePicture?: string;
    }[];
    dueDate?: string | null;
    priority?: {
        priority: string;
        color: string;
    };
    parent?: string | null;
    subtasks?: ClickUpTask[];
    comments?: {
        id: string;
        comment: string;
        user: {
            id: string;
            username: string;
            email: string;
        };
        dateCreated: string;
    }[];
}

export interface SyncedTask {
    id: string;
    clickupId: string;
    companyId: string;
    organizationId: string;  // Added for compatibility with the app's organization structure
    name: string;
    description: string;
    status: string;
    assignees: string[];
    dueDate?: string;
    priority?: string;
    customFields?: Record<string, any>;
    parentId?: string;
    lastSyncedAt: string;
} 