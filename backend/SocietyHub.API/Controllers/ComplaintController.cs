using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocietyHub.Application.DTOs.Complaints;
using SocietyHub.Application.Interfaces;
using SocietyHub.Domain.Enums;

namespace SocietyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComplaintController : ControllerBase
{
    private readonly IComplaintService _complaintService;

    public ComplaintController(IComplaintService complaintService)
    {
        _complaintService = complaintService;
    }

    [HttpPost]
    [Authorize(Roles = "Resident")]
    public async Task<IActionResult> CreateComplaint(
        [FromBody] CreateComplaintRequest request)
    {
        try
        {
            var userId = GetUserId();

            var complaintId = await _complaintService.CreateComplaintAsync(
                request.Title,
                request.Description,
                (ComplaintPriority)request.Priority,
                request.FlatId,
                userId);

            return Ok(new
            {
                message = "Complaint created successfully.",
                complaintId
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("my")]
    [Authorize(Roles = "Resident")]
    public async Task<IActionResult> GetMyComplaints()
    {
        var userId = GetUserId();

        var complaints =
            await _complaintService.GetMyComplaintsAsync(userId);

        return Ok(complaints);
    }

    [HttpGet]
    [Authorize(Roles = "Admin,MaintenanceStaff")]
    public async Task<IActionResult> GetAllComplaints()
    {
        var complaints =
            await _complaintService.GetAllComplaintsAsync();

        return Ok(complaints);
    }

    [HttpPut("{complaintId}/assign")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignComplaint(
        Guid complaintId,
        [FromBody] AssignComplaintRequest request)
    {
        try
        {
            await _complaintService.AssignComplaintAsync(
                complaintId,
                request.StaffUserId);

            return Ok(new
            {
                message = "Complaint assigned successfully."
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{complaintId}/status")]
    [Authorize(Roles = "Resident,MaintenanceStaff,Admin")]
    public async Task<IActionResult> UpdateStatus(
        Guid complaintId,
        [FromBody] UpdateComplaintStatusRequest request)
    {
        try
        {
            var userId = GetUserId();

            await _complaintService.UpdateComplaintStatusAsync(
                complaintId,
                userId,
                (ComplaintStatus)request.Status);

            return Ok(new
            {
                message = "Complaint status updated successfully."
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userId, out var parsedUserId))
            throw new UnauthorizedAccessException("Invalid user identity.");

        return parsedUserId;
    }
}