using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Tasks.Api.Auth;

namespace Tasks.Api.Repository;

/// <summary>
/// Provides a design-time factory for <see cref="TasksDbContext"/>.
/// This factory is automatically discovered and utilized by the Entity Framework Core CLI tooling 
/// (e.g., dotnet ef migrations) to safely generate schema scripts without executing the live 
/// application startup pipeline or requiring runtime dependency injection configurations.
/// </summary>
public class TasksDbContextFactory : IDesignTimeDbContextFactory<TasksDbContext>
{
    public TasksDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<TasksDbContext>();

        // Provide a simple local path so the migration generator can compile safely
        optionsBuilder.UseSqlite("Data Source=design_time_fallback.db");

        var designTimeUserContext = new DesignTimeUserContext();

        return new TasksDbContext(optionsBuilder.Options, designTimeUserContext);
    }
}
internal class DesignTimeUserContext : ICurrentUserContext
{
    public string UserId => "design-time-system-user";
    public bool IsAuthenticated => false;
}