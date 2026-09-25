using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocietyHub.Application.DTOs;
using SocietyHub.Application.Interfaces;

namespace SocietyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SocietyController : ControllerBase
{
    private readonly ISocietyService _societyService;

    public SocietyController(ISocietyService societyService)
    {
        _societyService = societyService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateSociety(
        CreateSocietyRequest request)
    {
        var societyId = await _societyService.CreateSocietyAsync(
            request.Name,
            request.Address,
            request.City,
            request.State,
            request.Pincode
        );

        return Ok(new
        {
            message = "Society created successfully.",
            societyId
        });
    }
}