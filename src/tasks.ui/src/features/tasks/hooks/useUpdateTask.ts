import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../api/updateTask';
import type { Task } from '../types';

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    const queryKey = ['tasks'];

    return useMutation({
        mutationFn: updateTask,

        onMutate: async ({ task: updatedTask }) => {
            await queryClient.cancelQueries({ queryKey });

            const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

            if (previousTasks) {
                queryClient.setQueryData<Task[]>(
                    queryKey,
                    previousTasks.map((task) =>
                        task.id === updatedTask.id ? updatedTask : task
                    )
                );
            }

            return { previousTasks };
        },

        onError: (err, _variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(queryKey, context.previousTasks);
            }
            console.error('Failed to update task.', err);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
};