using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio.Consulta;
using EsteticaDominio.Consulta.enums;
using Microsoft.AspNetCore.Http;

namespace EsteticaApplication
{
    public interface IConsultasService
    {
        Task<Consultas?> MarcarConsulta(Consultas model);
        Task<bool> CancelarConsulta(int ConsultaId);
        Task<List<Consultas>> ListarConsultas(int PaginaAtual, int ItensPorPagina, int? TipoConsultaFiltro);
        Task<List<TipoConsulta>> BuscarTipoConsultas();
        Task<TipoConsulta?> BuscarTipoConsultaPorId(int TipoConsultaId);
        Task<TipoConsulta?> AlterarTipoConsulta(int TipoConsultaId, bool ativo);
        Task<List<HorarioConsultas>> BuscarHorariosPorTipoConsulta(int TipoConsultaId, string DiaSelecionado);
        Task<HorarioConsultas> CadastrarHorarioConsulta(HorarioConsultas model);
        Task<List<HorarioConsultas>> CadastrarHorariosConsulta(List<HorarioConsultas> model, int TipoConsultaId);
        Task<TipoConsulta> CadastrarTipoConsulta(TipoConsulta model);
        Task<TipoConsulta> EditarTipoConsulta(int TipoConsultaId, TipoConsulta model);
        Task CadastrarTipoConsultaImagem(IFormFile imagem, int consultaId);
        Task EditarTipoConsultaImagem(IFormFile imagem, int consultaId);
        Task EditarHorario(HorarioConsultas horario);
        Task EditarHorarios(int TipoConsultaId, List<HorarioConsultas> horario);
        Task DefinirHorariosIndisponiveis(HorariosIndisponiveis model);
        Task<List<HorariosIndisponiveis>> BuscarHorariosIndisponiveis(int TipoConsultaId, string Data);
        Task EditarHorariosIndisponiveis(List<HorariosIndisponiveis> model);
        Task AtualizarStatusConsulta(int ConsultaId, StatusConsulta statusConsulta);
    }
}