import React from 'react';
import KanbanBoard from './components/KanbanBoard';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
    return (
        <div className="app">
            <ErrorBoundary>
                <KanbanBoard />
            </ErrorBoundary>
        </div>
    );
}

export default App; 