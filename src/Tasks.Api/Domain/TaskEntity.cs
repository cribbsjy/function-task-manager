namespace Tasks.Api.Domain;

public record TaskEntity
{
    public Guid? Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public TaskStatus Status { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? LastUpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }

    // Calculated helper values
    public bool IsCompleted => Status == TaskStatus.Completed;
    public bool IsDeleted => DeletedAt is not null;
}

public enum TaskStatus
{
    Unknown,
    New,
    InProgress,
    Completed
}