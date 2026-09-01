using API.Enums;

namespace API.Entities;

public class GamblingTransaction
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public GamblingCategory Category { get; set; }
    public DateTime TransactionDate { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string UserId { get; set; } = string.Empty;
    public AppUser User { get; set; } = null!;
}