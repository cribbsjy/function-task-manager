using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Tasks.Api.Domain;
using Tasks.Api.Endpoints.Requests;
using Tasks.Api.Repository;

namespace Tasks.Api.Endpoints;

public static class TaskEndpoints
{
    private const string GetTasks = "GetTasks";
    private const string CreateTask = "CreateTask";

    public static IEndpointRouteBuilder MapV1TaskEndpoints(this IEndpointRouteBuilder builder)
    {
        var endpointsGroup = builder.MapGroup("/v1/tasks");

        endpointsGroup.MapGet("/", async (TasksDbContext db, CancellationToken cancellationToken) =>
        {
            var tasks = await db.Tasks.ToListAsync(cancellationToken);
            return Results.Ok(tasks);
        })
            .WithName(GetTasks);

        endpointsGroup.MapPost("/", async (
            CreateTaskRequest request,
            IValidator<CreateTaskRequest> validator,
            TasksDbContext db,
            CancellationToken cancellationToken) =>
        {
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var task = new TaskEntity
            {
                Id = Guid.NewGuid(),
                Title = request.Title.Trim(),
                Description = request.Description.Trim(),
                Status = Domain.TaskStatus.New,
                CreatedAt = DateTime.UtcNow
            };

            db.Tasks.Add(task);
            await db.SaveChangesAsync(cancellationToken);

            return Results.Created($"/tasks/{task.Id}", task);
        })
            .WithName(CreateTask)
            .Produces<Created>();

        endpointsGroup.MapPut("/{id:guid}", async (
            Guid id,
            UpdateTaskRequest request,
            IValidator<UpdateTaskRequest> validator,
            TasksDbContext db,
            CancellationToken cancellationToken) =>
        {
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var task = await db.Tasks.FindAsync(new object[] { id }, cancellationToken);
            if (task is null)
            {
                return Results.NotFound(new { Message = $"Task with ID {id} not found." });
            }

            task.Title = request.Title.Trim();
            task.Description = request.Description.Trim();
            task.Status = request.Status;
            task.LastUpdatedAt = DateTimeOffset.UtcNow;

            await db.SaveChangesAsync(cancellationToken);
            return Results.NoContent();
        })
            .WithName("UpdateTask")
            .Produces<Ok>()
            .Produces<NotFound>();

        return builder;
    }
}
