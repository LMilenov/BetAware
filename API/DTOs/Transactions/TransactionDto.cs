using API.Enums;

namespace API.DTOs.Transactions;

public class TransactionDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public GamblingCategory Category { get; set; }
    public DateTime TransactionDate { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}