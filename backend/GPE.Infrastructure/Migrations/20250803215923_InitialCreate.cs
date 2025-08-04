using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GPE.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Empleados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApellidoPaterno = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumeroSeguroSocial = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TipoEmpleado = table.Column<string>(type: "nvarchar(21)", maxLength: 21, nullable: false),
                    PrimerNombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SalarioSemanal = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EmpleadoAsalariadoPorComision_PrimerNombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VentasBrutas = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TarifaComision = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SalarioBase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EmpleadoPorComision_PrimerNombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmpleadoPorComision_VentasBrutas = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EmpleadoPorComision_TarifaComision = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SueldoPorHora = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    HorasTrabajadas = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empleados", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Empleados");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
