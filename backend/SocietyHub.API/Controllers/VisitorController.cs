using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocietyHub.Application.DTOs;
using SocietyHub.Application.Interfaces;
using System.Security.Claims;

namespace SocietyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VisitorController : ControllerBase
{
    private readonly IVisitorService _visitorService;

    public VisitorController(IVisitorService visitorService)
    {
        _visitorService = visitorService;
    }

    [Authorize(Roles = "Resident")]
    [HttpPost]
    public async Task<IActionResult> CreateVisitor(
        CreateVisitorRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        try
        {
            var visitorId = await _visitorService.CreateVisitorAsync(
                request.VisitorName,
                request.PhoneNumber,
                request.FlatId,
                userId,
                request.ExpectedArrival
            );

            return Ok(new
            {
                message = "Visitor created successfully.",
                visitorId
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize(Roles = "Resident")]
[HttpGet("my")]
public async Task<IActionResult> GetMyVisitors()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (!Guid.TryParse(userIdClaim, out var userId))
    {
        return Unauthorized(new
        {
            message = "Invalid user identity."
        });
    }

    var visitors = await _visitorService.GetMyVisitorsAsync(userId);

    return Ok(visitors);
}

    [Authorize(Roles = "Resident")]
[HttpPut("{visitorId}/approval")]
public async Task<IActionResult> ApproveOrRejectVisitor(
    Guid visitorId,
    VisitorApprovalRequest request)
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (!Guid.TryParse(userIdClaim, out var userId))
    {
        return Unauthorized(new
        {
            message = "Invalid user identity."
        });
    }

    try
    {
        await _visitorService.ApproveOrRejectVisitorAsync(
            visitorId,
            userId,
            request.Approved
        );

        return Ok(new
        {
            message = request.Approved
                ? "Visitor approved successfully."
                : "Visitor rejected successfully."
        });
    }
    catch (KeyNotFoundException ex)
    {
        return NotFound(new
        {
            message = ex.Message
        });
    }
    catch (UnauthorizedAccessException)
{
    return Forbid();
}
    catch (InvalidOperationException ex)
    {
        return Conflict(new
        {
            message = ex.Message
        });
    }
}

[Authorize(Roles = "Resident")]
[HttpPost("{visitorId}/qr")]
public async Task<IActionResult> GenerateQrCode(
    Guid visitorId)
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (!Guid.TryParse(userIdClaim, out var userId))
    {
        return Unauthorized(new
        {
            message = "Invalid user identity."
        });
    }

    try
    {
        var token = await _visitorService.GenerateQrCodeAsync(
            visitorId,
            userId);

        return Ok(new
        {
            message = "QR code generated successfully.",
            visitorId,
            qrCode = token
        });
    }
    catch (KeyNotFoundException ex)
    {
        return NotFound(new
        {
            message = ex.Message
        });
    }
    catch (UnauthorizedAccessException)
    {
        return Forbid();
    }
    catch (InvalidOperationException ex)
    {
        return Conflict(new
        {
            message = ex.Message
        });
    }
}

[Authorize(Roles = "SecurityGuard,Admin")]
[HttpPost("entry")]
public async Task<IActionResult> MarkVisitorEntry(
    VisitorQrRequest request)
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (!Guid.TryParse(userIdClaim, out var userId))
    {
        return Unauthorized(new
        {
            message = "Invalid user identity."
        });
    }

    try
    {
        await _visitorService.MarkVisitorEntryAsync(
            request.QrCode,
            userId);

        return Ok(new
        {
            message = "Visitor entry recorded successfully."
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

[Authorize(Roles = "SecurityGuard,Admin")]
[HttpPost("exit")]
public async Task<IActionResult> MarkVisitorExit(
    VisitorQrRequest request)
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (!Guid.TryParse(userIdClaim, out var userId))
    {
        return Unauthorized(new
        {
            message = "Invalid user identity."
        });
    }

    try
    {
        await _visitorService.MarkVisitorExitAsync(
            request.QrCode,
            userId);

        return Ok(new
        {
            message = "Visitor exit recorded successfully."
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
}