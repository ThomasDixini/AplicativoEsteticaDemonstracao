using System.Text;
using EsteticaApplication.NotificacaoService.interfaces;
using EsteticaRepositorio;
using EsteticaRepositorio.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EsteticaApplication.NotificacaoService
{
    public class NotificacaoService : INotificacaoService
    {
        private readonly IRepositorioEstetica _repositorioEstetica;
        private readonly IUsuariosService _usuariosService;
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public NotificacaoService(ApplicationDbContext context, IRepositorioEstetica repositorioEstetica, HttpClient httpClient, IUsuariosService usuariosService)
        {
            this._context = context;
            this._repositorioEstetica = repositorioEstetica;
            this._httpClient = httpClient;
            this._usuariosService = usuariosService;
        }

        public async Task EnviarNotificacaoParaAdmin(string message, string titulo)
        {
            var usuariosAdmin = await _usuariosService.BuscarUsuariosAdm();
            if (usuariosAdmin == null || usuariosAdmin.Count() == 0) return;

            foreach (var usuario in usuariosAdmin)
            {
                if (usuario.NotificacaoToken != null)
                {
                    if (usuario.NotificacaoToken.Contains("ExponentPushToken"))
                    {
                        var mensagem = new
                        {
                            to = usuario.NotificacaoToken,
                            title = titulo,
                            body = message,
                            data = new { tipo = "evento" },
                        };

                        var json = System.Text.Json.JsonSerializer.Serialize(mensagem);
                        var content = new StringContent(json, Encoding.UTF8, "application/json");

                        var response = await _httpClient.PostAsync("https://exp.host/--/api/v2/push/send", content);
                        var result = await response.Content.ReadAsStringAsync();
                        Console.WriteLine(result);
                    }
                    else
                    {
                        Console.WriteLine($"Notificação para usuário: {titulo} - {message}");
                    }
                }
            }
        }

        public async Task<string> EnviarNotificacaoParaCliente(string message, string titulo, int usuarioId)
        {
            var usuario = await _context.Users.FirstOrDefaultAsync(c => c.Id == usuarioId);
            if (usuario != null && usuario.NotificacaoToken != null)
            {
                if (usuario.NotificacaoToken.Contains("ExponentPushToken"))
                {
                    var mensagem = new
                    {
                        to = usuario.NotificacaoToken,
                        title = titulo,
                        body = message,
                        data = new { tipo = "evento" },
                    };

                    var json = System.Text.Json.JsonSerializer.Serialize(mensagem);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    var response = await _httpClient.PostAsync("https://exp.host/--/api/v2/push/send", content);
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    Console.WriteLine($"Notificação para cliente: {titulo} - {message}");
                    return "Notificação simulada enviada";
                }
            }
            else
            { 
                return "Nada foi feito";
            }
        }
    }
}