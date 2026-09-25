using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocietyHub.Application.DTOs;
using SocietyHub.Application.Interfaces;

namespace SocietyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResidentController : ControllerBase
{
    private readonly IResidentService _residentService;

    public ResidentController(IResidentService residentService)
    {
        _residentService = residentService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("assign")]
    public async Task<IActionResult> AssignResident(
        AssignResidentRequest request)
    {
        var residentId = await _residentService.AssignResidentToFlatAsync(
            request.UserId,
            request.FlatId,
            request.Relationship,
            request.IsPrimaryResident
        );

        return Ok(new
        {
            message = "Resident assigned to flat successfully.",
            residentId
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("count")]
    public async Task<IActionResult> GetResidentCount()
    {
        var count = await _residentService.GetResidentCountAsync();

        return Ok(new
        {
            count
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllResidents()
    {
        var residents = await _residentService.GetAllResidentsAsync();

        return Ok(residents);
    }
}