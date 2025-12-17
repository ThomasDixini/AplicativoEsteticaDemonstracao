using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EsteticaRepositorio.Migrations
{
    /// <inheritdoc />
    public partial class _0013_drop_columns_horarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HorarioConsultas_Consultas_ConsultaId",
                table: "HorarioConsultas");

            migrationBuilder.DropIndex(
                name: "IX_HorarioConsultas_ConsultaId",
                table: "HorarioConsultas");

            migrationBuilder.DropColumn(
                name: "ConsultaId",
                table: "HorarioConsultas");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConsultaId",
                table: "HorarioConsultas",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_HorarioConsultas_ConsultaId",
                table: "HorarioConsultas",
                column: "ConsultaId");

            migrationBuilder.AddForeignKey(
                name: "FK_HorarioConsultas_Consultas_ConsultaId",
                table: "HorarioConsultas",
                column: "ConsultaId",
                principalTable: "Consultas",
                principalColumn: "Id");
        }
    }
}
