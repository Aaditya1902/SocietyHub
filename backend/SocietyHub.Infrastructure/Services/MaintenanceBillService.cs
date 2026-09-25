using Microsoft.EntityFrameworkCore;
using SocietyHub.Application.Interfaces;
using SocietyHub.Domain.Entities;
using SocietyHub.Domain.Enums;
using SocietyHub.Infrastructure.Data;

namespace SocietyHub.Infrastructure.Services;

public class MaintenanceBillService : IMaintenanceBillService
{
    private readonly ApplicationDbContext _context;

    public MaintenanceBillService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateBillAsync(
        Guid flatId,
        decimal amount,
        string billingMonth,
        DateTime dueDate)
    {
        var flatExists = await _context.Flats
            .AnyAsync(flat => flat.Id == flatId);

        if (!flatExists)
            throw new KeyNotFoundException("Flat not found.");

        if (amount <= 0)
            throw new InvalidOperationException(
                "Bill amount must be greater than zero.");

        var bill = new MaintenanceBill
        {
            Id = Guid.NewGuid(),
            FlatId = flatId,
            Amount = amount,
            BillingMonth = billingMonth,
            DueDate = dueDate,
            Status = BillStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.MaintenanceBills.Add(bill);

        await _context.SaveChangesAsync();

        return bill.Id;
    }

    public async Task<List<object>> GetMyBillsAsync(Guid userId)
    {
        var flatIds = await _context.FlatResidents
            .Where(fr => fr.UserId == userId)
            .Select(fr => fr.FlatId)
            .ToListAsync();

        return await _context.MaintenanceBills
            .AsNoTracking()
            .Where(bill => flatIds.Contains(bill.FlatId))
            .OrderByDescending(bill => bill.CreatedAt)
            .Select(bill => new
            {
                bill.Id,
                bill.FlatId,
                bill.Amount,
                bill.BillingMonth,
                bill.DueDate,
                bill.Status,
                bill.CreatedAt,
                bill.PaidAt
            })
            .Cast<object>()
            .ToListAsync();
    }

    public async Task MarkBillAsPaidAsync(
        Guid billId,
        Guid userId)
    {
        var bill = await _context.MaintenanceBills
            .FirstOrDefaultAsync(b => b.Id == billId);

        if (bill is null)
            throw new KeyNotFoundException("Maintenance bill not found.");

        var isResidentOfFlat = await _context.FlatResidents
            .AnyAsync(fr =>
                fr.UserId == userId &&
                fr.FlatId == bill.FlatId);

        if (!isResidentOfFlat)
            throw new UnauthorizedAccessException(
                "You are not authorized to pay this bill.");

        if (bill.Status == BillStatus.Paid)
            throw new InvalidOperationException(
                "This bill has already been paid.");

        bill.Status = BillStatus.Paid;
        bill.PaidAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task<List<object>> GetAllBillsAsync()
    {
        return await _context.MaintenanceBills
            .AsNoTracking()
            .Include(bill => bill.Flat)
            .OrderByDescending(bill => bill.CreatedAt)
            .Select(bill => new
            {
                bill.Id,
                bill.FlatId,
                FlatNumber = bill.Flat.FlatNumber,
                bill.Amount,
                bill.BillingMonth,
                bill.DueDate,
                bill.Status,
                bill.CreatedAt,
                bill.PaidAt
            })
            .Cast<object>()
            .ToListAsync();
    }
}