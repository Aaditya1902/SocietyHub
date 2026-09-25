using Microsoft.EntityFrameworkCore;
using SocietyHub.Application.Interfaces;
using SocietyHub.Domain.Entities;
using SocietyHub.Infrastructure.Data;

namespace SocietyHub.Infrastructure.Services;

public class TowerService : ITowerService
{
    private readonly ApplicationDbContext _context;

    public TowerService(ApplicationDbContext context)
    {
        _context = context;
    }

    

    public async Task<Guid> CreateTowerAsync(
    string name,
    Guid societyId)
{
    var societyExists = await _context.Societies
        .AnyAsync(society => society.Id == societyId);

    if (!societyExists)
    {
        throw new KeyNotFoundException("Society not found.");
    }

    var tower = new Tower
    {
        Id = Guid.NewGuid(),
        Name = name,
        SocietyId = societyId
    };

    _context.Towers.Add(tower);

    await _context.SaveChangesAsync();

    return tower.Id;
}
}