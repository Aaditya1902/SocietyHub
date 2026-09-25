using SocietyHub.Domain.Enums;

namespace SocietyHub.Domain.Entities;

public class MaintenanceBill
{
    public Guid Id { get; set; }

    public Guid FlatId { get; set; }

    public Flat Flat { get; set; } = null!;

    public decimal Amount { get; set; }

    public string BillingMonth { get; set; } = string.Empty;

    public DateTime DueDate { get; set; }

    public BillStatus Status { get; set; } = BillStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? PaidAt { get; set; }
}