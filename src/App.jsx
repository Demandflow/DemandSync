import React from 'react';
import KanbanBoard from './components/KanbanBoard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="app">
      <ErrorBoundary>
        <KanbanBoard />
      </ErrorBoundary>
    </div>
  );
}

export default App; 