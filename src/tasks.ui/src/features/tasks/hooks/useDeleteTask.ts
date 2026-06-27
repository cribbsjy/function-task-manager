import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../api/deleteTask';
import type { Task } from '../types';

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    const queryKey = ['tasks'];

    return useMutation({
        mutationFn: deleteTask,

        onMutate: async ({ taskId }) => {
            await queryClient.cancelQueries({ queryKey });

            const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

            if (previousTasks) {
                queryClient.setQueryData<Task[]>(
                    queryKey,
                    previousTasks.filter((task) => task.id !== taskId)
                );
            }

            return { previousTasks };
        },

        onError: (err, _variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(queryKey, context.previousTasks);
            }
            console.error('Failed to delete task. Rolling back.', err);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};