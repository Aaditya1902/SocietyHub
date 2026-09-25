using SocietyHub.Domain.Enums;

namespace SocietyHub.Domain.Entities;

public class Visitor
{
    public Guid Id { get; set; }

    public string VisitorName { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public Guid FlatId { get; set; }

    public Flat Flat { get; set; } = null!;

    public Guid CreatedByUserId { get; set; }

    public User CreatedByUser { get; set; } = null!;

    public DateTime ExpectedArrival { get; set; }

    public DateTime? ActualEntryTime { get; set; }

    public DateTime? ActualExitTime { get; set; }

    public VisitorStatus Status { get; set; }

    public Guid? ApprovedByUserId { get; set; }

    public User? ApprovedByUser { get; set; }

    public DateTime? ApprovalTime { get; set; }

    public string? QrCode { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}