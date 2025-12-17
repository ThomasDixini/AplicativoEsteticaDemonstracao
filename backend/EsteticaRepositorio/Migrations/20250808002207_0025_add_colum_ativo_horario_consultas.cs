using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EsteticaRepositorio.Migrations
{
    /// <inheritdoc />
    public partial class _0025_add_colum_ativo_horario_consultas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Ativo",
                table: "HorarioConsultas",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ativo",
                table: "HorarioConsultas");
        }
    }
}
