import { apiClient } from '../../../config/api';
import type { Task, CreateTaskRequest } from '../types';

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
    const response = await apiClient.post<Task>('/v1/tasks', data);
    return response.data;
};