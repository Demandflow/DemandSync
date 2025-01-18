export enum TaskStatus {
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
    IN_REVIEW = 'IN_REVIEW',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}

export interface ClickUpStatus {
    id: string;
    status: string;
    type: string;
    orderindex: number;
    color: string;
} 