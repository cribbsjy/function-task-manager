import { apiClient } from '../../../config/api';
import type { Task } from '../types';

interface UpdateTaskOptions {
    task: Task;
}

export const updateTask = async ({ task }: UpdateTaskOptions): Promise<Task> => {
    const response = await apiClient.put<Task>(`/v1/tasks/${task.id}`, task);
    return response.data;
};