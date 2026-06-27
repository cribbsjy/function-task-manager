import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { loginWithPassword } from '../api/login';
import type { LoginRequest, AuthResponse, AuthAxiosError } from '../types';

interface UseLoginOptions {
    onSuccess?: (data: AuthResponse) => void;
    onError?: (error: AuthAxiosError) => void;
}

export const useLogin = (options?: UseLoginOptions): UseMutationResult<AuthResponse, AuthAxiosError, LoginRequest> => {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, AuthAxiosError, LoginRequest>({
        mutationFn: loginWithPassword,
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);

            // Update global auth status or invalidate queries
            queryClient.setQueryData(['auth_status'], { isAuthenticated: true });
            queryClient.invalidateQueries();

            if (options?.onSuccess) options.onSuccess(data);
        },
        onError: (error) => {
            if (options?.onError) options.onError(error);
        }
    });
};