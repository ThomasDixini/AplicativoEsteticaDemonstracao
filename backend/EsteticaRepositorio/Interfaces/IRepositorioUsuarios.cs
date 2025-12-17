using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio;

namespace EsteticaRepositorio.Interfaces
{
    public interface IRepositorioUsuarios
    {
        Task<Usuarios?> BuscarUsuarioPorUsername(string UserName);
        Task<Usuarios?> BuscarUsuarioPorId(int id);
    }
}