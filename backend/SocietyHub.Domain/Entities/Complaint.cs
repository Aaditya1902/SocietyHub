using SocietyHub.Domain.Enums;

namespace SocietyHub.Domain.Entities;

public class Complaint
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public ComplaintPriority Priority { get; set; }

    public ComplaintStatus Status { get; set; } = ComplaintStatus.Open;

    public Guid FlatId { get; set; }

    public Flat Flat { get; set; } = null!;

    public Guid CreatedByUserId { get; set; }

    public User CreatedByUser { get; set; } = null!;

    public Guid? AssignedStaffId { get; set; }

    public User? AssignedStaff { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? AssignedAt { get; set; }

    public DateTime? ResolvedAt { get; set; }

    public DateTime? ClosedAt { get; set; }
}