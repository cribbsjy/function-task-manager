using FluentValidation;
using Tasks.Api.Extensions;

namespace Tasks.Api.Endpoints.Requests;

public record CreateTaskRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? DueDate { get; set; }
}

public class CreateTaskRequestValidator : AbstractValidator<CreateTaskRequest>
{
    public CreateTaskRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title must not exceed 100 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");

        RuleFor(x => x.DueDate)
            .NotEmpty().WithMessage("Due Date is required.")
            .Must(dateStr => dateStr.ToDateOnly() is not null)
                .WithMessage("Due Date must be a valid date in YYYY-MM-DD format.")
            .DependentRules(() =>
            {
                RuleFor(x => x.DueDate)
                    .Must(dateStr =>
                    {
                        var parsedDate = dateStr.ToDateOnly();
                        return parsedDate >= DateOnly.FromDateTime(DateTime.UtcNow);
                    })
                    .WithMessage("The due date cannot be in the past.");
            });
    }
}
