namespace SocietyHub.Application.DTOs;

public class AssignResidentRequest
{
    public Guid UserId { get; set; }

    public Guid FlatId { get; set; }

    public int Relationship { get; set; }

    public bool IsPrimaryResident { get; set; }
}