using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EsteticaRepositorio.Migrations
{
    /// <inheritdoc />
    public partial class _0007_alter_columns_diaSemana : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiaDaSemana",
                table: "HorarioConsultas");

            migrationBuilder.AddColumn<DateTime>(
                name: "Data",
                table: "HorarioConsultas",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Data",
                table: "HorarioConsultas");

            migrationBuilder.AddColumn<string>(
                name: "DiaDaSemana",
                table: "HorarioConsultas",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
