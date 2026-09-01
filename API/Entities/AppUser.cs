using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
    public string Currency { get; set; } = "EUR";
    public ICollection<GamblingTransaction> Transactions { get; set; } = new List<GamblingTransaction>();
}