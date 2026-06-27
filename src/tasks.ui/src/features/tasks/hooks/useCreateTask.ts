import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/createTask';
import { type Task, type CreateTaskRequest, TaskStatus } from '../types';

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTask,

        onMutate: async (newTaskData: CreateTaskRequest) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic state
            await queryClient.cancelQueries({ queryKey: ['tasks'] });

            // Snapshot the current list of tasks so we can rollback if needed
            const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

            const optimisticTask: Task = {
                id: `temp-id-${Date.now()}`,
                title: newTaskData.title,
                description: newTaskData.description,
                status: TaskStatus.New,
                createdAt: new Date().toISOString(),
                dueDate: newTaskData.dueDate,
            };

            queryClient.setQueryData<Task[]>(['tasks'], (oldTasks) => {
                return oldTasks ? [...oldTasks, optimisticTask] : [optimisticTask];
            });

            return { previousTasks };
        },

        // Roll back to the snapshot
        onError: (err, _newTaskData, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks'], context.previousTasks);
            }
            console.error('Failed to save task.', err);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};