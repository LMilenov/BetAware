using API.Data;
using API.DTOs.Investments;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class InvestmentsService(
    AppDbContext context
) : IInvestmentsService
{
    public async Task<List<InvestmentScenarioDto>>
        GetInvestmentScenariosAsync()
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

    public async Task<InvestmentScenarioDto?>
        GetInvestmentScenarioAsync(int id)
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
}