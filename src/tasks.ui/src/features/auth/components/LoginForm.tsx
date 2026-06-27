import React, { useState, type FormEvent } from 'react';
import { useLogin } from '../hooks/useAuth';
import type { AuthAxiosError } from '../types';

interface LoginFormProps {
    onAuthSuccess: () => void;
}

export default function LoginForm({ onAuthSuccess }: LoginFormProps): React.JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const loginMutation = useLogin({
        onSuccess: () => {
            onAuthSuccess();
        },
        onError: (err: AuthAxiosError) => {
            const serverMessage = err.response?.data?.message || 'Invalid username or password.';
            setErrorMessage(serverMessage);
        }
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setErrorMessage('');

        loginMutation.mutate({ username, password });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '120px auto', padding: '2.5rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>Sign In</h2>
            <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Enter credentials to access your tasks dashboard</p>

            {errorMessage && (
                <div style={{ background: '#fff5f5', color: '#e53e3e', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', borderLeft: '4px solid #e53e3e' }}>
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        disabled={loginMutation.isPending}
                        required
                        placeholder="e.g., UserA"
                    />
                </div>

                <div style={{ marginBottom: '1.75rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={loginMutation.isPending}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}