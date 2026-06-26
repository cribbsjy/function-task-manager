using Microsoft.EntityFrameworkCore;
using Tasks.Api.Auth;
using Tasks.Api.Domain;

namespace Tasks.Api.Repository;

public class TasksDbContext(DbContextOptions<TasksDbContext> options, ICurrentUserContext currentUser)
    : DbContext(options)
{
    private readonly ICurrentUserContext _currentUser = currentUser;

    public DbSet<TaskEntity> Tasks => Set<TaskEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Only fetch records belonging to the current user and not soft-deleted
        modelBuilder.Entity<TaskEntity>()
            .HasQueryFilter(t => t.DeletedAt == null && t.UserId == _currentUser.UserId);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Intercept inserts and stamp them with the owner's ID
        var newTasks = ChangeTracker.Entries<TaskEntity>()
            .Where(e => e.State == EntityState.Added);

        foreach (var entry in newTasks)
        {
            if (string.IsNullOrEmpty(entry.Entity.UserId))
            {
                entry.Entity.UserId = _currentUser.UserId;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}