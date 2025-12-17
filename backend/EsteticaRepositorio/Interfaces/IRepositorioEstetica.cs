using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EsteticaRepositorio.Interfaces
{
    public interface IRepositorioEstetica
    {
        void Add<T>(T Entity) where T : class;
        void Update<T>(T Entity) where T : class;
        void UpdateRange<T>(List<T> Entity) where T : class;
        void Delete<T>(T Entity) where T : class;
        void DeleteRange<T>(List<T> Entity) where T : class;
        Task<bool> SaveChangesAsync();
    }
}