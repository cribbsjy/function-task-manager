using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasks.Api.Endpoints;
using Tasks.Api.Endpoints.Requests;
using Tasks.Api.Repository;

var builder = WebApplication.CreateBuilder(args);

//var jwtKey = builder.Configuration["JwtSettings:Key"]
//             ?? throw new InvalidOperationException("JWT Signing Key is missing from configuration.");

//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = false,
//            ValidateAudience = false,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
//        };
//    });

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? "Data Source=tasks.db";

builder.Services.AddDbContext<TasksDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddValidatorsFromAssemblyContaining<CreateTaskRequestValidator>();

var app = builder.Build();

app.MapV1TaskEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// Automated Database Initialization on Container Startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<TasksDbContext>();
    await dbContext.Database.MigrateAsync();
}

app.Run();



