using SocietyHub.Domain.Enums;

namespace SocietyHub.Domain.Entities;

public class FlatResident
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public Guid FlatId { get; set; }

    public Flat Flat { get; set; } = null!;

    public ResidentRelationship Relationship { get; set; }

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    public bool IsPrimaryResident { get; set; }
}