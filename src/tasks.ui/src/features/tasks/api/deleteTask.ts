import { apiClient } from '../../../config/api';

interface DeleteTaskOptions {
    taskId: string;
}

export const deleteTask = async ({ taskId }: DeleteTaskOptions): Promise<void> => {
    await apiClient.delete(`/v1/tasks/${taskId}`);
};