using Microsoft.EntityFrameworkCore;
using SocietyHub.Application.Interfaces;
using SocietyHub.Domain.Entities;
using SocietyHub.Domain.Enums;
using SocietyHub.Infrastructure.Data;

namespace SocietyHub.Infrastructure.Services;

public class ResidentService : IResidentService
{
    private readonly ApplicationDbContext _context;

    public ResidentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> AssignResidentToFlatAsync(
        Guid userId,
        Guid flatId,
        int relationship,
        bool isPrimaryResident)
    {
        if (!Enum.IsDefined(typeof(ResidentRelationship), relationship))
        {
            throw new ArgumentException("Invalid resident relationship.");
        }

        var userExists = await _context.Users
            .AnyAsync(user => user.Id == userId);

        if (!userExists)
        {
            throw new KeyNotFoundException("User not found.");
        }

        var flatExists = await _context.Flats
            .AnyAsync(flat => flat.Id == flatId);

        if (!flatExists)
        {
            throw new KeyNotFoundException("Flat not found.");
        }

        var alreadyAssigned = await _context.FlatResidents
            .AnyAsync(resident =>
                resident.UserId == userId &&
                resident.FlatId == flatId);

        if (alreadyAssigned)
        {
            throw new InvalidOperationException(
                "This resident is already assigned to this flat.");
        }

        var flatResident = new FlatResident
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            FlatId = flatId,
            Relationship = (ResidentRelationship)relationship,
            IsPrimaryResident = isPrimaryResident
        };

        _context.FlatResidents.Add(flatResident);

        await _context.SaveChangesAsync();

        return flatResident.Id;
    }

    public async Task<List<object>> GetAllResidentsAsync()
    {
        var residents = await _context.FlatResidents
            .Include(fr => fr.User)
            .Include(fr => fr.Flat)
                .ThenInclude(f => f.Tower)
                    .ThenInclude(t => t.Society)
            .Select(fr => new
            {
                id = fr.UserId,
                fullName = fr.User.FullName,
                email = fr.User.Email,
                phoneNumber = fr.User.PhoneNumber,
                relationship = fr.Relationship.ToString(),
                isPrimaryResident = fr.IsPrimaryResident,
                flatNumber = fr.Flat.FlatNumber,
                towerName = fr.Flat.Tower.Name,
                societyName = fr.Flat.Tower.Society.Name,
                joinedAt = fr.JoinedAt
            })
            .Cast<object>()
            .ToListAsync();

        return residents;
    }

    public async Task<int> GetResidentCountAsync()
    {
        return await _context.FlatResidents
            .Select(fr => fr.UserId)
            .Distinct()
            .CountAsync();
    }
}