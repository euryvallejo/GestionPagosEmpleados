using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GPE.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class update_login_data_fixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmpleadoAsalariadoPorComision_PrimerNombre",
                table: "Empleados");

            migrationBuilder.DropColumn(
                name: "EmpleadoPorComision_PrimerNombre",
                table: "Empleados");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Users",
                newName: "PasswordHash");

            // Drop the primary key constraint first
            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            // Drop the old Id column
            migrationBuilder.DropColumn(
                name: "Id",
                table: "Users");

            // Add the new Id column as Guid
            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "Users",
                type: "uniqueidentifier",
                nullable: false);

            // Recreate the primary key constraint
            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "Users",
                newName: "Email");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Users",
                type: "int",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier")
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<string>(
                name: "EmpleadoAsalariadoPorComision_PrimerNombre",
                table: "Empleados",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmpleadoPorComision_PrimerNombre",
                table: "Empleados",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
