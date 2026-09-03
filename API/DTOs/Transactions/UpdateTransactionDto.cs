using API.Enums;

namespace API.DTOs.Transactions;

public class UpdateTransactionDto
{
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public GamblingCategory Category { get; set; }
    public DateTime TransactionDate { get; set; }
    public string? Note { get; set; }
}