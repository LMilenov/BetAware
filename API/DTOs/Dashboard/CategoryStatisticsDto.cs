using API.Enums;

namespace API.DTOs.Dashboard;

public class CategoryStatisticsDto
{
    public GamblingCategory Category { get; set; }

    public int TotalTransactions { get; set; }

    public decimal TotalWon { get; set; }

    public decimal TotalLost { get; set; }

    public decimal NetResult { get; set; }
}