using Microsoft.EntityFrameworkCore;
using SocietyHub.Application.DTOs;
using SocietyHub.Application.Interfaces;
using SocietyHub.Domain.Entities;
using SocietyHub.Domain.Enums;
using SocietyHub.Infrastructure.Data;

namespace SocietyHub.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
    ApplicationDbContext context,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService)
{
    _context = context;
    _passwordHasher = passwordHasher;
    _jwtTokenService = jwtTokenService;
}

    public async Task<string> RegisterAsync(RegisterRequest request)
{
    var existingUser = await _context.Users
        .FirstOrDefaultAsync(user => user.Email == request.Email);

    if (existingUser is not null)
    {
        throw new InvalidOperationException("A user with this email already exists.");
    }

    var user = new User
    {
        Id = Guid.NewGuid(),
        FullName = request.FullName,
        Email = request.Email,
        PhoneNumber = request.PhoneNumber,
        PasswordHash = _passwordHasher.Hash(request.Password),
        Role = UserRole.Resident
    };

    _context.Users.Add(user);

    await _context.SaveChangesAsync();

    return "User registered successfully.";
}

    public async Task<string> LoginAsync(LoginRequest request)
{
    var user = await _context.Users
        .FirstOrDefaultAsync(user => user.Email == request.Email);

    if (user is null)
    {
        throw new UnauthorizedAccessException("Invalid email or password.");
    }

    var passwordIsValid = _passwordHasher.Verify(
        request.Password,
        user.PasswordHash
    );

    if (!passwordIsValid)
    {
        throw new UnauthorizedAccessException("Invalid email or password.");
    }

    var token = _jwtTokenService.GenerateToken(
        user.Id,
        user.Email,
        user.Role.ToString()
    );

    return token;
}

public async Task<Guid> CreateMaintenanceStaffAsync(
    CreateStaffRequest request)
{
    var existingUser = await _context.Users
        .FirstOrDefaultAsync(user => user.Email == request.Email);

    if (existingUser is not null)
    {
        throw new InvalidOperationException(
            "A user with this email already exists.");
    }

    var user = new User
    {
        Id = Guid.NewGuid(),
        FullName = request.FullName,
        Email = request.Email,
        PhoneNumber = request.PhoneNumber,
        PasswordHash = _passwordHasher.Hash(request.Password),
        Role = UserRole.MaintenanceStaff,
        CreatedAt = DateTime.UtcNow,
        IsActive = true
    };

    _context.Users.Add(user);

    await _context.SaveChangesAsync();

    return user.Id;
}
}