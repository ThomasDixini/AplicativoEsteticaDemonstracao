using System.Globalization;
using EsteticaDominio.Consulta;
using EsteticaRepositorio.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EsteticaRepositorio
{
    public class RepositorioConsultas : IRepositorioConsultas
    {
        private readonly ApplicationDbContext _context;

        public RepositorioConsultas(ApplicationDbContext context)
        {
            this._context = context;
        }
        public async Task<Consultas?> BuscarConsultaPorId(int ConsultaId, bool? ignorarQueryFilters = false)
        {
            return ignorarQueryFilters == true
                ? await _context.Consultas.Include(c => c.TipoConsulta).IgnoreQueryFilters().FirstOrDefaultAsync(c => c.Id == ConsultaId)
                : await _context.Consultas.Include(c => c.TipoConsulta).FirstOrDefaultAsync(c => c.Id == ConsultaId);
        }

        public async Task<List<Consultas>> BuscarConsultas(int PaginaAtual, int ItensPorPagina, int? TipoConsultaFiltro)
        {
            var query = _context.Consultas.AsQueryable();

            if (TipoConsultaFiltro != null)
            {
                query = query.Where(c => c.TipoConsultaId == TipoConsultaFiltro);
            }

            return await query
                    .AsNoTracking()
                    .Include(c => c.TipoConsulta)
                    .Skip((PaginaAtual - 1) * ItensPorPagina)
                    .Take(ItensPorPagina)
                    .ToListAsync();
        }

        public async Task<List<TipoConsulta>> BuscarTiposConsulta()
        {
            return await _context.TipoConsulta.Select(c => new TipoConsulta
            {
                Id = c.Id,
                Nome = c.Nome,
                Descricao = c.Descricao,
                ValorAtual = c.ValorAtual,
                UriImagem = c.UriImagem,
                Ativo = c.Ativo,
            }).ToListAsync();
        }

        public async Task<TipoConsulta?> BuscarTipoConsultaPorId(int TipoConsultaId)
        {
            return await _context.TipoConsulta.Include(c => c.TipoConsultaHorarios).ThenInclude(c => c.Horario).AsNoTracking().FirstOrDefaultAsync(c => c.Id == TipoConsultaId);
        }

        public async Task<HorarioConsultas> BuscarHorarioPorId(int HorarioId)
        {
            return await Task.Run(() => _context.HorarioConsultas.First(c => c.Id == HorarioId));
        }

        public async Task<List<HorarioConsultas>> BuscarHorariosPorTipoConsulta(int TipoConsultaId)
        {
            return await _context.TipoConsultaHorarios
                .Where(c => c.TipoConsultaId == TipoConsultaId)
                .Select(c => c.Horario)
                .Include(h => h.TipoConsultaHorarios)
                .ToListAsync();
        }

        public async Task<List<HorariosIndisponiveis>> BuscarHorariosIndisponiveis(int TipoConsultaId, DateTime DiaSelecionado)
        {
            return await _context.HorariosIndisponiveis.Where(c => c.Data == DiaSelecionado).ToListAsync();
        }

        public async Task<HorarioConsultas?> BuscarHorarioPorPeriodo(TimeSpan inicio, TimeSpan fim)
        {
            return await _context.HorarioConsultas.FirstOrDefaultAsync(c => c.Inicio >= inicio && c.Fim <= fim);
        }

        public async Task<List<Consultas>> BuscarConsultasPorData(DateTime Data)
        {
            return await _context.Consultas.Where(c => c.Data.Date == Data.Date).ToListAsync();
        }

        public async Task<List<HorariosIndisponiveis>> BuscarHorariosIndisponiveisPorData(DateTime Data)
        {
            return await _context.HorariosIndisponiveis.Where(c => c.Data.Date >= Data.Date && c.Data.Date <= Data.Date).ToListAsync();
        }
    }
}