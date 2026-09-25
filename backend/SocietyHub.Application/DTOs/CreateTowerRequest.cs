namespace SocietyHub.Application.DTOs;

public class CreateTowerRequest
{
    public string Name { get; set; } = string.Empty;

    public Guid SocietyId { get; set; }
}