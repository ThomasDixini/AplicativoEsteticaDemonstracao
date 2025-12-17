using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EsteticaRepositorio.Migrations
{
    /// <inheritdoc />
    public partial class _0010_add_table_tipoProdutos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TipoProdutosId",
                table: "Produtos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TipoProdutos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoProdutos", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Produtos_TipoProdutosId",
                table: "Produtos",
                column: "TipoProdutosId");

            migrationBuilder.AddForeignKey(
                name: "FK_Produtos_TipoProdutos_TipoProdutosId",
                table: "Produtos",
                column: "TipoProdutosId",
                principalTable: "TipoProdutos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Produtos_TipoProdutos_TipoProdutosId",
                table: "Produtos");

            migrationBuilder.DropTable(
                name: "TipoProdutos");

            migrationBuilder.DropIndex(
                name: "IX_Produtos_TipoProdutosId",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "TipoProdutosId",
                table: "Produtos");
        }
    }
}
