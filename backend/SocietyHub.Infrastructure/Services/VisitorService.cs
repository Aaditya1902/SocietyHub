using QRCoder;
using Microsoft.EntityFrameworkCore;
using SocietyHub.Application.Interfaces;
using SocietyHub.Domain.Entities;
using SocietyHub.Domain.Enums;
using SocietyHub.Infrastructure.Data;

namespace SocietyHub.Infrastructure.Services;

public class VisitorService : IVisitorService
{
    private readonly ApplicationDbContext _context;

    public VisitorService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateVisitorAsync(
        string visitorName,
        string phoneNumber,
        Guid flatId,
        Guid createdByUserId,
        DateTime expectedArrival)
    {
        var flatExists = await _context.Flats
            .AnyAsync(flat => flat.Id == flatId);

        if (!flatExists)
        {
            throw new KeyNotFoundException("Flat not found.");
        }

        var userExists = await _context.Users
            .AnyAsync(user => user.Id == createdByUserId);

        if (!userExists)
        {
            throw new KeyNotFoundException("User not found.");
        }

        var visitor = new Visitor
        {
            Id = Guid.NewGuid(),
            VisitorName = visitorName,
            PhoneNumber = phoneNumber,
            FlatId = flatId,
            CreatedByUserId = createdByUserId,
            ExpectedArrival = expectedArrival,
            Status = VisitorStatus.Pending
        };

        _context.Visitors.Add(visitor);

        await _context.SaveChangesAsync();

        return visitor.Id;
    }

    public async Task ApproveOrRejectVisitorAsync(
    Guid visitorId,
    Guid residentUserId,
    bool approved)
{
    var visitor = await _context.Visitors
        .FirstOrDefaultAsync(visitor => visitor.Id == visitorId);

    if (visitor is null)
    {
        throw new KeyNotFoundException("Visitor not found.");
    }

    var residentBelongsToFlat = await _context.FlatResidents
        .AnyAsync(resident =>
            resident.UserId == residentUserId &&
            resident.FlatId == visitor.FlatId);

    if (!residentBelongsToFlat)
    {
        throw new UnauthorizedAccessException(
            "You are not a resident of this flat.");
    }

    if (visitor.Status != VisitorStatus.Pending)
    {
        throw new InvalidOperationException(
            "Only pending visitors can be approved or rejected.");
    }

    visitor.Status = approved
        ? VisitorStatus.Approved
        : VisitorStatus.Rejected;

    visitor.ApprovedByUserId = residentUserId;
    visitor.ApprovalTime = DateTime.UtcNow;

    await _context.SaveChangesAsync();
}

public async Task<string> GenerateQrCodeAsync(
    Guid visitorId,
    Guid userId)
{
    var visitor = await _context.Visitors
        .FirstOrDefaultAsync(visitor => visitor.Id == visitorId);

    if (visitor is null)
    {
        throw new KeyNotFoundException("Visitor not found.");
    }

    var residentBelongsToFlat = await _context.FlatResidents
        .AnyAsync(resident =>
            resident.UserId == userId &&
            resident.FlatId == visitor.FlatId);

    if (!residentBelongsToFlat)
    {
        throw new UnauthorizedAccessException(
            "You are not a resident of this flat.");
    }

    if (visitor.Status != VisitorStatus.Approved)
    {
        throw new InvalidOperationException(
            "QR code can only be generated for approved visitors.");
    }

    var token = Guid.NewGuid().ToString("N");

    visitor.QrCode = token;

    await _context.SaveChangesAsync();

    return token;
}

public async Task MarkVisitorEntryAsync(
    string qrCode,
    Guid securityUserId)
{
    var visitor = await _context.Visitors
        .FirstOrDefaultAsync(visitor => visitor.QrCode == qrCode);

    if (visitor is null)
    {
        throw new KeyNotFoundException(
            "Invalid QR code.");
    }

    if (visitor.Status != VisitorStatus.Approved)
    {
        throw new InvalidOperationException(
            "Only approved visitors can enter.");
    }

    visitor.Status = VisitorStatus.Entered;
    visitor.ActualEntryTime = DateTime.UtcNow;

    await _context.SaveChangesAsync();
}

public async Task MarkVisitorExitAsync(
    string qrCode,
    Guid securityUserId)
{
    var visitor = await _context.Visitors
        .FirstOrDefaultAsync(visitor => visitor.QrCode == qrCode);

    if (visitor is null)
    {
        throw new KeyNotFoundException(
            "Invalid QR code.");
    }

    if (visitor.Status != VisitorStatus.Entered)
    {
        throw new InvalidOperationException(
            "Only visitors who have entered can exit.");
    }

    visitor.Status = VisitorStatus.Exited;
    visitor.ActualExitTime = DateTime.UtcNow;

    await _context.SaveChangesAsync();
}

public async Task<List<object>> GetMyVisitorsAsync(Guid userId)
{
    return await _context.Visitors
        .Where(v => v.CreatedByUserId == userId)
        .OrderByDescending(v => v.CreatedAt)
        .Select(v => (object)new
        {
            v.Id,
            v.VisitorName,
            v.PhoneNumber,
            v.FlatId,
            v.ExpectedArrival,
            v.ActualEntryTime,
            v.ActualExitTime,
            v.Status,
            v.ApprovalTime,
            v.QrCode,
            v.CreatedAt
        })
        .ToListAsync();
}
}