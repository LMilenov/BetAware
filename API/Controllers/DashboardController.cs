using System.Security.Claims;
using API.Data;
using API.DTOs.Dashboard;
using API.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var transactions = await context.GamblingTransactions
            .Where(x => x.UserId == userId)
            .ToListAsync();

        var totalWon = transactions
            .Where(x => x.Type == TransactionType.Win)
            .Sum(x => x.Amount);

        var totalLost = transactions
            .Where(x => x.Type == TransactionType.Loss)
            .Sum(x => x.Amount);

        var dashboard = new DashboardDto
        {
            TotalTransactions = transactions.Count,
            TotalWon = totalWon,
            TotalLost = totalLost,
            NetResult = totalWon - totalLost
        };

        return Ok(dashboard);
    }
}