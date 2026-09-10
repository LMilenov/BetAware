namespace API.DTOs.Dashboard;

public class MonthlyStatisticsDto
{
    public int Year { get; set; }

    public int Month { get; set; }

    public decimal TotalWon { get; set; }

    public decimal TotalLost { get; set; }

    public decimal NetResult { get; set; }
}