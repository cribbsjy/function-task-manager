import React from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from './TaskCard';
import { TaskStatus } from '../types';

export default function TaskBoard(): React.JSX.Element {
    const { data: tasks, isLoading, isError, error } = useTasks();

    if (isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading tasks...</div>;
    }

    if (isError) {
        return (
            <div style={{ padding: '2rem', color: 'var(--danger)', textAlign: 'center' }}>
                Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
        );
    }

    const columns = [
        { title: 'New', status: TaskStatus.New },
        { title: 'In Progress', status: TaskStatus.InProgress },
        { title: 'Completed', status: TaskStatus.Completed }
    ];

    return (
        <div className="kanban-board">
            {columns.map((col) => {
                const columnTasks = tasks?.filter((t) => t.status === col.status) || [];

                return (
                    <div key={col.status} className="swimlane">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>{col.title}</h3>
                            <span style={{ background: 'var(--border)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem' }}>
                                {columnTasks.length}
                            </span>
                        </div>
                        <hr style={{ border: 'none', height: '1px', background: 'var(--border)', margin: '1rem 0' }} />

                        <div>
                            {columnTasks.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                            {columnTasks.length === 0 && (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2rem' }}>
                                    No tasks here
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}