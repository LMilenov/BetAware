using API.Data;
using API.DTOs.Dashboard;
using API.Enums;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class DashboardService(AppDbContext context, IInvestmentsService investmentsService) : IDashboardService
{
    public async Task<DashboardDto> GetDashboardAsync(
        string userId,
        DateTime? startDate = null,
        DateTime? endDate = null,
        TransactionType? type = null,
        GamblingCategory? category = null,
        int years = 1)
    {
        var query = context.GamblingTransactions
            .Where(x => x.UserId == userId)
            .AsQueryable();

        if (startDate.HasValue)
        {
            var startDateUtc = DateTime.SpecifyKind(
                startDate.Value,
                DateTimeKind.Utc
            );

            query = query.Where(
                x => x.TransactionDate >= startDateUtc
            );
        }

        if (endDate.HasValue)
        {
            var endDateUtc = DateTime.SpecifyKind(
                endDate.Value.Date.AddDays(1),
                DateTimeKind.Utc
            );

            query = query.Where(
                x => x.TransactionDate < endDateUtc
            );
        }

        if (type.HasValue)
        {
            query = query.Where(x => x.Type == type.Value);
        }

        if (category.HasValue)
        {
            query = query.Where(x => x.Category == category.Value);
        }

        var transactions = await query.ToListAsync();

        var totalWon = transactions
            .Where(x => x.Type == TransactionType.Win)
            .Sum(x => x.Amount);

        var totalLost = transactions
            .Where(x => x.Type == TransactionType.Loss)
            .Sum(x => x.Amount);

        var winCount = transactions
            .Count(x => x.Type == TransactionType.Win);

        var lossCount = transactions
            .Count(x => x.Type == TransactionType.Loss);

        var averageWin = winCount > 0
            ? totalWon / winCount
            : 0;

        var averageLoss = lossCount > 0
            ? totalLost / lossCount
            : 0;

        var biggestWin = transactions
            .Where(x => x.Type == TransactionType.Win)
            .Select(x => x.Amount)
            .DefaultIfEmpty(0)
            .Max();

        var biggestLoss = transactions
            .Where(x => x.Type == TransactionType.Loss)
            .Select(x => x.Amount)
            .DefaultIfEmpty(0)
            .Max();

        var winRate = transactions.Count > 0
            ? Math.Round(
                (decimal)winCount / transactions.Count * 100,
                2
            )
            : 0;
        var investmentPotential =
            await investmentsService.GetInvestmentPotentialAsync(userId, years);

        return new DashboardDto
        {
            TotalTransactions = transactions.Count,
            TotalWon = totalWon,
            TotalLost = totalLost,
            NetResult = totalWon - totalLost,

            WinCount = winCount,
            LossCount = lossCount,
            WinRate = winRate,

            AverageWin = averageWin,
            AverageLoss = averageLoss,

            BiggestWin = biggestWin,
            BiggestLoss = biggestLoss,

            InvestmentPotential = investmentPotential
        };
    }

    public async Task<List<MonthlyStatisticsDto>> GetMonthlyStatisticsAsync(string userId)
    {
        var transactions = await context.GamblingTransactions
            .Where(x => x.UserId == userId)
            .ToListAsync();

        var statistics = transactions
            .GroupBy(x => new
            {
                x.TransactionDate.Year,
                x.TransactionDate.Month
            })
            .OrderBy(x => x.Key.Year)
            .ThenBy(x => x.Key.Month)
            .Select(x => new MonthlyStatisticsDto
            {
                Year = x.Key.Year,
                Month = x.Key.Month,

                TotalWon = x
                    .Where(t => t.Type == TransactionType.Win)
                    .Sum(t => t.Amount),

                TotalLost = x
                    .Where(t => t.Type == TransactionType.Loss)
                    .Sum(t => t.Amount),

                NetResult = x
                    .Where(t => t.Type == TransactionType.Win)
                    .Sum(t => t.Amount)
                    -
                    x.Where(t => t.Type == TransactionType.Loss)
                        .Sum(t => t.Amount)
            })
            .ToList();

        return statistics;
}   

    public async Task<List<CategoryStatisticsDto>> GetCategoryStatisticsAsync(string userId)
    {
        var transactions = await context.GamblingTransactions
            .Where(x => x.UserId == userId)
            .ToListAsync();

        var statistics = transactions
            .GroupBy(x => x.Category)
            .Select(x => new CategoryStatisticsDto
            {
                Category = x.Key,

                TotalTransactions = x.Count(),

                TotalWon = x
                    .Where(t => t.Type == TransactionType.Win)
                    .Sum(t => t.Amount),

                TotalLost = x
                    .Where(t => t.Type == TransactionType.Loss)
                    .Sum(t => t.Amount),

                NetResult = x
                    .Where(t => t.Type == TransactionType.Win)
                    .Sum(t => t.Amount)
                    -
                    x.Where(t => t.Type == TransactionType.Loss)
                        .Sum(t => t.Amount)
            })
            .OrderByDescending(x => x.TotalLost)
            .ToList();

        return statistics;
    }
}