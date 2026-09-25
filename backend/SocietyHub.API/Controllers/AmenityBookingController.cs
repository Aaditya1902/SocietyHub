using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocietyHub.Application.Interfaces;

namespace SocietyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AmenityBookingController : ControllerBase
{
    private readonly IAmenityBookingService _bookingService;

    public AmenityBookingController(
        IAmenityBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
[Authorize(Roles = "Resident")]
public async Task<IActionResult> CreateBooking(
    Guid amenityId,
    DateTimeOffset startTime,
    DateTimeOffset endTime)
{
        try
        {
            var userId = GetUserId();

            var bookingId =
    await _bookingService.CreateBookingAsync(
        amenityId,
        userId,
        startTime.UtcDateTime,
        endTime.UtcDateTime);

            return Ok(new
            {
                message = "Amenity booked successfully.",
                bookingId
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("my")]
    [Authorize(Roles = "Resident")]
    public async Task<IActionResult> GetMyBookings()
    {
        var userId = GetUserId();

        var bookings =
            await _bookingService.GetMyBookingsAsync(userId);

        return Ok(bookings);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllBookings()
    {
        var bookings =
            await _bookingService.GetAllBookingsAsync();

        return Ok(bookings);
    }

    [HttpPut("{bookingId}/cancel")]
    [Authorize(Roles = "Resident")]
    public async Task<IActionResult> CancelBooking(
        Guid bookingId)
    {
        try
        {
            var userId = GetUserId();

            await _bookingService.CancelBookingAsync(
                bookingId,
                userId);

            return Ok(new
            {
                message = "Booking cancelled successfully."
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    private Guid GetUserId()
    {
        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userId, out var parsedUserId))
            throw new UnauthorizedAccessException(
                "Invalid user identity.");

        return parsedUserId;
    }
}