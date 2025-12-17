using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio.Consulta;
using EsteticaDominio.Consulta.enums;

namespace EsteticaRepositorio.Interfaces
{
    public interface IRepositorioConsultas
    {
        Task<List<Consultas>> BuscarConsultas(int PaginaAtual, int ItensPorPagina, int? TipoConsultaFiltro);
        Task<Consultas?> BuscarConsultaPorId(int ConsultaId);
        Task<List<Consultas>> BuscarConsultasPorData(DateTime Data);
        Task<List<HorariosIndisponiveis>> BuscarHorariosIndisponiveisPorData(DateTime Data);

        Task<List<TipoConsulta>> BuscarTiposConsulta();
        Task<TipoConsulta?> BuscarTipoConsultaPorId(int TipoConsultaId);

        Task<HorarioConsultas> BuscarHorarioPorId(int HorarioId);
        Task<HorarioConsultas?> BuscarHorarioPorPeriodo(TimeSpan inicio, TimeSpan fim);
        Task<List<HorarioConsultas>> BuscarHorariosPorTipoConsulta(int TipoConsultaId, string DiaSelecionado);
        Task<List<HorariosIndisponiveis>> BuscarHorariosIndisponiveis(int TipoConsultaId, string DiaSelecionado);
    }
}