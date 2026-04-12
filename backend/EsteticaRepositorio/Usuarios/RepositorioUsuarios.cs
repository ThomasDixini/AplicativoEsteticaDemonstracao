using EsteticaDominio;
using EsteticaRepositorio.Interfaces;
using Microsoft.EntityFrameworkCore;

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
            return await _context.Users.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Usuarios?> BuscarUsuarioPorUsername(string UserName)
        {
            return await _context.Users.FirstOrDefaultAsync(c => c.UserName == UserName);
        }
    }
}