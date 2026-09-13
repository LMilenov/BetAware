using API.DTOs.Investments;

namespace API.DTOs.Dashboard;


public class DashboardDto
{
    public int TotalTransactions { get; set; }

    public decimal TotalWon { get; set; }

    public decimal TotalLost { get; set; }

    public decimal NetResult { get; set; }

    public int WinCount { get; set; }

    public int LossCount { get; set; }

    public decimal WinRate { get; set; }

    public decimal AverageWin { get; set; }

    public decimal AverageLoss { get; set; }

    public decimal BiggestWin { get; set; }

    public decimal BiggestLoss { get; set; }

    public List<InvestmentPotentialDto> InvestmentPotential { get; set; } = [];
}