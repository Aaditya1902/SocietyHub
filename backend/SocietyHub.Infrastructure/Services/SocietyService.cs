using SocietyHub.Application.Interfaces;
using SocietyHub.Domain.Entities;
using SocietyHub.Infrastructure.Data;

namespace SocietyHub.Infrastructure.Services;

public class SocietyService : ISocietyService
{
    private readonly ApplicationDbContext _context;

    public SocietyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateSocietyAsync(
        string name,
        string address,
        string city,
        string state,
        string pincode)
    {
        var society = new Society
        {
            Id = Guid.NewGuid(),
            Name = name,
            Address = address,
            City = city,
            State = state,
            Pincode = pincode
        };

        _context.Societies.Add(society);

        await _context.SaveChangesAsync();

        return society.Id;
    }
}