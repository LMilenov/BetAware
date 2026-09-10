using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Alternatives;

public class UpdateAlternativeDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    public string Currency { get; set; } = "BGN";

    public string? ImageUrl { get; set; }

    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}