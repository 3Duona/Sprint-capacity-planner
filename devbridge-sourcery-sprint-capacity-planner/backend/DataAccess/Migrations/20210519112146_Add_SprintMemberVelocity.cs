using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.DataAccess.Migrations
{
    public partial class Add_SprintMemberVelocity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SprintMember",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SprintId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Velocity = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SprintMember", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SprintMember_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SprintMember_Sprints_SprintId",
                        column: x => x.SprintId,
                        principalTable: "Sprints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "SecurityStamp" },
                values: new object[] { "d2226e49-5294-46a8-8d23-b811c8ade160", "159120d6-92d3-4add-b6f4-97257b12664e" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "SecurityStamp" },
                values: new object[] { "d0f6a6c9-4ea1-44fe-b321-49fbedeebf47", "d2ffee5f-1957-48dd-a739-1e7e910310d5" });

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndDate", "StartDate" },
                values: new object[] { new DateTime(2021, 5, 25, 0, 0, 0, 0, DateTimeKind.Local), new DateTime(2021, 5, 19, 0, 0, 0, 0, DateTimeKind.Local) });

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "EndDate", "StartDate" },
                values: new object[] { new DateTime(2021, 5, 22, 0, 0, 0, 0, DateTimeKind.Local), new DateTime(2021, 5, 19, 0, 0, 0, 0, DateTimeKind.Local) });

            migrationBuilder.CreateIndex(
                name: "IX_SprintMember_SprintId",
                table: "SprintMember",
                column: "SprintId");

            migrationBuilder.CreateIndex(
                name: "IX_SprintMember_UserId",
                table: "SprintMember",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SprintMember");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "SecurityStamp" },
                values: new object[] { "913ec2ca-1874-4cf0-becc-b99dd8940c35", "ae9239c7-7c25-4ee5-a3c7-bc1443d0b071" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "SecurityStamp" },
                values: new object[] { "817250e1-9a28-4a89-94b0-ac38eeea2fae", "edf6fc8b-a795-4386-8779-7d5ad8c72531" });

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
        }
    }
}
