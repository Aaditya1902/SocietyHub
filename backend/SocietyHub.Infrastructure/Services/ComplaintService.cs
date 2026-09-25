using Microsoft.EntityFrameworkCore;
using SocietyHub.Application.Interfaces;
using SocietyHub.Domain.Entities;
using SocietyHub.Domain.Enums;
using SocietyHub.Infrastructure.Data;

namespace SocietyHub.Infrastructure.Services;

public class ComplaintService : IComplaintService
{
    private readonly ApplicationDbContext _context;

    public ComplaintService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateComplaintAsync(
        string title,
        string description,
        ComplaintPriority priority,
        Guid flatId,
        Guid createdByUserId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == createdByUserId);

        if (user is null)
            throw new KeyNotFoundException("User not found.");

        if (user.Role != UserRole.Resident)
            throw new UnauthorizedAccessException(
                "Only residents can create complaints.");

        var isResidentOfFlat = await _context.FlatResidents
            .AnyAsync(fr =>
                fr.UserId == createdByUserId &&
                fr.FlatId == flatId);

        if (!isResidentOfFlat)
            throw new UnauthorizedAccessException(
                "You are not a resident of this flat.");

        var complaint = new Complaint
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = description,
            Priority = priority,
            Status = ComplaintStatus.Open,
            FlatId = flatId,
            CreatedByUserId = createdByUserId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Complaints.Add(complaint);
        await _context.SaveChangesAsync();

        return complaint.Id;
    }

    public async Task<List<object>> GetMyComplaintsAsync(Guid userId)
    {
        return await _context.Complaints
            .AsNoTracking()
            .Where(c => c.CreatedByUserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.Title,
                c.Description,
                c.Priority,
                c.Status,
                c.FlatId,
                c.AssignedStaffId,
                c.CreatedAt,
                c.AssignedAt,
                c.ResolvedAt,
                c.ClosedAt
            })
            .Cast<object>()
            .ToListAsync();
    }

    public async Task AssignComplaintAsync(
        Guid complaintId,
        Guid staffUserId)
    {
        var complaint = await _context.Complaints
            .FirstOrDefaultAsync(c => c.Id == complaintId);

        if (complaint is null)
            throw new KeyNotFoundException("Complaint not found.");

        if (complaint.Status != ComplaintStatus.Open)
            throw new InvalidOperationException(
                "Only open complaints can be assigned.");

        var staff = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == staffUserId);

        if (staff is null)
            throw new KeyNotFoundException("Staff user not found.");

        if (staff.Role != UserRole.MaintenanceStaff)
            throw new InvalidOperationException(
                "Selected user is not maintenance staff.");

        complaint.AssignedStaffId = staffUserId;
        complaint.AssignedAt = DateTime.UtcNow;
        complaint.Status = ComplaintStatus.Assigned;

        await _context.SaveChangesAsync();
    }

    public async Task UpdateComplaintStatusAsync(
        Guid complaintId,
        Guid userId,
        ComplaintStatus newStatus)
    {
        var complaint = await _context.Complaints
            .FirstOrDefaultAsync(c => c.Id == complaintId);

        if (complaint is null)
            throw new KeyNotFoundException("Complaint not found.");

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
            throw new KeyNotFoundException("User not found.");

        if (user.Role == UserRole.MaintenanceStaff)
        {
            if (complaint.AssignedStaffId != userId)
                throw new UnauthorizedAccessException(
                    "This complaint is not assigned to you.");

            if (newStatus != ComplaintStatus.InProgress &&
                newStatus != ComplaintStatus.Resolved)
            {
                throw new InvalidOperationException(
                    "Maintenance staff can only move complaints to InProgress or Resolved.");
            }
        }
        else if (user.Role == UserRole.Resident)
        {
            if (complaint.CreatedByUserId != userId)
                throw new UnauthorizedAccessException(
                    "You can only update your own complaints.");

            if (newStatus != ComplaintStatus.Closed)
                throw new InvalidOperationException(
                    "Residents can only close resolved complaints.");
        }
        else if (user.Role != UserRole.Admin)
        {
            throw new UnauthorizedAccessException(
                "You are not authorized to update complaints.");
        }

        if (newStatus == ComplaintStatus.InProgress &&
            complaint.Status != ComplaintStatus.Assigned)
        {
            throw new InvalidOperationException(
                "Complaint must be assigned before work can start.");
        }

        if (newStatus == ComplaintStatus.Resolved &&
            complaint.Status != ComplaintStatus.InProgress)
        {
            throw new InvalidOperationException(
                "Complaint must be in progress before it can be resolved.");
        }

        if (newStatus == ComplaintStatus.Closed &&
            complaint.Status != ComplaintStatus.Resolved)
        {
            throw new InvalidOperationException(
                "Only resolved complaints can be closed.");
        }

        complaint.Status = newStatus;

        if (newStatus == ComplaintStatus.Resolved)
            complaint.ResolvedAt = DateTime.UtcNow;

        if (newStatus == ComplaintStatus.Closed)
            complaint.ClosedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task<List<object>> GetAllComplaintsAsync()
    {
        return await _context.Complaints
            .AsNoTracking()
            .Include(c => c.Flat)
            .Include(c => c.CreatedByUser)
            .Include(c => c.AssignedStaff)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.Title,
                c.Description,
                c.Priority,
                c.Status,
                c.FlatId,
                FlatNumber = c.Flat.FlatNumber,
                CreatedByUserId = c.CreatedByUserId,
                CreatedBy = c.CreatedByUser.FullName,
                c.AssignedStaffId,
                AssignedStaff = c.AssignedStaff != null
                    ? c.AssignedStaff.FullName
                    : null,
                c.CreatedAt,
                c.AssignedAt,
                c.ResolvedAt,
                c.ClosedAt
            })
            .Cast<object>()
            .ToListAsync();
    }
}