namespace SocietyHub.Application.Interfaces;

public interface ITowerService
{
    Task<Guid> CreateTowerAsync(
        string name,
        Guid societyId);
}