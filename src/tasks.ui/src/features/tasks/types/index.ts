export enum TaskStatus {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Deleted = 3
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
    dueDate: string | null;
}
export interface CreateTaskRequest {
    title: string;
    description: string;
    dueDate: string;
}