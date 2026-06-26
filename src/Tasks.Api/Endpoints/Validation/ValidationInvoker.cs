using FluentValidation;
using FluentValidation.Results;

namespace Tasks.Api.Endpoints.Validation;

public interface IValidationInvoker
{
    /// <summary>
    /// Looks up the correct validator for the given object and runs its rules.
    /// </summary>
    Task<ValidationResult?> ValidateAsync(object? argument, CancellationToken ct);
}

public class ValidationInvoker(IServiceProvider serviceProvider) : IValidationInvoker
{
    public async Task<ValidationResult?> ValidateAsync(object? argument, CancellationToken ct)
    {
        if (argument == null) return null;

        var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());

        if (serviceProvider.GetService(validatorType) is not IValidator validator) return null;

        var context = new ValidationContext<object>(argument);

        return await validator.ValidateAsync(context, ct);
    }
}