namespace SocietyHub.Application.Interfaces;

public interface IMaintenanceBillService
{
    Task<Guid> CreateBillAsync(
        Guid flatId,
        decimal amount,
        string billingMonth,
        DateTime dueDate);

    Task<List<object>> GetMyBillsAsync(Guid userId);

    Task MarkBillAsPaidAsync(
        Guid billId,
        Guid userId);

    Task<List<object>> GetAllBillsAsync();
}