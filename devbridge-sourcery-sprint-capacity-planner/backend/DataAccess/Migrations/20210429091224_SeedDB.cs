using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.DataAccess.Migrations
{
    public partial class SeedDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "Team", "TeamRole", "TwoFactorEnabled", "UserName" },
                values: new object[] { 1, 0, "8ded4096-d0b4-4ba7-9af4-b59e44eaa6ed", null, false, "Lukas", null, false, null, null, null, null, null, false, null, null, null, false, null });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "Team", "TeamRole", "TwoFactorEnabled", "UserName" },
                values: new object[] { 2, 0, "f10369b7-e4d3-4f7c-a6dc-f71b9fa1f7fa", null, false, "Paulius", null, false, null, null, null, null, null, false, null, null, null, false, null });

            migrationBuilder.InsertData(
                table: "Teams",
                columns: new[] { "ID", "Title" },
                values: new object[] { 1, "Komanda 69" });

            migrationBuilder.InsertData(
                table: "TeamUsers",
                columns: new[] { "TeamID", "UserID" },
                values: new object[] { 1, 1 });

            migrationBuilder.InsertData(
                table: "TeamUsers",
                columns: new[] { "TeamID", "UserID" },
                values: new object[] { 1, 2 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TeamUsers",
                keyColumns: new[] { "TeamID", "UserID" },
                keyValues: new object[] { 1, 1 });

            migrationBuilder.DeleteData(
                table: "TeamUsers",
                keyColumns: new[] { "TeamID", "UserID" },
                keyValues: new object[] { 1, 2 });

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Teams",
                keyColumn: "ID",
                keyValue: 1);
        }
    }
}
