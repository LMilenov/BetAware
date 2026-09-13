using API.Data;
using API.DTOs.Investments;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using API.Enums;

namespace API.Services;

public class InvestmentsService(AppDbContext context) : IInvestmentsService
{
    public async Task<List<InvestmentScenarioDto>>GetInvestmentScenariosAsync()
    {
        return await context.InvestmentScenarios
            .Where(x => x.IsActive)
            .Select(x => new InvestmentScenarioDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                MinimumAmount = x.MinimumAmount,
                AnnualReturnRate = x.AnnualReturnRate,
                Currency = x.Currency
            })
            .ToListAsync();
    }

    public async Task<InvestmentScenarioDto?>GetInvestmentScenarioAsync(int id)
    {
        return await context.InvestmentScenarios
            .Where(x =>
                x.Id == id &&
                x.IsActive)
            .Select(x => new InvestmentScenarioDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                MinimumAmount = x.MinimumAmount,
                AnnualReturnRate = x.AnnualReturnRate,
                Currency = x.Currency
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<InvestmentPotentialDto>>GetInvestmentPotentialAsync(string userId)
    {
        var totalLosses = await context.GamblingTransactions
            .Where(x =>
                x.UserId == userId &&
                x.Type == TransactionType.Loss)
            .SumAsync(x => (decimal?)x.Amount) ?? 0;

        var scenarios = await context.InvestmentScenarios
            .Where(x => x.IsActive)
            .ToListAsync();

        return scenarios.Select(x =>
        {
            var possibleUnits = x.MinimumAmount > 0
                ? (int)(totalLosses / x.MinimumAmount)
                : 0;

            var investedAmount =
                possibleUnits * x.MinimumAmount;

            var estimatedProfit =
                investedAmount * x.AnnualReturnRate / 100;

            var estimatedValue =
                investedAmount + estimatedProfit;

            return new InvestmentPotentialDto
            {
                InvestmentScenarioId = x.Id,
                InvestmentName = x.Name,
                TotalLosses = totalLosses,
                InvestableAmount = totalLosses,
                PossibleUnits = possibleUnits,
                InvestedAmount = investedAmount,
                EstimatedProfitAfterOneYear = estimatedProfit,
                EstimatedValueAfterOneYear = estimatedValue,
                AnnualReturnRate = x.AnnualReturnRate,
                Currency = x.Currency
            };
        }).ToList();
    }
}