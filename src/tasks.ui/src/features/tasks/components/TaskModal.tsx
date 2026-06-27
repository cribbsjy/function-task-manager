import React, { useState, type FormEvent } from 'react';
import type { CreateTaskRequest } from '../types';

interface TaskModalProps {
    onClose: () => void;
    onCreate: (taskData: CreateTaskRequest) => void;
    isSubmitting: boolean;
}

export default function TaskModal({ onClose, onCreate, isSubmitting }: TaskModalProps): React.JSX.Element {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        onCreate({
            title,
            description,
            dueDate,
        });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3 style={{ marginTop: 0 }}>Create New Task</h3>
                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />

                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />

                    <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Due Date</label>
                    <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                        <button type="button" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}