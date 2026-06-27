using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasks.Api.Domain;
using Tasks.Api.Endpoints.Requests;
using Tasks.Api.Endpoints.Validation;
using Tasks.Api.Repository;

namespace Tasks.Api.Endpoints;

public static class TaskEndpoints
{
    private const string GetTasks = "GetTasks";
    private const string CreateTask = "CreateTask";
    private const string UpdateTask = "UpdateTask";
    private const string DeleteTask = "Delete";

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
            [FromBody][Validate] CreateTaskRequest request,
            IValidator<CreateTaskRequest> validator,
            TasksDbContext db,
            CancellationToken cancellationToken) =>
        {
            var task = new TaskEntity
            {
                Id = Guid.NewGuid(),
                Title = request.Title?.Trim(),
                Description = request.Description?.Trim(),
                Status = Status.New,
                DueDate = request.DueDate,
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
            [FromBody][Validate] UpdateTaskRequest request,
            IValidator<UpdateTaskRequest> validator,
            TasksDbContext db,
            CancellationToken cancellationToken) =>
        {
            var task = await db.Tasks.FindAsync([id], cancellationToken);
            if (task is null)
            {
                return Results.NotFound(new { Message = $"Task with ID {id} not found." });
            }

            task.Title = request.Title?.Trim();
            task.Description = request.Description?.Trim();
            task.Status = request.Status;
            task.LastUpdatedAt = DateTimeOffset.UtcNow;
            task.DueDate = request.DueDate;

            await db.SaveChangesAsync(cancellationToken);
            return Results.Ok();
        })
            .WithName(UpdateTask)
            .Produces<Ok>()
            .Produces<NotFound>();

        endpointsGroup.MapDelete("/{id:guid}", async (
            Guid id,
            TasksDbContext db,
            CancellationToken cancellationToken) =>
        {
            var task = await db.Tasks.FindAsync([id], cancellationToken);
            if (task is null)
            {
                return Results.NotFound(new { Message = $"Task with ID {id} not found." });
            }

            task.Status = Status.Deleted;
            task.DeletedAt = DateTimeOffset.UtcNow;

            await db.SaveChangesAsync(cancellationToken);
            return Results.NoContent();
        })
            .WithName(DeleteTask)
            .Produces<NoContent>()
            .Produces<NotFound>();

        endpointsGroup.AddEndpointFilterFactory(ValidationFilter.ValidationFilterFactory)
            .RequireAuthorization();

        return builder;
    }
}
