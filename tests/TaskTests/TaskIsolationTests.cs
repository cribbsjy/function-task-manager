using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Tasks.Api.Auth;
using Tasks.Api.Domain;
using Tasks.Api.Repository;

namespace TaskTests;

public class TaskIsolationTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly TestUserContext _userContext;

    public TaskIsolationTests()
    {
        _connection = new SqliteConnection("Filename=:memory:");
        _connection.Open();

        _userContext = new TestUserContext();
    }

    private TasksDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<TasksDbContext>()
            .UseSqlite(_connection)
            .Options;

        var context = new TasksDbContext(options, _userContext);
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task GlobalQueryFilter_ShouldIsolateData_WhenDifferentUsersQuery()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        _userContext.UserId = "UserB";

        using (var dbSeed = CreateDbContext())
        {
            dbSeed.Tasks.Add(new TaskEntity
            {
                Id = taskId,
                Title = "UserB's Private Task",
                Description = "Top Secret",
                Status = Status.New,
                CreatedAt = DateTimeOffset.UtcNow
            });
            await dbSeed.SaveChangesAsync();
        }

        _userContext.UserId = "UserA";

        // Act
        using var dbQuery = CreateDbContext();
        var userATasks = await dbQuery.Tasks.ToListAsync();

        // Assert
        Assert.Empty(userATasks);
    }

    public void Dispose()
    {
        _connection.Close(); // Safely teardown in-memory DB resources
        _connection.Dispose();
    }
}

#region Fixtures and Helpers

public class TestUserContext : ICurrentUserContext
{
    public string UserId { get; set; } = string.Empty;
    public bool IsAuthenticated => !string.IsNullOrEmpty(UserId);
}

#endregion