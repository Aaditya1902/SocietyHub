using SocietyHub.Domain.Enums;

namespace SocietyHub.Application.Interfaces;

public interface IComplaintService
{
    Task<Guid> CreateComplaintAsync(
        string title,
        string description,
        ComplaintPriority priority,
        Guid flatId,
        Guid createdByUserId);

    Task<List<object>> GetMyComplaintsAsync(Guid userId);

    Task AssignComplaintAsync(
        Guid complaintId,
        Guid staffUserId);

    Task UpdateComplaintStatusAsync(
        Guid complaintId,
        Guid userId,
        ComplaintStatus newStatus);

    Task<List<object>> GetAllComplaintsAsync();
}