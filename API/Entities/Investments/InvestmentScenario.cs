namespace API.Entities.Investments;

public class InvestmentScenario
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal MinimumAmount { get; set; }

    public decimal AnnualReturnRate { get; set; }

    public string Currency { get; set; } = "BGN";

    public bool IsActive { get; set; } = true;
}