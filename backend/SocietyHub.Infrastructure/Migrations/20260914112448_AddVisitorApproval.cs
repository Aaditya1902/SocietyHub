using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocietyHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVisitorApproval : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovalTime",
                table: "Visitors",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ApprovedByUserId",
                table: "Visitors",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Visitors_ApprovedByUserId",
                table: "Visitors",
                column: "ApprovedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Visitors_Users_ApprovedByUserId",
                table: "Visitors",
                column: "ApprovedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visitors_Users_ApprovedByUserId",
                table: "Visitors");

            migrationBuilder.DropIndex(
                name: "IX_Visitors_ApprovedByUserId",
                table: "Visitors");

            migrationBuilder.DropColumn(
                name: "ApprovalTime",
                table: "Visitors");

            migrationBuilder.DropColumn(
                name: "ApprovedByUserId",
                table: "Visitors");
        }
    }
}
