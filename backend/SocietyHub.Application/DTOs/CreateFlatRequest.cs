namespace SocietyHub.Application.DTOs;

public class CreateFlatRequest
{
    public string FlatNumber { get; set; } = string.Empty;

    public Guid TowerId { get; set; }
}