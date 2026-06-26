namespace Tasks.Api.Domain;

public record TaskEntity
{
    public Guid? Id { get; set; }
    public string? UserId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public Status Status { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? LastUpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }

    // Calculated helper values
    public bool IsCompleted => Status == Status.Completed;
    public bool IsDeleted => DeletedAt is not null;
}

public enum Status
{
    Unknown = 0,
    New,
    InProgress,
    Completed
}