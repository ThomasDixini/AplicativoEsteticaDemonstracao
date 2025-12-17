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
        public async Task<Consultas?> BuscarConsultaPorId(int ConsultaId)
        {
            return await _context.Consultas.Include(c => c.TipoConsulta)
            .FirstOrDefaultAsync(c => c.Id == ConsultaId);
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

         public async Task<List<HorarioConsultas>> BuscarHorariosPorTipoConsulta(int TipoConsultaId, string DiaSelecionado)
        {
            var dataFormatada = DateTime.ParseExact(
                DiaSelecionado,
                "dd/MM/yyyy",
                CultureInfo.InvariantCulture
            );
            var dataAtual = DateTime.Now.AddHours(-3);

            var horarios = await _context.TipoConsultaHorarios
                                                .Include(c => c.Horario)
                                                .Where(c => c.TipoConsultaId == TipoConsultaId)
                                                .Select(c => c.Horario)
                                                .ToListAsync();

            if (dataFormatada.Day == dataAtual.Day)
            {
                horarios = horarios.Where(c => c.Inicio > dataAtual.TimeOfDay).ToList();
            }

            var tipoConsultaHorarios = await _context.TipoConsultaHorarios.Where(c => c.TipoConsultaId == TipoConsultaId && c.DataReserva.Date >= dataFormatada.Date && c.DataReserva.Date <= dataFormatada.Date).ToListAsync();
            foreach (var horario in horarios)
            {
                horario.TipoConsultaHorarios = tipoConsultaHorarios.Where(c => c.HorarioId == horario.Id).ToList() ?? new List<TipoConsultaHorarios>();
            }

            return await Task.Run(() => horarios);
        }

        public async Task<List<HorariosIndisponiveis>> BuscarHorariosIndisponiveis(int TipoConsultaId, string DiaSelecionado)
        {
            var dataFormatada = DateTime.ParseExact(
                DiaSelecionado,
                "dd/MM/yyyy",
                CultureInfo.InvariantCulture
            );

            var horariosIndisponiveis = await _context.HorariosIndisponiveis.Where(c => c.Data == dataFormatada).ToListAsync();
            return await Task.Run(() => horariosIndisponiveis);
        }

        public async Task<HorarioConsultas?> BuscarHorarioPorPeriodo(TimeSpan inicio, TimeSpan fim)
        {
            var horarios = await _context.HorarioConsultas.FirstOrDefaultAsync(c => c.Inicio >= inicio && c.Fim <= fim);
            return await Task.Run(() => horarios);
        }

        public async Task<List<Consultas>> BuscarConsultasPorData(DateTime Data)
        {
            var consultas = await _context.Consultas.Where(c => c.Data.Date == Data.Date).ToListAsync();
            return await Task.Run(() => consultas);
        }

        public async Task<List<HorariosIndisponiveis>> BuscarHorariosIndisponiveisPorData(DateTime Data)
        {
            var horariosIndisponiveis = await _context.HorariosIndisponiveis.Where(c => c.Data.Date >= Data.Date && c.Data.Date <= Data.Date).ToListAsync();
            return await Task.Run(() => horariosIndisponiveis);
        }
    }
}