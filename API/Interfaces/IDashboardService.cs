using API.DTOs.Dashboard;
using API.Enums;

namespace API.Interfaces;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync(
        string userId,
        DateTime? startDate = null,
        DateTime? endDate = null,
        TransactionType? type = null,
        GamblingCategory? category = null);

    Task<List<MonthlyStatisticsDto>> GetMonthlyStatisticsAsync(
        string userId);

    Task<List<CategoryStatisticsDto>> GetCategoryStatisticsAsync(
        string userId);
}