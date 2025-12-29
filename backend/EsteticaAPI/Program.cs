using System.Text;
using EsteticaApplication;
using EsteticaApplication.Jwt;
using EsteticaApplication.NotificacaoService;
using EsteticaApplication.NotificacaoService.interfaces;
using EsteticaDominio;
using EsteticaRepositorio;
using EsteticaRepositorio.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddAuthorization();

builder.Services.AddScoped<IRepositorioEstetica, RepositorioEstetica>();
builder.Services.AddScoped<IRepositorioConsultas, RepositorioConsultas>();
builder.Services.AddScoped<IRepositorioProdutos, RepositorioProdutos>();
builder.Services.AddScoped<IRepositorioUsuarios, RepositorioUsuarios>();

builder.Services.AddScoped<IConsultasService, ConsultasService>();
builder.Services.AddScoped<IProdutosService, ProdutosService>();
builder.Services.AddScoped<IUsuariosService, UsuariosService>();
builder.Services.AddScoped<INotificacaoService, NotificacaoService>();
builder.Services.AddHttpClient<INotificacaoService, NotificacaoService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<UserManager<Usuarios>>();
builder.Services.AddScoped<SignInManager<Usuarios>>();

builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null
            );
        }
    )
);

builder.Services.AddControllers(config => {
    var requireAuthPolicy = new AuthorizationPolicyBuilder()
	.RequireAuthenticatedUser()
	.Build();

    config.Filters.Add(new AuthorizeFilter(requireAuthPolicy));
});

builder.Services
            .AddIdentity<Usuarios, IdentityRole<int>>(options => {
                options.SignIn.RequireConfirmedEmail = false;

            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
});

builder.Services
            .AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(jwtOptions => {
                jwtOptions.RequireHttpsMetadata = false;
                jwtOptions.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]!)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                };
            });

builder.Services.AddControllersWithViews()
    .AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

builder.Services.AddHttpContextAccessor();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirCors",
        policy =>
        {
            policy.AllowAnyHeader()
                  .AllowAnyOrigin()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

try
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        context.Database.CanConnect(); 
        context.Database.Migrate(); 

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole<int>("Admin"));
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Database Connection Error: {ex.Message}");
}


app.UseCors("PermitirCors");
app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();

app.MapGet("/", () =>
{
    Console.WriteLine("Estetica API is running at: " + Environment.MachineName);
    return "Estetica API is running at: " + Environment.MachineName;
}).AllowAnonymous();

app.Run();
Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
