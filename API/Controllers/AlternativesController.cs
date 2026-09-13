using System.Security.Claims;
using API.DTOs.Alternatives;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AlternativesController(IAlternativesService alternativesService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAlternatives(string? category, string? search, decimal? maxPrice)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var alternatives = await alternativesService.GetAlternativesAsync(userId, category, search, maxPrice);

        return Ok(alternatives);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetAlternative(int id)
    {
        var alternative = await alternativesService.GetAlternativeAsync(id);

        if (alternative == null)
        {
            return NotFound();
        }

        return Ok(alternative);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAlternative(CreateAlternativeDto dto)
    {
        var alternative =
            await alternativesService.CreateAlternativeAsync(dto);

        return Ok(alternative);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAlternative(int id, UpdateAlternativeDto dto)
    {
        var alternative =
            await alternativesService.UpdateAlternativeAsync(
                id,
                dto
            );

        if (alternative == null)
        {
            return NotFound();
        }

        return Ok(alternative);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAlternative(int id)
    {
        var deleted =
            await alternativesService.DeleteAlternativeAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}