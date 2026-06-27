import { apiClient } from '../../../config/api';
import type { Task } from '../types';

export const getTasks = async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data;
};