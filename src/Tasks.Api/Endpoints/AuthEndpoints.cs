using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Tasks.Api.Auth;

namespace Tasks.Api.Endpoints;

public static class AuthEndpoints
{
    public record LoginRequest(string Username, string Password);
    public record LoginResponse(string Token, DateTime ExpiresAt);

    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth");

        group.MapPost("/login", (
            LoginRequest request,
            IOptions<JwtSettings> jwtOptions) =>
        {
            var testUsers = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "UserA", "passwordA" },
                { "UserB", "passwordB" }
            };

            if (!testUsers.TryGetValue(request.Username, out var validPassword) || request.Password != validPassword)
            {
                return Results.Unauthorized();
            }

            var settings = jwtOptions.Value;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiresAt = DateTime.UtcNow.AddHours(2);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, request.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, "User")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiresAt,
                Issuer = settings.Issuer,
                Audience = settings.Audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var stringToken = tokenHandler.WriteToken(token);

            return Results.Ok(new LoginResponse(stringToken, expiresAt));
        })
        .WithName("Login");
    }
}