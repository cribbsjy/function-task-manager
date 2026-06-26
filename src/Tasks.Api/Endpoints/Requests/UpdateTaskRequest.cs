using FluentValidation;

namespace Tasks.Api.Endpoints.Requests;

public record UpdateTaskRequest
{
    public required string Title { get; init; }
    public required string Description { get; init; }
    public required Domain.TaskStatus Status { get; init; }
}

public class UpdateTaskRequestValidator : AbstractValidator<UpdateTaskRequest>
{
    public UpdateTaskRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title must not exceed 100 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");
    }
}
