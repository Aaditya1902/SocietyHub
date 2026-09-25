namespace SocietyHub.Application.Interfaces;

public interface ISocietyService
{
    Task<Guid> CreateSocietyAsync(
        string name,
        string address,
        string city,
        string state,
        string pincode);
}