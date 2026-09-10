using System.Security.Claims;
using API.DTOs.Dashboard;
using API.Enums;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetDashboard(
        DateTime? startDate,
        DateTime? endDate,
        TransactionType? type,
        GamblingCategory? category)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var dashboard = await dashboardService.GetDashboardAsync(
            userId,
            startDate,
            endDate,
            type,
            category
        );

        return Ok(dashboard);
    }

    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthlyStatistics()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var statistics =
            await dashboardService.GetMonthlyStatisticsAsync(userId);

        return Ok(statistics);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategoryStatistics()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var statistics =
            await dashboardService.GetCategoryStatisticsAsync(userId);

        return Ok(statistics);
    }
}