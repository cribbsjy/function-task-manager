namespace Tasks.Api.Extensions
{
    public static class StringExtensions
    {
        public static DateOnly? ToDateOnly(this string? dateOnlyAsString)
        {
            var success = DateOnly.TryParseExact(dateOnlyAsString, "yyyy-MM-dd", out var retVal);
            return success ? retVal : null;
        }
    }
}
