using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EsteticaRepositorio.Migrations
{
    /// <inheritdoc />
    public partial class notification_token : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NotificacaoToken",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotificacaoToken",
                table: "Users");
        }
    }
}
