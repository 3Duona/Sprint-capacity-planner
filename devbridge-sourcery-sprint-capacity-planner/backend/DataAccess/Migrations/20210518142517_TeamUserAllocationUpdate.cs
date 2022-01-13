using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.DataAccess.Migrations
{
    public partial class TeamUserAllocationUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Allocation",
                table: "TeamUsers",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Capacity",
                table: "TeamUsers",
                type: "float",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "LastName", "SecurityStamp", "TeamRole" },
                values: new object[] { "913ec2ca-1874-4cf0-becc-b99dd8940c35", "Veckys", "ae9239c7-7c25-4ee5-a3c7-bc1443d0b071", "QA" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "LastName", "SecurityStamp", "TeamRole" },
                values: new object[] { "817250e1-9a28-4a89-94b0-ac38eeea2fae", "Veckys", "edf6fc8b-a795-4386-8779-7d5ad8c72531", "FE" });

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndDate", "StartDate" },
                values: new object[] { new DateTime(2021, 5, 24, 0, 0, 0, 0, DateTimeKind.Local), new DateTime(2021, 5, 18, 0, 0, 0, 0, DateTimeKind.Local) });

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "EndDate", "StartDate" },
                values: new object[] { new DateTime(2021, 5, 21, 0, 0, 0, 0, DateTimeKind.Local), new DateTime(2021, 5, 18, 0, 0, 0, 0, DateTimeKind.Local) });

            migrationBuilder.UpdateData(
                table: "TeamUsers",
                keyColumns: new[] { "TeamId", "UserId" },
                keyValues: new object[] { 1, 1 },
                column: "Capacity",
                value: 3.0);

            migrationBuilder.UpdateData(
                table: "TeamUsers",
                keyColumns: new[] { "TeamId", "UserId" },
                keyValues: new object[] { 1, 2 },
                columns: new[] { "Allocation", "Capacity" },
                values: new object[] { 1.0, 3.5 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Allocation",
                table: "TeamUsers");

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "TeamUsers");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "LastName", "SecurityStamp", "TeamRole" },
                values: new object[] { "e18ffa43-fb7d-48d5-aa94-f709e93bc733", null, "a142a290-078b-4edc-9e6e-bfb2257d708a", null });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "LastName", "SecurityStamp", "TeamRole" },
                values: new object[] { "b446651d-2083-4835-99df-f7357212a2f0", null, "f10fbd28-b089-49a9-8460-c8eb41e51b50", null });

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndDate", "StartDate" },
                values: new object[] { new DateTime(2021, 5, 19, 0, 0, 0, 0, DateTimeKind.Local), new DateTime(2021, 5, 13, 0, 0, 0, 0, DateTimeKind.Local) });

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "EndDate", "StartDate" },
                values: new object[] { new DateTime(2021, 5, 16, 0, 0, 0, 0, DateTimeKind.Local), new DateTime(2021, 5, 13, 0, 0, 0, 0, DateTimeKind.Local) });
        }
    }
}
