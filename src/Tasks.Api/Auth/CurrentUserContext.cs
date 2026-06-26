using System.Security.Claims;

namespace Tasks.Api.Auth;

public interface ICurrentUserContext
{
    string UserId { get; }
    bool IsAuthenticated { get; }
}

public class CurrentUserContext(IHttpContextAccessor httpContextAccessor) : ICurrentUserContext
{
    private readonly HttpContext? _httpContext = httpContextAccessor.HttpContext;

    public string UserId => _httpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? string.Empty;

    public bool IsAuthenticated => _httpContext?.User?.Identity?.IsAuthenticated ?? false;
}