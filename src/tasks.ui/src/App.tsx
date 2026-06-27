import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { LoginForm } from './features/auth';
import './index.css';

function MainLayout(): React.JSX.Element {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

    if (!isAuthenticated) {
        return <LoginForm onAuthSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <div>
            <header style={{ background: '#fff', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
                <h2>Task Tracker Board</h2>
                <button onClick={() => { localStorage.removeItem('token'); setIsAuthenticated(false); }}>Logout</button>
            </header>
            <main style={{ padding: '2rem' }}>
                <p>Authenticated successfully! Ready to write typed tasks domain and optimistic state managers.</p>
            </main>
        </div>
    );
}

export default function App(): React.JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <MainLayout />
        </QueryClientProvider>
    );
}