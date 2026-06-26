namespace Tasks.Api.Domain;

public record TaskEntity
{
    public Guid? Id { get; init; }
    public string? Title { get; init; }
    public string? Description { get; init; }
    public TaskStatus Status{ get; init; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset DeletedAt { get; set; }
}

public enum TaskStatus
{
    Unknown,
    New,
    InProgress,
    Completed
}