namespace SocietyHub.Application.DTOs;

public class CreateVisitorRequest
{
    public string VisitorName { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public Guid FlatId { get; set; }

    public DateTime ExpectedArrival { get; set; }
}