using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocietyHub.Application.DTOs.MaintenanceBills;
using SocietyHub.Application.Interfaces;

namespace SocietyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaintenanceBillController : ControllerBase
{
    private readonly IMaintenanceBillService _billService;

    public MaintenanceBillController(
        IMaintenanceBillService billService)
    {
        _billService = billService;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateBill(
        [FromBody] CreateMaintenanceBillRequest request)
    {
        try
        {
            var billId = await _billService.CreateBillAsync(
                request.FlatId,
                request.Amount,
                request.BillingMonth,
                request.DueDate);

            return Ok(new
            {
                message = "Maintenance bill created successfully.",
                billId
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

    [HttpGet("my")]
    [Authorize(Roles = "Resident")]
    public async Task<IActionResult> GetMyBills()
    {
        var userId = GetUserId();

        var bills = await _billService.GetMyBillsAsync(userId);

        return Ok(bills);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllBills()
    {
        var bills = await _billService.GetAllBillsAsync();

        return Ok(bills);
    }

    [HttpPut("{billId}/pay")]
    [Authorize(Roles = "Resident")]
    public async Task<IActionResult> PayBill(Guid billId)
    {
        try
        {
            var userId = GetUserId();

            await _billService.MarkBillAsPaidAsync(
                billId,
                userId);

            return Ok(new
            {
                message = "Maintenance bill paid successfully."
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

    private Guid GetUserId()
    {
        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userId, out var parsedUserId))
            throw new UnauthorizedAccessException(
                "Invalid user identity.");

        return parsedUserId;
    }
}