using EsteticaDominio.Consulta;
using EsteticaDominio.Produtos;
using EsteticaDominio;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

namespace EsteticaRepositorio;

public class ApplicationDbContext : IdentityDbContext<Usuarios, IdentityRole<int>, int,
                                                      IdentityUserClaim<int>, IdentityUserRole<int>, IdentityUserLogin<int>,
                                                      IdentityRoleClaim<int>, IdentityUserToken<int>>
{
    private readonly int _UsuarioId = 0;
    public DbSet<Consultas> Consultas { get; set; }
    public DbSet<TipoConsulta> TipoConsulta { get; set; }
    public DbSet<TipoProdutos> TipoProdutos { get; set; }
    public DbSet<Produtos> Produtos { get; set;}
    public DbSet<Posts> Posts { get; set;}
    public DbSet<PostsUsuarios> PostsUsuarios { get; set;}
    public DbSet<HorarioConsultas> HorarioConsultas { get; set; }
    public DbSet<HorariosIndisponiveis> HorariosIndisponiveis { get; set; }
    public DbSet<TipoConsultaHorarios> TipoConsultaHorarios { get; set; }
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IHttpContextAccessor accessor) : base(options)
    {
        if (accessor?.HttpContext?.Request != null && !accessor.HttpContext.Request.Path.Value.Contains("login") && !accessor.HttpContext.Request.Path.Value.Contains("registrar"))
        {
            if (accessor.HttpContext.Request.Headers.TryGetValue("UsuarioId", out var usuarioIdStr) && int.TryParse(usuarioIdStr, out var usuarioId))
            {
                this._UsuarioId = usuarioId;
            }
        }
    }
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<IdentityUserLogin<int>>().HasKey(l => new { l.LoginProvider, l.ProviderKey });
        modelBuilder.Entity<IdentityUserRole<int>>().HasKey(r => new { r.UserId, r.RoleId });
        modelBuilder.Entity<IdentityUserToken<int>>().HasKey(t => new { t.UserId, t.LoginProvider, t.Name });

         modelBuilder.Entity<Usuarios>().HasMany<IdentityUserRole<int>>(u => u.Roles).WithOne().HasForeignKey(ur => ur.UserId).IsRequired();

        modelBuilder.Entity<Consultas>().HasOne(c => c.Usuario).WithMany(c => c.Consultas).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Consultas>().HasOne(c => c.TipoConsulta).WithMany(c => c.Consultas).OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Produtos>().HasOne(c => c.TipoProdutos).WithMany(c => c.Produtos).OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<TipoConsulta>().HasMany(c => c.TipoConsultaHorarios).WithOne(c => c.TipoConsulta).HasForeignKey(c => c.TipoConsultaId).OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<HorarioConsultas>().HasMany(c => c.TipoConsultaHorarios).WithOne(c => c.Horario).HasForeignKey(c => c.HorarioId).OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<TipoConsultaHorarios>().HasKey(c => new { c.TipoConsultaId, c.HorarioId });
        
        modelBuilder.Entity<Consultas>().Property(c => c.UsuarioId).HasDefaultValue(0);
        modelBuilder.Entity<Consultas>().Property(c => c.Valor).HasPrecision(16, 2);
        modelBuilder.Entity<TipoConsulta>().Property(c => c.ValorAtual).HasPrecision(16, 2);
        modelBuilder.Entity<Produtos>().Property(c => c.ValorDeVenda).HasPrecision(16, 2);
        modelBuilder.Entity<Produtos>().Property(c => c.ValorDeCusto).HasPrecision(16, 2);

        modelBuilder.Entity<PostsUsuarios>().HasKey(c => new {c.UsuarioId, c.PostId});

        if (_UsuarioId != 0)
        {
            modelBuilder.Entity<Consultas>().HasQueryFilter(c => c.UsuarioId == _UsuarioId);
        }
    }
}
