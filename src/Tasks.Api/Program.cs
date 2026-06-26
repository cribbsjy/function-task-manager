using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Infrastructure Services (Entity Framework Core with SQLite)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? "Data Source=/app/data/tasks.db";

builder.Services.AddDbContext<TasksDbContext>(options =>
    options.UseSqlite(connectionString));

// Add OpenAPI/Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Cross-Origin Resource Sharing (CORS) so your React frontend can call it
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 2. Configure the HTTP Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// 3. Define Minimal API Endpoints
app.MapGet("/tasks", async (TasksDbContext db) =>
{
    var tasks = await db.Tasks.ToListAsync();
    return Results.Ok(tasks);
})
.WithName("GetTasks")
.WithOpenApi();

// 4. Automated Database Initialization on Container Startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<TasksDbContext>();
    // EnsureCreated() automatically creates the tasks.db file and schema 
    // inside your Docker mounted volume if it doesn't exist yet.
    dbContext.Database.EnsureCreated();
}

app.Run();

// 5. Explicitly Scoped In-File Data Structures for Architectural Simplicity
public class TaskItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class TasksDbContext : DbContext
{
    public TasksDbContext(DbContextOptions<TasksDbContext> options) : base(options) { }
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
}