using EsteticaRepositorio.Interfaces;

namespace EsteticaRepositorio
{
    public class RepositorioEstetica : IRepositorioEstetica
    {
        private readonly ApplicationDbContext _context;

        public RepositorioEstetica(ApplicationDbContext context){
            this._context = context;
        }
        public void Add<T>(T Entity) where T : class
        {
            _context.Add<T>(Entity);
        }
        public void Update<T>(T Entity) where T : class
        {
            _context.Update<T>(Entity);
        }

        public void UpdateRange<T>(List<T> Entity) where T : class
        {
            _context.UpdateRange(Entity);
        }

        public void Delete<T>(T Entity) where T : class
        {
            _context.Remove(Entity);
        }

        public void DeleteRange<T>(List<T> Entity) where T : class
        {
            _context.RemoveRange(Entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }
    }
}