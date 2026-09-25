namespace SocietyHub.Application.Interfaces;

public interface IAmenityBookingService
{
    Task<Guid> CreateBookingAsync(
        Guid amenityId,
        Guid userId,
        DateTime startTime,
        DateTime endTime);

    Task<List<object>> GetMyBookingsAsync(Guid userId);

    Task<List<object>> GetAllBookingsAsync();

    Task CancelBookingAsync(
        Guid bookingId,
        Guid userId);
}