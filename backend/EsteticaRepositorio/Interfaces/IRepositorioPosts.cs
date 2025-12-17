using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio;

namespace EsteticaRepositorio.Interfaces
{
    public interface IRepositorioPosts
    {
        Task<List<Posts>> BuscarPosts();
        Task<Posts?> BuscarPostPorId(int PostId);
    }
}