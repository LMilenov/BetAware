using API.DTOs.Alternatives;

namespace API.Interfaces;

public interface IAlternativesService
{
    Task<List<AlternativeDto>> GetAlternativesAsync(string userId);
    Task<AlternativeDto?> GetAlternativeAsync(int id);
    Task<AlternativeDto> CreateAlternativeAsync(CreateAlternativeDto dto);
    Task<AlternativeDto?> UpdateAlternativeAsync(int id, UpdateAlternativeDto dto);
    Task<bool> DeleteAlternativeAsync(int id);
}