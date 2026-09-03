using System.Security.Claims;
using API.Data;
using API.DTOs.Transactions;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController(AppDbContext context) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateTransaction(CreateTransactionDto transactionDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var transaction = new GamblingTransaction
        {
            Amount = transactionDto.Amount,
            Type = transactionDto.Type,
            Category = transactionDto.Category,
            TransactionDate = DateTime.SpecifyKind(
                transactionDto.TransactionDate,
                DateTimeKind.Utc
            ),
            Note = transactionDto.Note,

            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        context.GamblingTransactions.Add(transaction);

        await context.SaveChangesAsync();

        return Ok(new
        {
            message = "Transaction created successfully"
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactions()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var transactions = await context.GamblingTransactions
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.TransactionDate)
            .Select(x => new TransactionDto
            {
                Id = x.Id,
                Amount = x.Amount,
                Type = x.Type,
                Category = x.Category,
                TransactionDate = x.TransactionDate,
                Note = x.Note,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();

        return Ok(transactions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTransaction(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var transaction = await context.GamblingTransactions
             .Where(x => x.Id == id && x.UserId == userId)
             .Select(x => new TransactionDto
             {
                 Id = x.Id,
                 Amount = x.Amount,
                 Type = x.Type,
                 Category = x.Category,
                 TransactionDate = x.TransactionDate,
                 Note = x.Note,
                 CreatedAt = x.CreatedAt,
                 UpdatedAt = x.UpdatedAt
             })
             .FirstOrDefaultAsync();

        if (transaction == null)
        {
            return NotFound();
        }

        return Ok(transaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransaction(int id, UpdateTransactionDto transactionDto)
    {

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var transaction = await context.GamblingTransactions
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

        if (transaction == null)
        {
            return NotFound();
        }

        transaction.Amount = transactionDto.Amount;
        transaction.Type = transactionDto.Type;
        transaction.Category = transactionDto.Category;
        transaction.TransactionDate = DateTime.SpecifyKind(
            transactionDto.TransactionDate,
            DateTimeKind.Utc
        );
        transaction.Note = transactionDto.Note;
        transaction.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        return Ok(new
        {
            message = "Transaction updated successfully"
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var transaction = await context.GamblingTransactions
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

        if (transaction == null)
        {
            return NotFound();
        }

        context.GamblingTransactions.Remove(transaction);

        await context.SaveChangesAsync();

        return Ok(new
        {
            message = "Transaction deleted successfully"
        });
    }
}