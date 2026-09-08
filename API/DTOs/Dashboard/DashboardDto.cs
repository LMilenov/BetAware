namespace API.DTOs.Dashboard;

public class DashboardDto
{
    public int TotalTransactions { get; set; }

    public decimal TotalWon { get; set; }

    public decimal TotalLost { get; set; }

    public decimal NetResult { get; set; }
}