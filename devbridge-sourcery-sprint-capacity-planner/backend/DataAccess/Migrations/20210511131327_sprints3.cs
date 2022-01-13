using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.DataAccess.Migrations
{
    public partial class sprints3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "PlannedAverageVelocity",
                table: "Sprints",
                type: "float",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "ActualAverageVelocity",
                table: "Sprints",
                type: "float",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "a376816a-1a59-4f2a-b13b-267839e4fd52");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "64f93282-7eaf-4125-8e9d-9521f7bcd4cd");

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PlannedAverageVelocity",
                table: "Sprints",
                type: "int",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ActualAverageVelocity",
                table: "Sprints",
                type: "int",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);

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
                columns: new[] { "EndDate", "StartDate" },
                values: new object[] { new DateTime(2021, 5, 12, 0, 0, 0, 0, DateTimeKind.Local), new DateTime(2021, 5, 6, 0, 0, 0, 0, DateTimeKind.Local) });

            migrationBuilder.UpdateData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "EndDate", "StartDate" },
                values: new object[] { new DateTime(2021, 5, 9, 0, 0, 0, 0, DateTimeKind.Local), new DateTime(2021, 5, 6, 0, 0, 0, 0, DateTimeKind.Local) });
        }
    }
}
