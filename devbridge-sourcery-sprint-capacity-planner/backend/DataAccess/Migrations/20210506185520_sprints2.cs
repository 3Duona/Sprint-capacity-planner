using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.DataAccess.Migrations
{
    public partial class sprints2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PlannedAverageVelocity",
                table: "Sprints",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "ActualAverageVelocity",
                table: "Sprints",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "608fecc0-e045-4e34-918d-c9013335f586");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "d3be6870-4978-4c41-b9b1-decc9ec50a6f");

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ActualAverageVelocity", "EndDate", "PlannedAverageVelocity", "StartDate" },
                values: new object[] { null, new DateTime(2021, 5, 12, 0, 0, 0, 0, DateTimeKind.Local), null, new DateTime(2021, 5, 6, 0, 0, 0, 0, DateTimeKind.Local) });

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ActualAverageVelocity", "EndDate", "PlannedAverageVelocity", "StartDate" },
                values: new object[] { null, new DateTime(2021, 5, 9, 0, 0, 0, 0, DateTimeKind.Local), null, new DateTime(2021, 5, 6, 0, 0, 0, 0, DateTimeKind.Local) });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PlannedAverageVelocity",
                table: "Sprints",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ActualAverageVelocity",
                table: "Sprints",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

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

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ActualAverageVelocity", "EndDate", "PlannedAverageVelocity", "StartDate" },
                values: new object[] { 0, new DateTime(1, 1, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ActualAverageVelocity", "EndDate", "PlannedAverageVelocity", "StartDate" },
                values: new object[] { 0, new DateTime(1, 1, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });
        }
    }
}
