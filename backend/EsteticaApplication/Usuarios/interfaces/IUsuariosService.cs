using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio;
using EsteticaDominio.DTO;
using Microsoft.AspNetCore.Identity;

namespace EsteticaApplication
{
    public interface IUsuariosService
    {
        Task<Usuarios?> BuscarUsuarioPorUsername(string username);
        Task<Usuarios?> BuscarUsuarioPorId(int id);
        Task EditarUsuario(Usuarios usuario, Usuarios usuarioLogado);
        Task<bool> SalvarNotificacaoToken(Usuarios usuarioLogado, string NotificacaoToken);
        Task<List<Usuarios>> BuscarUsuariosAdm();
    }
}