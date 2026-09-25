namespace SocietyHub.Domain.Entities;

public class Flat
{
    public Guid Id { get; set; }

    public string FlatNumber { get; set; } = string.Empty;

    public Guid TowerId { get; set; }

    public Tower Tower { get; set; } = null!;

    public ICollection<FlatResident> Residents { get; set; }
        = new List<FlatResident>();
}