namespace SocietyHub.Application.Interfaces;

public interface IVisitorService
{
    Task<Guid> CreateVisitorAsync(
        string visitorName,
        string phoneNumber,
        Guid flatId,
        Guid createdByUserId,
        DateTime expectedArrival);

    Task<List<object>> GetMyVisitorsAsync(Guid userId);

    Task ApproveOrRejectVisitorAsync(
        Guid visitorId,
        Guid residentUserId,
        bool approved);

    Task<string> GenerateQrCodeAsync(
        Guid visitorId,
        Guid userId);

    Task MarkVisitorEntryAsync(
        string qrCode,
        Guid securityUserId);

    Task MarkVisitorExitAsync(
        string qrCode,
        Guid securityUserId);
}