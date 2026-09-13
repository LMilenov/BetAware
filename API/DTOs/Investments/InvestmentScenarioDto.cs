namespace API.DTOs.Investments;

public class InvestmentScenarioDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal MinimumAmount { get; set; }

    public decimal AnnualReturnRate { get; set; }

    public string Currency { get; set; } = "BGN";
}