namespace API.DTOs.Alternatives;

public class AlternativeDto
{
    public string Name { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public decimal TotalCost { get; set; }

    public decimal PercentageOfLoss { get; set; }
    public decimal RemainingAmount { get; set; }
}