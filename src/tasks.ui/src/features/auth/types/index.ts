import { AxiosError } from 'axios';

export interface LoginRequest {
    username: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
}

export interface ApiErrorResponse {
    message?: string;
}

export type AuthAxiosError = AxiosError<ApiErrorResponse>;