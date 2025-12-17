using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EsteticaRepositorio.Migrations
{
    /// <inheritdoc />
    public partial class seila : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_Users_UsuariosId",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_UserRoles_UsuariosId",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "UsuariosId",
                table: "UserRoles");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_Users_UserId",
                table: "UserRoles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_Users_UserId",
                table: "UserRoles");

            migrationBuilder.AddColumn<int>(
                name: "UsuariosId",
                table: "UserRoles",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UsuariosId",
                table: "UserRoles",
                column: "UsuariosId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_Users_UsuariosId",
                table: "UserRoles",
                column: "UsuariosId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
