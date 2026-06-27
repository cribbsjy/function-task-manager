import { apiClient } from '../../../config/api';
import type { LoginRequest, AuthResponse } from '../types';

export const loginWithPassword = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
};