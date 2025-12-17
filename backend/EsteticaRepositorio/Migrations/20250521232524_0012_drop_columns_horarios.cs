using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EsteticaRepositorio.Migrations
{
    /// <inheritdoc />
    public partial class _0012_drop_columns_horarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultas_HorarioConsultas_HorarioMarcadoId",
                table: "Consultas");

            migrationBuilder.DropIndex(
                name: "IX_Consultas_HorarioMarcadoId",
                table: "Consultas");

            migrationBuilder.DropColumn(
                name: "ImagemBase64",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "Reservado",
                table: "HorarioConsultas");

            migrationBuilder.DropColumn(
                name: "HorarioMarcadoId",
                table: "Consultas");

            migrationBuilder.AddColumn<int>(
                name: "ConsultaId",
                table: "HorarioConsultas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Data",
                table: "Consultas",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Fim",
                table: "Consultas",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Inicio",
                table: "Consultas",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.CreateTable(
                name: "TipoConsultaHorarios",
                columns: table => new
                {
                    TipoConsultaId = table.Column<int>(type: "int", nullable: false),
                    HorarioId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoConsultaHorarios", x => new { x.TipoConsultaId, x.HorarioId });
                    table.ForeignKey(
                        name: "FK_TipoConsultaHorarios_HorarioConsultas_HorarioId",
                        column: x => x.HorarioId,
                        principalTable: "HorarioConsultas",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TipoConsultaHorarios_TipoConsulta_TipoConsultaId",
                        column: x => x.TipoConsultaId,
                        principalTable: "TipoConsulta",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_HorarioConsultas_ConsultaId",
                table: "HorarioConsultas",
                column: "ConsultaId");

            migrationBuilder.CreateIndex(
                name: "IX_TipoConsultaHorarios_HorarioId",
                table: "TipoConsultaHorarios",
                column: "HorarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_HorarioConsultas_Consultas_ConsultaId",
                table: "HorarioConsultas",
                column: "ConsultaId",
                principalTable: "Consultas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HorarioConsultas_Consultas_ConsultaId",
                table: "HorarioConsultas");

            migrationBuilder.DropTable(
                name: "TipoConsultaHorarios");

            migrationBuilder.DropIndex(
                name: "IX_HorarioConsultas_ConsultaId",
                table: "HorarioConsultas");

            migrationBuilder.DropColumn(
                name: "ConsultaId",
                table: "HorarioConsultas");

            migrationBuilder.DropColumn(
                name: "Data",
                table: "Consultas");

            migrationBuilder.DropColumn(
                name: "Fim",
                table: "Consultas");

            migrationBuilder.DropColumn(
                name: "Inicio",
                table: "Consultas");

            migrationBuilder.AddColumn<string>(
                name: "ImagemBase64",
                table: "Produtos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Reservado",
                table: "HorarioConsultas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "HorarioMarcadoId",
                table: "Consultas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Consultas_HorarioMarcadoId",
                table: "Consultas",
                column: "HorarioMarcadoId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Consultas_HorarioConsultas_HorarioMarcadoId",
                table: "Consultas",
                column: "HorarioMarcadoId",
                principalTable: "HorarioConsultas",
                principalColumn: "Id");
        }
    }
}
