using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EsteticaRepositorio.Migrations
{
    /// <inheritdoc />
    public partial class _0003_add_table_HorarioConsultas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HorarioMarcado",
                table: "Consultas");

            migrationBuilder.AlterColumn<decimal>(
                name: "ValorAtual",
                table: "TipoConsulta",
                type: "NUMERIC(18,2)",
                precision: 16,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "ValorDeVenda",
                table: "Produtos",
                type: "NUMERIC(18,2)",
                precision: 16,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "ValorDeCusto",
                table: "Produtos",
                type: "NUMERIC(18,2)",
                precision: 16,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Valor",
                table: "Consultas",
                type: "NUMERIC(18,2)",
                precision: 16,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AddColumn<int>(
                name: "HorarioMarcadoId",
                table: "Consultas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "HorarioConsultas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Inicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Fim = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Reservado = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HorarioConsultas", x => x.Id);
                });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultas_HorarioConsultas_HorarioMarcadoId",
                table: "Consultas");

            migrationBuilder.DropTable(
                name: "HorarioConsultas");

            migrationBuilder.DropIndex(
                name: "IX_Consultas_HorarioMarcadoId",
                table: "Consultas");

            migrationBuilder.DropColumn(
                name: "HorarioMarcadoId",
                table: "Consultas");

            migrationBuilder.AlterColumn<decimal>(
                name: "ValorAtual",
                table: "TipoConsulta",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "NUMERIC(18,2)",
                oldPrecision: 16,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ValorDeVenda",
                table: "Produtos",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "NUMERIC(18,2)",
                oldPrecision: 16,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ValorDeCusto",
                table: "Produtos",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "NUMERIC(18,2)",
                oldPrecision: 16,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Valor",
                table: "Consultas",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "NUMERIC(18,2)",
                oldPrecision: 16,
                oldScale: 2);

            migrationBuilder.AddColumn<DateTime>(
                name: "HorarioMarcado",
                table: "Consultas",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
