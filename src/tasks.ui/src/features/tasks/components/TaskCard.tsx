import React from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { useDeleteTask } from '../hooks/useDeleteTask';

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps): React.JSX.Element {
    const { mutate: updateTaskMutation } = useUpdateTask();
    const { mutate: deleteTaskMutation } = useDeleteTask();

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextStatus = Number(e.target.value) as TaskStatus;

        const fullUpdatedTask: Task = {
            ...task,
            status: nextStatus
        };

        updateTaskMutation({ task: fullUpdatedTask });
    };

    const handleDeleteClick = () => {
        if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
            deleteTaskMutation({ taskId: task.id });
        }
    };

    return (
        <div className="task-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h4>
                <button
                    className="btn-danger"
                    onClick={handleDeleteClick}
                    style={{ padding: '2px 6px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    🗑️
                </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
                {task.description}
            </p>

            <small style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                📅 Due: {new Date(task.dueDate).toLocaleDateString()}
            </small>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status:</label>
                <select
                    value={task.status}
                    onChange={handleStatusChange}
                    style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    <option value={TaskStatus.New}>New</option>
                    <option value={TaskStatus.InProgress}>In Progress</option>
                    <option value={TaskStatus.Completed}>Completed</option>
                </select>
            </div>
        </div>
    );
}