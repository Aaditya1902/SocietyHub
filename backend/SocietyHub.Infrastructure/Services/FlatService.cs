using Microsoft.EntityFrameworkCore;
using SocietyHub.Application.Interfaces;
using SocietyHub.Domain.Entities;
using SocietyHub.Infrastructure.Data;

namespace SocietyHub.Infrastructure.Services;

public class FlatService : IFlatService
{
    private readonly ApplicationDbContext _context;

    public FlatService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateFlatAsync(
    string flatNumber,
    Guid towerId)
{
    var towerExists = await _context.Towers
        .AnyAsync(tower => tower.Id == towerId);

    if (!towerExists)
    {
        throw new KeyNotFoundException("Tower not found.");
    }

    var flatAlreadyExists = await _context.Flats
    .AnyAsync(flat =>
        flat.TowerId == towerId &&
        flat.FlatNumber == flatNumber);

if (flatAlreadyExists)
{
    throw new InvalidOperationException(
        "A flat with this number already exists in this tower.");
}

    var flat = new Flat
    {
        Id = Guid.NewGuid(),
        FlatNumber = flatNumber,
        TowerId = towerId
    };

    _context.Flats.Add(flat);

    await _context.SaveChangesAsync();

    return flat.Id;
}

public async Task<List<object>> GetFlatsByTowerAsync(Guid towerId)
{
    var towerExists = await _context.Towers
        .AnyAsync(tower => tower.Id == towerId);

    if (!towerExists)
    {
        throw new KeyNotFoundException("Tower not found.");
    }

    var flats = await _context.Flats
        .Where(flat => flat.TowerId == towerId)
        .Select(flat => new
        {
            flat.Id,
            flat.FlatNumber
        })
        .ToListAsync();

    return flats.Cast<object>().ToList();
}
}