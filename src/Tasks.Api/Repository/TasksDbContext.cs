using Microsoft.EntityFrameworkCore;
using Tasks.Api.Domain;

namespace Tasks.Api.Repository;

public class TasksDbContext : DbContext
{
    public TasksDbContext(DbContextOptions<TasksDbContext> options) : base(options) { }
    public DbSet<TaskEntity> Tasks => Set<TaskEntity>();
}
