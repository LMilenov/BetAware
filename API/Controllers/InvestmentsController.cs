using System.Security.Claims;
using API.DTOs.Investments;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InvestmentsController(
    IInvestmentsService investmentsService
) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<object>>>
        GetInvestmentScenarios()
    {
        var scenarios =
            await investmentsService.GetInvestmentScenariosAsync();

        return Ok(scenarios);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<object>>
        GetInvestmentScenario(int id)
    {
        var scenario =
            await investmentsService.GetInvestmentScenarioAsync(id);

        if (scenario is null)
        {
            return NotFound(new
            {
                message = "Investment scenario not found."
            });
        }

        return Ok(scenario);
    }

    [HttpGet("potential")]
    public async Task<ActionResult<List<InvestmentPotentialDto>>>GetInvestmentPotential(int years = 1)
    {
        if (years < 1 || years > 50)
        {
            return BadRequest(new
            {
                message = "Years must be between 1 and 50."
            });
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var potential =
            await investmentsService.GetInvestmentPotentialAsync(userId, years);

        return Ok(potential);
    }
}