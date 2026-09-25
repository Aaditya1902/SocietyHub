namespace SocietyHub.Application.Interfaces;

public interface IFlatService
{
    Task<Guid> CreateFlatAsync(
        string flatNumber,
        Guid towerId);

    Task<List<object>> GetFlatsByTowerAsync(
        Guid towerId);
}