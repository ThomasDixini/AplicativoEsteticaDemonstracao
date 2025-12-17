using EsteticaDominio;
using EsteticaRepositorio.Interfaces;

namespace EsteticaRepositorio
{
    public class RepositorioUsuarios : IRepositorioUsuarios
    {
        private readonly ApplicationDbContext _context;
        public RepositorioUsuarios(ApplicationDbContext context)
        {
            this._context = context;
        }

        public async Task<Usuarios?> BuscarUsuarioPorId(int id)
        {
            return await Task.Run(() => _context.Users.FirstOrDefault(c => c.Id == id));
        }

        public async Task<Usuarios?> BuscarUsuarioPorUsername(string UserName)
        {
            return await Task.Run(() => _context.Users.FirstOrDefault(c => c.UserName == UserName));
        }
    }
}