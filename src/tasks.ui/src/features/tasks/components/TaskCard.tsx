import React from 'react';
import type { Task } from '../types';

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps): React.JSX.Element {
    return (
        <div className="task-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h4>
                <button className="btn-danger" style={{ padding: '2px 6px', fontSize: '0.8rem' }}>
                    🗑️
                </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
                {task.description}
            </p>
            {task.dueDate && (
                <small style={{ display: 'block', color: 'var(--text-muted)' }}>
                    📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                </small>
            )}
            <button style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                Edit Task
            </button>
        </div>
    );
}