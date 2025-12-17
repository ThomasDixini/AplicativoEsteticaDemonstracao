using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EsteticaApplication.NotificacaoService.interfaces
{
    public interface INotificacaoService
    {
        Task<string> EnviarNotificacaoParaCliente(string message, string titulo, int usuarioId);
        Task EnviarNotificacaoParaAdmin(string message, string titulo);
    }
}