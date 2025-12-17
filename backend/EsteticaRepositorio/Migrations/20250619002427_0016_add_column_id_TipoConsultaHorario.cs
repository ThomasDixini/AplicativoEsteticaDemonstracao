using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EsteticaRepositorio.Migrations
{
    /// <inheritdoc />
    public partial class _0016_add_column_id_TipoConsultaHorario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "TipoConsultaHorarios",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "TipoConsultaHorarios");
        }
    }
}
