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
        GamblingCategory? category = null,
        int years = 1);

    Task<List<MonthlyStatisticsDto>> GetMonthlyStatisticsAsync(
        string userId);

    Task<List<CategoryStatisticsDto>> GetCategoryStatisticsAsync(
        string userId);
}