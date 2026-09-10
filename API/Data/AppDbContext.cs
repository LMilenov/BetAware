using API.Entities;
using API.Entities.Alternatives;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    public DbSet<GamblingTransaction> GamblingTransactions { get; set; }
    public DbSet<Alternative> Alternatives { get; set; }
}