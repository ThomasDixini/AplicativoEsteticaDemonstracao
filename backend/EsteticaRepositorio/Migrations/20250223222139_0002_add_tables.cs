using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EsteticaRepositorio.Migrations
{
    /// <inheritdoc />
    public partial class _0002_add_tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TipoConsultaId",
                table: "Consultas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Produtos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UnidadeMedida = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    ValorDeVenda = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ValorDeCusto = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EstimativaEntrega = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Produtos", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Consultas_TipoConsultaId",
                table: "Consultas",
                column: "TipoConsultaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Consultas_TipoConsulta_TipoConsultaId",
                table: "Consultas",
                column: "TipoConsultaId",
                principalTable: "TipoConsulta",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultas_TipoConsulta_TipoConsultaId",
                table: "Consultas");

            migrationBuilder.DropTable(
                name: "Produtos");

            migrationBuilder.DropIndex(
                name: "IX_Consultas_TipoConsultaId",
                table: "Consultas");

            migrationBuilder.DropColumn(
                name: "TipoConsultaId",
                table: "Consultas");
        }
    }
}
