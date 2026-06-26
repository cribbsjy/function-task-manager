using FluentValidation;
using System.Reflection;

namespace Tasks.Api.Endpoints.Validation;

[AttributeUsage(AttributeTargets.Parameter)]
public class ValidateAttribute : Attribute;

public static class ValidationFilter
{
    public static EndpointFilterDelegate ValidationFilterFactory(EndpointFilterFactoryContext context,
        EndpointFilterDelegate next)
    {
        var validators = context.MethodInfo.GetParameters()
            .Where(p => p.GetCustomAttribute<ValidateAttribute>() is not null)
            .Select(p => new
            {
                Index = context.MethodInfo.GetParameters().ToList().IndexOf(p),
                ValidatorType = typeof(IValidator<>).MakeGenericType(p.ParameterType)
            })
            .ToList();

        if (validators.Count == 0) return next;

        return async invocationContext =>
        {
            // Resolve the invoker from the request-scoped container
            var invoker = invocationContext.HttpContext.RequestServices
                .GetRequiredService<IValidationInvoker>();

            foreach (var validatorInfo in validators)
            {
                var argument = invocationContext.Arguments[validatorInfo.Index];

                var result = await invoker.ValidateAsync(argument, invocationContext.HttpContext.RequestAborted);

                if (result is { IsValid: false }) return Results.ValidationProblem(result.ToDictionary());
            }

            return await next(invocationContext);
        };
    }
}