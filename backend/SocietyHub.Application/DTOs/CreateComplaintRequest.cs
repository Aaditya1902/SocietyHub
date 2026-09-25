namespace SocietyHub.Application.DTOs.Complaints;

public class CreateComplaintRequest
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int Priority { get; set; }

    public Guid FlatId { get; set; }
}