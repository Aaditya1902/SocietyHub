using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocietyHub.Application.DTOs;
using SocietyHub.Application.Interfaces;

namespace SocietyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TowerController : ControllerBase
{
    private readonly ITowerService _towerService;

    public TowerController(ITowerService towerService)
    {
        _towerService = towerService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateTower(
        CreateTowerRequest request)
    {
        var towerId = await _towerService.CreateTowerAsync(
            request.Name,
            request.SocietyId
        );

        return Ok(new
        {
            message = "Tower created successfully.",
            towerId
        });
    }
}