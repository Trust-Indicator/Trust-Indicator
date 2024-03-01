using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Trust_Indicator.Migrations
{
    /// <inheritdoc />
    public partial class createTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Favorites",
                columns: table => new
                {
                    RecordID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ImageID = table.Column<int>(type: "INTEGER", nullable: false),
                    UserID = table.Column<int>(type: "INTEGER", nullable: false),
                    Rate = table.Column<int>(type: "INTEGER", nullable: false),
                    Is_Favorite = table.Column<bool>(type: "INTEGER", nullable: false),
                    Comment = table.Column<string>(type: "TEXT", nullable: true),
                    Create_Date = table.Column<DateTime>(type: "TEXT", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Favorites", x => x.RecordID);
                });

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    ImageID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserID = table.Column<int>(type: "INTEGER", nullable: false),
                    ImageTitle = table.Column<string>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    ImageDescription = table.Column<string>(type: "TEXT", nullable: true),
                    UploadDate = table.Column<DateTime>(type: "TEXT", rowVersion: true, nullable: false),
                    Tag = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.ImageID);
                });

            migrationBuilder.CreateTable(
                name: "Metadata",
                columns: table => new
                {
                    ImageID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    File_Size = table.Column<int>(type: "INTEGER", nullable: false),
                    File_Type = table.Column<string>(type: "TEXT", nullable: false),
                    MIME_Type = table.Column<string>(type: "TEXT", nullable: false),
                    Create_Date = table.Column<DateTime>(type: "TEXT", rowVersion: true, nullable: false),
                    Modify_Date = table.Column<DateTime>(type: "TEXT", rowVersion: true, nullable: false),
                    Color_Space = table.Column<string>(type: "TEXT", nullable: false),
                    Make = table.Column<string>(type: "TEXT", nullable: false),
                    Model = table.Column<string>(type: "TEXT", nullable: false),
                    Lens = table.Column<string>(type: "TEXT", nullable: false),
                    Focal_Length = table.Column<float>(type: "REAL", nullable: false),
                    Aperture = table.Column<float>(type: "REAL", nullable: false),
                    Explosure = table.Column<float>(type: "REAL", nullable: false),
                    ISO = table.Column<int>(type: "INTEGER", nullable: false),
                    Flash = table.Column<string>(type: "TEXT", nullable: false),
                    Altitude = table.Column<float>(type: "REAL", nullable: false),
                    Latitude = table.Column<float>(type: "REAL", nullable: false),
                    Longitude = table.Column<float>(type: "REAL", nullable: false),
                    Software = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Metadata", x => x.ImageID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserName = table.Column<string>(type: "TEXT", nullable: true),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Password = table.Column<string>(type: "TEXT", nullable: false),
                    LegalName = table.Column<string>(type: "TEXT", nullable: false),
                    ProfilePhotoNO = table.Column<string>(type: "TEXT", nullable: true),
                    Is_Admin = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Favorites");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropTable(
                name: "Metadata");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
