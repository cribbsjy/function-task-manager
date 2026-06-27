import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { LoginForm } from './features/auth';
import { TaskDashboard } from './features/tasks';
import './index.css';

function MainLayout(): React.JSX.Element {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <LoginForm onAuthSuccess={() => setIsAuthenticated(true)} />;
    }

    return <TaskDashboard onLogout={handleLogout} />;
}

export default function App(): React.JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <MainLayout />
        </QueryClientProvider>
    );
}