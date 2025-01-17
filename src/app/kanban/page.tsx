'use client';

import KanbanBoard from '@/components/KanbanBoard';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function KanbanPage() {
    return (
        <div className="app">
            <ErrorBoundary>
                <KanbanBoard />
            </ErrorBoundary>
        </div>
    );
} 