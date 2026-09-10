using API.Data;
using API.DTOs.Alternatives;
using API.Entities.Alternatives;
using API.Enums;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class AlternativesService(AppDbContext context) : IAlternativesService
{
    public async Task<List<AlternativeDto>> GetAlternativesAsync(string userId)
    {
        var totalLost = await context.GamblingTransactions
            .Where(x =>
                x.UserId == userId &&
                x.Type == TransactionType.Loss)
            .SumAsync(x => x.Amount);

        var alternatives = await context.Alternatives
            .Where(x => x.IsActive)
            .ToListAsync();

        return alternatives
            .Select(x =>
            {
                var quantity = CalculateQuantity(
                    totalLost,
                    x.Price
                );

                var totalCost = quantity * x.Price;

                var percentageOfLoss = totalLost > 0
                    ? Math.Round(totalCost / totalLost * 100, 2)
                    : 0;

                var remainingAmount = totalLost - totalCost;

                return new AlternativeDto
                {
                    Name = x.Name,
                    Category = x.Category,
                    Price = x.Price,
                    Quantity = quantity,
                    TotalCost = totalCost,
                    PercentageOfLoss = percentageOfLoss,
                    RemainingAmount = remainingAmount
                };
            })
            .Where(x => x.Quantity > 0)
            .ToList();
    }

    public async Task<AlternativeDto> CreateAlternativeAsync(CreateAlternativeDto dto)
    {
        var alternative = new Alternative
        {
            Name = dto.Name,
            Category = dto.Category,
            Price = dto.Price,
            Currency = dto.Currency,
            ImageUrl = dto.ImageUrl,
            Description = dto.Description,
            IsActive = dto.IsActive
        };

        context.Alternatives.Add(alternative);

        await context.SaveChangesAsync();

        return new AlternativeDto
        {
            Name = alternative.Name,
            Category = alternative.Category,
            Price = alternative.Price,
            Quantity = 1,
            TotalCost = alternative.Price,
            PercentageOfLoss = 0,
            RemainingAmount = 0
        };
    }

    public async Task<AlternativeDto?> GetAlternativeAsync(int id)
    {
        var alternative = await context.Alternatives
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.IsActive);

        if (alternative == null)
        {
            return null;
        }

        return new AlternativeDto
        {
            Name = alternative.Name,
            Category = alternative.Category,
            Price = alternative.Price,
            Quantity = 1,
            TotalCost = alternative.Price,
            PercentageOfLoss = 0,
            RemainingAmount = 0
        };
    }

    public async Task<AlternativeDto?> UpdateAlternativeAsync(int id, UpdateAlternativeDto dto)
    {
        var alternative = await context.Alternatives
            .FirstOrDefaultAsync(x => x.Id == id);

        if (alternative == null)
        {
            return null;
        }

        alternative.Name = dto.Name;
        alternative.Category = dto.Category;
        alternative.Price = dto.Price;
        alternative.Currency = dto.Currency;
        alternative.ImageUrl = dto.ImageUrl;
        alternative.Description = dto.Description;
        alternative.IsActive = dto.IsActive;

        await context.SaveChangesAsync();

        return new AlternativeDto
        {
            Name = alternative.Name,
            Category = alternative.Category,
            Price = alternative.Price,
            Quantity = 1,
            TotalCost = alternative.Price,
            PercentageOfLoss = 0,
            RemainingAmount = 0
        };
    }

    public async Task<bool> DeleteAlternativeAsync(int id)
    {
        var alternative = await context.Alternatives
            .FirstOrDefaultAsync(x => x.Id == id);

        if (alternative == null)
        {
            return false;
        }

        context.Alternatives.Remove(alternative);

        await context.SaveChangesAsync();

        return true;
    }

    private static int CalculateQuantity(decimal budget, decimal price)
    {
        if (price <= 0)
        {
            return 0;
        }

        return (int)Math.Floor(budget / price);
    }
}