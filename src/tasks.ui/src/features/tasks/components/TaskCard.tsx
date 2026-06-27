import React, { useState, type FormEvent } from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { useDeleteTask } from '../hooks/useDeleteTask';

interface TaskCardProps {
    task: Task;
}

interface FormErrors {
    title?: string;
    description?: string;
    dueDate?: string;
}

export default function TaskCard({ task }: TaskCardProps): React.JSX.Element {
    const { mutate: updateTaskMutation } = useUpdateTask();
    const { mutate: deleteTaskMutation } = useDeleteTask();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editTitle, setEditTitle] = useState<string>(task.title);
    const [editDescription, setEditDescription] = useState<string>(task.description);
    const [editDueDate, setEditDueDate] = useState<string>(task.dueDate);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

    const todayString = new Date().toISOString().split('T')[0];

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextStatus = Number(e.target.value) as TaskStatus;
        updateTaskMutation({
            task: { ...task, status: nextStatus }
        });
    };

    const handleSaveAllEdits = (e: FormEvent) => {
        e.preventDefault();
        const errors: FormErrors = {};

        if (!editTitle.trim()) {
            errors.title = "Title is required.";
        } else if (editTitle.length > 100) {
            errors.title = "Title cannot exceed 100 characters.";
        }

        if (!editDescription.trim()) {
            errors.description = "Description is required.";
        } else if (editDescription.length > 500) {
            errors.description = "Description cannot exceed 500 characters.";
        }

        if (!editDueDate) {
            errors.dueDate = "Due date is required.";
        } else if (editDueDate < todayString) {
            errors.dueDate = "Due date cannot be in the past.";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});

        updateTaskMutation({
            task: {
                ...task,
                title: editTitle.trim(),
                description: editDescription.trim(),
                dueDate: editDueDate
            }
        }, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    const handleCancelEdits = () => {
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditDueDate(task.dueDate);
        setFieldErrors({});
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
            deleteTaskMutation({ taskId: task.id });
        }
    };

    const errorTextStyle = { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' };

    if (isEditing) {
        return (
            <div className="task-card edit-mode" style={{ border: '1px solid var(--primary)' }}>
                <form onSubmit={handleSaveAllEdits} noValidate>

                    <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                            Title ({editTitle.length}/100)
                        </label>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            style={{ width: '100%', fontSize: '0.95rem', padding: '4px', borderColor: fieldErrors.title ? '#ef4444' : undefined }}
                        />
                        {fieldErrors.title && <span style={errorTextStyle}>{fieldErrors.title}</span>}
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                            Description ({editDescription.length}/500)
                        </label>
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            style={{ width: '100%', minHeight: '60px', fontSize: '0.9rem', padding: '4px', borderColor: fieldErrors.description ? '#ef4444' : undefined }}
                        />
                        {fieldErrors.description && <span style={errorTextStyle}>{fieldErrors.description}</span>}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            style={{ width: '100%', padding: '4px', fontSize: '0.9rem', borderColor: fieldErrors.dueDate ? '#ef4444' : undefined }}
                        />
                        {fieldErrors.dueDate && <span style={errorTextStyle}>{fieldErrors.dueDate}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={handleCancelEdits} style={{ padding: '2px 8px', fontSize: '0.8rem' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" style={{ padding: '2px 8px', fontSize: '0.8rem' }}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="task-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h4>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{ padding: '2px 6px', fontSize: '0.8rem', cursor: 'pointer', background: 'none', border: '1px solid var(--border)' }}
                        title="Edit task text and date"
                    >
                        ✏️
                    </button>
                    <button
                        className="btn-danger"
                        onClick={handleDeleteClick}
                        style={{ padding: '2px 6px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
                {task.description}
            </p>

            <small style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                📅 Due: {new Date(`${task.dueDate}T00:00:00Z`).toLocaleDateString()}
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