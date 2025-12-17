using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio;

namespace EsteticaApplication.interfaces
{
    public interface IPostService
    {
        Task<List<Posts>> BuscarPosts();
        Task<Posts?> CadastrarPost(Posts post); 
        Task<Posts?> EditarPost(Posts post); 
        Task<bool> DeletarPost(int PostId);
    }
}