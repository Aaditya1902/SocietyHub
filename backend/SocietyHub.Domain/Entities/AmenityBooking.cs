using SocietyHub.Domain.Enums;

namespace SocietyHub.Domain.Entities;

public class AmenityBooking
{
    public Guid Id { get; set; }

    public Guid AmenityId { get; set; }

    public Amenity Amenity { get; set; } = null!;

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public AmenityBookingStatus Status { get; set; }
        = AmenityBookingStatus.Confirmed;

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;
}