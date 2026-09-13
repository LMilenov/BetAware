using API.DTOs.Investments;

namespace API.Interfaces;

public interface IInvestmentsService
{
    Task<List<InvestmentScenarioDto>> GetInvestmentScenariosAsync();

    Task<InvestmentScenarioDto?> GetInvestmentScenarioAsync(int id);
    Task<List<InvestmentPotentialDto>> GetInvestmentPotentialAsync(string userId, int years);
}