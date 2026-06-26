using FluentValidation.TestHelper;
using Tasks.Api.Domain;
using Tasks.Api.Endpoints.Requests;

namespace TaskTests;

public class TaskValidatorTests
{
    private readonly CreateTaskRequestValidator _createValidator;
    private readonly UpdateTaskRequestValidator _updateValidator;

    public TaskValidatorTests()
    {
        _createValidator = new CreateTaskRequestValidator();
        _updateValidator = new UpdateTaskRequestValidator();
    }

    [Fact]
    public void CreateValidator_ShouldPass_WhenPayloadIsValid()
    {
        // Arrange
        var request = new CreateTaskRequest { Title = "Finish Homework", Description = "Complete calculus assignment." };

        // Act
        var result = _createValidator.TestValidate(request);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void CreateValidator_ShouldFail_WhenTitleIsEmpty(string? invalidTitle)
    {
        // Arrange
        var request = new CreateTaskRequest { Title = invalidTitle!, Description = "Valid description" };

        // Act
        var result = _createValidator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(t => t.Title);
    }

    [Fact]
    public void CreateValidator_ShouldFail_WhenTitleExceedsMaxLength()
    {
        // Arrange
        var hugeTitle = new string('A', 105);
        var request = new CreateTaskRequest { Title = hugeTitle, Description = "Valid description" };

        // Act
        var result = _createValidator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(t => t.Title);
    }

    [Fact]
    public void UpdateValidator_ShouldFail_WhenStatusIsInvalidEnumValue()
    {
        // Arrange
        var request = new UpdateTaskRequest
        {
            Title = "Valid Title",
            Description = "Valid description",
            Status = (Status)999 // Out-of-bounds enum value
        };

        // Act
        var result = _updateValidator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(t => t.Status);
    }
}