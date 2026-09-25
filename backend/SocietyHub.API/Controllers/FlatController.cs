using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocietyHub.Application.DTOs;
using SocietyHub.Application.Interfaces;

namespace SocietyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlatController : ControllerBase
{
    private readonly IFlatService _flatService;

    public FlatController(IFlatService flatService)
    {
        _flatService = flatService;
    }

    [Authorize(Roles = "Admin")]
[HttpPost]
public async Task<IActionResult> CreateFlat(
    CreateFlatRequest request)
{
    try
    {
        var flatId = await _flatService.CreateFlatAsync(
            request.FlatNumber,
            request.TowerId
        );

        return Ok(new
        {
            message = "Flat created successfully.",
            flatId
        });
    }
    catch (KeyNotFoundException ex)
    {
        return NotFound(new
        {
            message = ex.Message
        });
    }
    catch (InvalidOperationException ex)
    {
        return Conflict(new
        {
            message = ex.Message
        });
    }
}

[Authorize]
[HttpGet("tower/{towerId}")]
public async Task<IActionResult> GetFlatsByTower(Guid towerId)
{
    var flats = await _flatService.GetFlatsByTowerAsync(towerId);

    return Ok(flats);
}
}