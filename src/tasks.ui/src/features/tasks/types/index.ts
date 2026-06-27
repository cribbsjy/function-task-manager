export enum TaskStatus {
    New = 1,
    InProgress = 2,
    Completed = 3,
    Deleted = 4
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
    dueDate: string;
}
export interface CreateTaskRequest {
    title: string;
    description: string;
    dueDate: string;
}