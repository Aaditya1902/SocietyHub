namespace SocietyHub.Application.Interfaces;

public interface IResidentService
{
    Task<Guid> AssignResidentToFlatAsync(
        Guid userId,
        Guid flatId,
        int relationship,
        bool isPrimaryResident);

    Task<List<object>> GetAllResidentsAsync();

    Task<int> GetResidentCountAsync();
}