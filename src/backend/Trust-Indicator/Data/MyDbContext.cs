using Microsoft.EntityFrameworkCore;
using Trust_Indicator.Model;

namespace Trust_Indicator.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        // DbSet<TEntity> property for each table
        public DbSet<User> Users { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Metadata> Metadata { get; set; }
        public DbSet<Image> Images { get; set; }

        // connect to DB, use SQLite as DB
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=MyDatabase.sqlite");
        }

    }
}
