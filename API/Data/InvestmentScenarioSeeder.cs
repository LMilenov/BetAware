using API.Entities.Investments;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public static class InvestmentScenarioSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var context = services.GetRequiredService<AppDbContext>();

        var scenarios = new[]
        {
            new InvestmentScenario
            {
                Name = "Emergency Savings",
                Description = "Illustrative emergency savings scenario. For demonstration purposes only.",
                MinimumAmount = 10m,
                AnnualReturnRate = 0m,
                Currency = "EUR",
                IsActive = true
            },
            new InvestmentScenario
            {
                Name = "Savings Account",
                Description = "Illustrative savings account scenario. The assumed return is not guaranteed.",
                MinimumAmount = 50m,
                AnnualReturnRate = 1.5m,
                Currency = "EUR",
                IsActive = true
            },
            new InvestmentScenario
            {
                Name = "Government Bonds",
                Description = "Illustrative government bonds scenario. The assumed return is not guaranteed.",
                MinimumAmount = 100m,
                AnnualReturnRate = 2.5m,
                Currency = "EUR",
                IsActive = true
            },
            new InvestmentScenario
            {
                Name = "Global ETF",
                Description = "Illustrative diversified ETF scenario. The assumed return is not guaranteed.",
                MinimumAmount = 25m,
                AnnualReturnRate = 6m,
                Currency = "EUR",
                IsActive = true
            }
        };

        foreach (var scenario in scenarios)
        {
            var exists = await context.InvestmentScenarios
                .AnyAsync(x => x.Name == scenario.Name);

            if (!exists)
            {
                context.InvestmentScenarios.Add(scenario);
            }
        }

        await context.SaveChangesAsync();
    }
}
