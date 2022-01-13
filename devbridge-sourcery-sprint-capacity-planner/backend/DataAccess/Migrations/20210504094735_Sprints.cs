using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.DataAccess.Migrations
{
    public partial class Sprints : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamUsers_AspNetUsers_UserID",
                table: "TeamUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamUsers_Teams_TeamID",
                table: "TeamUsers");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "TeamUsers",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "TeamID",
                table: "TeamUsers",
                newName: "TeamId");

            migrationBuilder.RenameIndex(
                name: "IX_TeamUsers_UserID",
                table: "TeamUsers",
                newName: "IX_TeamUsers_UserId");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Teams",
                newName: "Id");

            migrationBuilder.CreateTable(
                name: "Sprints",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TeamId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DefaultLength = table.Column<int>(type: "int", nullable: false),
                    ActualLength = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PlannedAverageVelocity = table.Column<int>(type: "int", nullable: true),
                    ActualAverageVelocity = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sprints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sprints_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "b07ac682-717e-42d0-b22a-27f1b1155148");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "aaab103d-c01e-4fa8-80dd-52610d10a673");

            migrationBuilder.InsertData(
                table: "Sprints",
                columns: new[] { "Id", "ActualAverageVelocity", "ActualLength", "DefaultLength", "EndDate", "PlannedAverageVelocity", "StartDate", "TeamId", "Title" },
                values: new object[,]
                {
                    { 1, 0, 6, 5, DateTime.Today, 0, DateTime.Today.AddDays(6), 1, "First sprint" },
                    { 2, 0, 3, 3, DateTime.Today, 0, DateTime.Today.AddDays(3), 1, "Second sprint" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sprints_TeamId",
                table: "Sprints",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamUsers_AspNetUsers_UserId",
                table: "TeamUsers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamUsers_Teams_TeamId",
                table: "TeamUsers",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamUsers_AspNetUsers_UserId",
                table: "TeamUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamUsers_Teams_TeamId",
                table: "TeamUsers");

            migrationBuilder.DropTable(
                name: "Sprints");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "TeamUsers",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "TeamId",
                table: "TeamUsers",
                newName: "TeamID");

            migrationBuilder.RenameIndex(
                name: "IX_TeamUsers_UserId",
                table: "TeamUsers",
                newName: "IX_TeamUsers_UserID");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Teams",
                newName: "ID");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "8ded4096-d0b4-4ba7-9af4-b59e44eaa6ed");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "f10369b7-e4d3-4f7c-a6dc-f71b9fa1f7fa");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamUsers_AspNetUsers_UserID",
                table: "TeamUsers",
                column: "UserID",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamUsers_Teams_TeamID",
                table: "TeamUsers",
                column: "TeamID",
                principalTable: "Teams",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
