import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getTasks } from '../api/getTasks';
import type { Task } from '../types';

interface UseTasksOptions {
    enabled?: boolean;
}

export const useTasks = (options?: UseTasksOptions): UseQueryResult<Task[]> => {
    return useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: getTasks,
        enabled: options?.enabled,
    });
};