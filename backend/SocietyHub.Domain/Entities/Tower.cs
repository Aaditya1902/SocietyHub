namespace SocietyHub.Domain.Entities;

public class Tower
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public Guid SocietyId { get; set; }

    public Society Society { get; set; } = null!;

    public ICollection<Flat> Flats { get; set; } = new List<Flat>();
}