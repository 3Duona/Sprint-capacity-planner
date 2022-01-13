using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.DataAccess.Migrations
{
    public partial class daysOffModelChanged : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TeamRole",
                table: "AspNetUsers",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "DaysOff",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StartDate = table.Column<DateTime>(type: "datetime2", maxLength: 50, nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", maxLength: 50, nullable: false),
                    DaysCount = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DaysOff", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DaysOff_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "SecurityStamp", "UserName" },
                values: new object[] { "e18ffa43-fb7d-48d5-aa94-f709e93bc733", "a142a290-078b-4edc-9e6e-bfb2257d708a", "Lukas" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "SecurityStamp", "UserName" },
                values: new object[] { "b446651d-2083-4835-99df-f7357212a2f0", "f10fbd28-b089-49a9-8460-c8eb41e51b50", "Paulius" });

            migrationBuilder.InsertData(
                table: "DaysOff",
                columns: new[] { "Id", "DaysCount", "EndDate", "Reason", "StartDate", "UserId" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2021, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Luko diena", new DateTime(2021, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 1 },
                    { 2, 2, new DateTime(2021, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pauliaus diena", new DateTime(2021, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 2 }
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_DaysOff_UserId",
                table: "DaysOff",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DaysOff");

            migrationBuilder.AlterColumn<string>(
                name: "TeamRole",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "SecurityStamp", "UserName" },
                values: new object[] { "a376816a-1a59-4f2a-b13b-267839e4fd52", null, null });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "SecurityStamp", "UserName" },
                values: new object[] { "64f93282-7eaf-4125-8e9d-9521f7bcd4cd", null, null });

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndDate", "StartDate" },
                values: new object[] { new DateTime(2021, 5, 17, 0, 0, 0, 0, DateTimeKind.Local), new DateTime(2021, 5, 11, 0, 0, 0, 0, DateTimeKind.Local) });

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "EndDate", "StartDate" },
                values: new object[] { new DateTime(2021, 5, 14, 0, 0, 0, 0, DateTimeKind.Local), new DateTime(2021, 5, 11, 0, 0, 0, 0, DateTimeKind.Local) });
        }
    }
}
