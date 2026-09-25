namespace SocietyHub.Application.DTOs.MaintenanceBills;

public class CreateMaintenanceBillRequest
{
    public Guid FlatId { get; set; }

    public decimal Amount { get; set; }

    public string BillingMonth { get; set; } = string.Empty;

    public DateTime DueDate { get; set; }
}