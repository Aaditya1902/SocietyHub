using SocietyHub.Application.DTOs;

namespace SocietyHub.Application.Interfaces;

public interface IAuthService
{
    Task<string> RegisterAsync(RegisterRequest request);

    Task<string> LoginAsync(LoginRequest request);

    Task<Guid> CreateMaintenanceStaffAsync(CreateStaffRequest request);
}