using FluentValidation;
using Tasks.Api.Domain;

namespace Tasks.Api.Endpoints.Requests;

public record UpdateTaskRequest
{
    public string? Title { get; init; }
    public string? Description { get; init; }
    public Status Status { get; init; }
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

        RuleFor(x => x.Status)
            .IsInEnum()
            .NotEqual(Status.Unknown)
            .WithMessage("Please select a valid status (New, InProgress, or Completed).");
    }
}
