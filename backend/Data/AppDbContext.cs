using MeuTodo.Models;
using Microsoft.EntityFrameworkCore;

namespace MeuTodo.Data;

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
       
        // Definindo as tabelas do banco de dados no plural (Pessoas e Transacoes)
        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

         protected override void OnConfiguring (DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlite("Data Source=app.db; Cache=Shared");
}

    