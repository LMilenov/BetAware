namespace API.DTOs.Investments;

public class InvestmentPotentialDto
{
    public int InvestmentScenarioId { get; set; }

    public string InvestmentName { get; set; } = string.Empty;

    public decimal TotalLosses { get; set; }

    public decimal InvestableAmount { get; set; }

    public int PossibleUnits { get; set; }

    public decimal InvestedAmount { get; set; }
    public decimal UninvestedAmount { get; set; }

    public decimal EstimatedProfit { get; set; }

    public decimal EstimatedValue { get; set; }
    public int Years { get; set; }

    public decimal AnnualReturnRate { get; set; }

    public string Currency { get; set; } = "BGN";
}