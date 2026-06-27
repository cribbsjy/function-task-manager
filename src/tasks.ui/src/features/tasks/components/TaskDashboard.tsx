import React, { useState } from 'react';
import TaskBoard from './TaskBoard';
import TaskModal from './TaskModal';
import type { CreateTaskRequest } from '../types';

interface TaskDashboardProps {
    onLogout: () => void;
}

export default function TaskDashboard({ onLogout }: TaskDashboardProps): React.JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleCreateTask = (data: CreateTaskRequest) => {
        console.log("Will handle with TanStack Optimistic Updates next:", data);
        setIsModalOpen(false);
    };

    return (
        <div>
            <header style={{ background: '#fff', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Task Tracker Board</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        + New Task
                    </button>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </header>

            <main>
                <TaskBoard />
            </main>

            {isModalOpen && (
                <TaskModal
                    onClose={() => setIsModalOpen(false)}
                    onCreate={handleCreateTask}
                    isSubmitting={false}
                />
            )}
        </div>
    );
}