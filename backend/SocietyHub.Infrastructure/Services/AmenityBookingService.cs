using Microsoft.EntityFrameworkCore;
using SocietyHub.Application.Interfaces;
using SocietyHub.Domain.Entities;
using SocietyHub.Domain.Enums;
using SocietyHub.Infrastructure.Data;

namespace SocietyHub.Infrastructure.Services;

public class AmenityBookingService : IAmenityBookingService
{
    private readonly ApplicationDbContext _context;

    public AmenityBookingService(ApplicationDbContext context)
    {
        _context = context;
    }



    public async Task<Guid> CreateBookingAsync(
        Guid amenityId,
        Guid userId,
        DateTime startTime,
        DateTime endTime)
    {

        startTime = DateTime.SpecifyKind(startTime, DateTimeKind.Utc);
        endTime = DateTime.SpecifyKind(endTime, DateTimeKind.Utc);

        Console.WriteLine($"DEBUG START: {startTime:o} | Kind: {startTime.Kind}");
        Console.WriteLine($"DEBUG END:   {endTime:o} | Kind: {endTime.Kind}");


        if (startTime >= endTime)
        {
            throw new InvalidOperationException(
                "Start time must be before end time.");
        }

        var amenity = await _context.Amenities
            .FirstOrDefaultAsync(a =>
                a.Id == amenityId &&
                a.IsActive);

        if (amenity is null)
        {
            throw new KeyNotFoundException(
                "Amenity not found or inactive.");
        }

        var userExists = await _context.Users
            .AnyAsync(u => u.Id == userId);

        if (!userExists)
        {
            throw new KeyNotFoundException("User not found.");
        }

        var hasOverlap = await _context.AmenityBookings
            .AnyAsync(booking =>
                booking.AmenityId == amenityId &&
                booking.Status == AmenityBookingStatus.Confirmed &&
                booking.StartTime < endTime &&
                booking.EndTime > startTime);

        if (hasOverlap)
        {
            throw new InvalidOperationException(
                "The selected amenity is already booked for this time slot.");
        }

        var booking = new AmenityBooking
        {
            Id = Guid.NewGuid(),
            AmenityId = amenityId,
            UserId = userId,
            StartTime = startTime,
            EndTime = endTime,
            Status = AmenityBookingStatus.Confirmed,
            CreatedAt = DateTime.UtcNow
        };

        _context.AmenityBookings.Add(booking);

        await _context.SaveChangesAsync();

        return booking.Id;
    }

    public async Task<List<object>> GetMyBookingsAsync(Guid userId)
    {
        return await _context.AmenityBookings
            .AsNoTracking()
            .Include(booking => booking.Amenity)
            .Where(booking => booking.UserId == userId)
            .OrderByDescending(booking => booking.StartTime)
            .Select(booking => new
            {
                booking.Id,
                booking.AmenityId,
                AmenityName = booking.Amenity.Name,
                booking.StartTime,
                booking.EndTime,
                booking.Status,
                booking.CreatedAt
            })
            .Cast<object>()
            .ToListAsync();
    }

    public async Task<List<object>> GetAllBookingsAsync()
    {
        return await _context.AmenityBookings
            .AsNoTracking()
            .Include(booking => booking.Amenity)
            .Include(booking => booking.User)
            .OrderByDescending(booking => booking.StartTime)
            .Select(booking => new
            {
                booking.Id,
                booking.AmenityId,
                AmenityName = booking.Amenity.Name,
                booking.UserId,
                UserName = booking.User.FullName,
                booking.StartTime,
                booking.EndTime,
                booking.Status,
                booking.CreatedAt
            })
            .Cast<object>()
            .ToListAsync();
    }

    public async Task CancelBookingAsync(
        Guid bookingId,
        Guid userId)
    {
        var booking = await _context.AmenityBookings
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking is null)
        {
            throw new KeyNotFoundException(
                "Booking not found.");
        }

        if (booking.UserId != userId)
        {
            throw new UnauthorizedAccessException(
                "You can only cancel your own booking.");
        }

        if (booking.Status == AmenityBookingStatus.Cancelled)
        {
            throw new InvalidOperationException(
                "Booking is already cancelled.");
        }

        booking.Status = AmenityBookingStatus.Cancelled;

        await _context.SaveChangesAsync();
    }
}