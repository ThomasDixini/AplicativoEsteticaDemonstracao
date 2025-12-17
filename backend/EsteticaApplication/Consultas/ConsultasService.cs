using System.Globalization;
using EsteticaApplication.Helper;
using EsteticaApplication.NotificacaoService.interfaces;
using EsteticaDominio.Consulta;
using EsteticaDominio.Consulta.enums;
using EsteticaRepositorio;
using EsteticaRepositorio.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace EsteticaApplication
{
    public class ConsultasService : IConsultasService
    {
        private readonly IRepositorioConsultas _repositorioConsultas;
        private readonly IRepositorioEstetica _repositorioGeral;
        private readonly ApplicationDbContext _context;
        private readonly INotificacaoService _notificacaoService;

        public ConsultasService(IRepositorioConsultas repositorioConsultas, IRepositorioEstetica repositorioGeral, INotificacaoService notificacaoService, ApplicationDbContext context)
        {
            this._repositorioConsultas = repositorioConsultas;
            this._repositorioGeral = repositorioGeral;
            this._notificacaoService = notificacaoService;
            this._context = context;
        }

        public async Task<List<TipoConsulta>> BuscarTipoConsultas()
        {
            var tipoConsultas = await _repositorioConsultas.BuscarTiposConsulta();
            return await Task.Run(() => tipoConsultas);
        }

        public async Task<TipoConsulta?> BuscarTipoConsultaPorId(int TipoConsultaId)
        {
            var tipoConsulta = await _repositorioConsultas.BuscarTipoConsultaPorId(TipoConsultaId);
            return await Task.Run(() => tipoConsulta);
        }

        public async Task<TipoConsulta?> AlterarTipoConsulta(int TipoConsultaId, bool ativo)
        {
            var tipoConsulta = await _repositorioConsultas.BuscarTipoConsultaPorId(TipoConsultaId);
            if (tipoConsulta == null) return null;

            tipoConsulta.Ativo = ativo;
            _repositorioGeral.Update(tipoConsulta);
            await _repositorioGeral.SaveChangesAsync();
            return tipoConsulta;
        }

        public async Task<List<HorarioConsultas>> BuscarHorariosPorTipoConsulta(int TipoConsultaId, string DiaSelecionado)
        {
            try
            {
                var horarios = await _repositorioConsultas.BuscarHorariosPorTipoConsulta(TipoConsultaId, DiaSelecionado);

                var dataFormatada = DateTime.ParseExact(
                    DiaSelecionado,
                    "dd/MM/yyyy",
                    CultureInfo.InvariantCulture
                );
                var consultasMarcadas = await _repositorioConsultas.BuscarConsultasPorData(dataFormatada);
                consultasMarcadas = consultasMarcadas.Where(c => c.Status != StatusConsulta.CANCELADA).ToList();

                var horariosIndisponiveis = await _repositorioConsultas.BuscarHorariosIndisponiveisPorData(dataFormatada);
                horariosIndisponiveis = horariosIndisponiveis.Where(c => c.Ativo == true).ToList();

                horarios = horarios.Where(horario => !consultasMarcadas.Any(consulta => horario.Inicio < consulta.Fim && consulta.Inicio < horario.Fim)).ToList();
                horarios = horarios.Where(c => !horariosIndisponiveis.Any(h => c.Inicio < h.Fim && c.Fim > h.Inicio)).ToList();

                return await Task.Run(() => horarios);
            } 
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }
        }

        public async Task<HorarioConsultas> CadastrarHorarioConsulta(HorarioConsultas model)
        {
            _repositorioGeral.Add(model);
            await _repositorioGeral.SaveChangesAsync();

            return model;
        }
        public async Task<List<HorarioConsultas>> CadastrarHorariosConsulta(List<HorarioConsultas> model, int TipoConsultaId)
        {
            foreach (var item in model)
            {
                _repositorioGeral.Add(item);
                foreach (var tipoConsultaHorario in item.TipoConsultaHorarios)
                {
                    tipoConsultaHorario.HorarioId = item.Id;
                    tipoConsultaHorario.TipoConsultaId = TipoConsultaId;
                    tipoConsultaHorario.DataReserva = new DateTime();
                    tipoConsultaHorario.Reservado = false;
                }
            }

            await _repositorioGeral.SaveChangesAsync();
            return model;
        }

        public async Task<bool> CancelarConsulta(int ConsultaId)
        {
            var consulta = await _repositorioConsultas.BuscarConsultaPorId(ConsultaId);
            if (consulta == null)
                throw new Exception("Consulta inexistente!");

            if (consulta.Status == StatusConsulta.CONCLUIDA)
                throw new Exception("Você não pode cancelar uma consulta já finalizada!");

            consulta.Status = StatusConsulta.CANCELADA;
            _repositorioGeral.Update(consulta);
            if (await _repositorioGeral.SaveChangesAsync())
            {
                await _notificacaoService.EnviarNotificacaoParaAdmin($"Uma consulta de {consulta.TipoConsulta.Nome} foi cancelada", "Consulta cancelada!");
                await _notificacaoService.EnviarNotificacaoParaCliente($"Sua consula foi cancelada com sucesso.", "Consulta cancelada!", consulta.UsuarioId);

                await _repositorioGeral.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task EditarHorario(HorarioConsultas horario)
        {
            _repositorioGeral.Update(horario);
            await _repositorioGeral.SaveChangesAsync();
        }
        public async Task EditarHorarios(int TipoConsultaId, List<HorarioConsultas> horarios)
        {
            var horariosEditar = horarios.Where(c => c.Id != 0).ToList();
            if (horariosEditar != null && horariosEditar.Count() > 0)
            {
                _repositorioGeral.UpdateRange(horariosEditar);
                await _repositorioGeral.SaveChangesAsync();
            }

            var horarioCadastrar = horarios.Where(c => c.Id == 0).ToList();
            if (horarioCadastrar != null && horarioCadastrar.Count() > 0)
            {
                await CadastrarHorariosConsulta(horarioCadastrar, TipoConsultaId);
            }
        }

        public async Task<List<Consultas>> ListarConsultas(int PaginaAtual, int ItensPorPagina, int? TipoConsultaFiltro)
        {
            var consultas = await _repositorioConsultas.BuscarConsultas(PaginaAtual, ItensPorPagina, TipoConsultaFiltro);
            consultas = consultas.OrderBy(c => c.Status).ThenBy(c => c.Data).ThenBy(c => c.Inicio).ToList();
            return consultas;
        }

        public async Task<Consultas?> MarcarConsulta(Consultas model)
        {
            var data = model.Data;
            var tipoConsulta = await _repositorioConsultas.BuscarTipoConsultaPorId(model.TipoConsultaId);
            var consultas = await _repositorioConsultas.BuscarConsultasPorData(data);
            var consultaReservada = consultas.FirstOrDefault(c => c.Inicio >= data.TimeOfDay && c.Fim <= data.TimeOfDay);

            if (consultaReservada != null)
            {
                throw new Exception("Já existe consulta marcada nesse horário!");
            }


            model.Id = 0;
            model.Status = StatusConsulta.AGUARDANDO_CONFIRMACAO;
            model.Data = data;
            model.Valor = tipoConsulta.ValorAtual;

            _repositorioGeral.Add(model);
            await _repositorioGeral.SaveChangesAsync();

            await _notificacaoService.EnviarNotificacaoParaAdmin($"Uma nova consulta de {tipoConsulta.Nome} foi Agendada!", "Consulta Marcada!");

            return model;
        }

        public async Task<TipoConsulta> CadastrarTipoConsulta(TipoConsulta model)
        {
            model.Id = 0;
            model.Descricao = model.Descricao.ToUpper();
            model.Nome = model.Nome.ToUpper();
            model.ValorAtual = (model.ValorAtual != 0) ? model.ValorAtual / 100 : 0;

            _repositorioGeral.Add(model);
            await _repositorioGeral.SaveChangesAsync();

            return model;
        }
        public async Task<TipoConsulta> EditarTipoConsulta(int TipoConsultaId, TipoConsulta model)
        {
            _repositorioGeral.Update(model);
            await _repositorioGeral.SaveChangesAsync();

            return model;
        }
        
        public async Task CadastrarTipoConsultaImagem(IFormFile imagem, int consultaId)
        {
            using var ms = new MemoryStream();
            await imagem.CopyToAsync(ms);
            var bytes = ms.ToArray();

            var tipoConsulta = await _repositorioConsultas.BuscarTipoConsultaPorId(consultaId);
            tipoConsulta.Imagem = bytes;

            var uri = ImagemUploader.EscreverImagem(tipoConsulta.Id, ".jpg", bytes);
            tipoConsulta.UriImagem = uri;

            _repositorioGeral.Update(tipoConsulta);
            await _repositorioGeral.SaveChangesAsync();

            return;
        }
        public async Task EditarTipoConsultaImagem(IFormFile imagem, int consultaId)
        {
            using var ms = new MemoryStream();
            await imagem.CopyToAsync(ms);
            var bytes = ms.ToArray();

            var tipoConsulta = await _repositorioConsultas.BuscarTipoConsultaPorId(consultaId);

            var uri = ImagemUploader.EscreverImagem(tipoConsulta.Id, ".jpg", bytes);
            tipoConsulta.UriImagem = uri;

            _repositorioGeral.Update(tipoConsulta);
            await _repositorioGeral.SaveChangesAsync();

            return;
        }

        public async Task<List<HorariosIndisponiveis>> BuscarHorariosIndisponiveis(int TipoConsultaId, string Data)
        {
            var horariosIndisponiveis = await _repositorioConsultas.BuscarHorariosIndisponiveis(TipoConsultaId, Data);
            return horariosIndisponiveis;
        }
        public async Task DefinirHorariosIndisponiveis(HorariosIndisponiveis model)
        {
            _repositorioGeral.Add(model);
            await _repositorioGeral.SaveChangesAsync();
        }

        public async Task EditarHorariosIndisponiveis(List<HorariosIndisponiveis> model)
        {
            _repositorioGeral.UpdateRange(model);
            await _repositorioGeral.SaveChangesAsync();
        }

        public async Task AtualizarStatusConsulta(int ConsultaId, StatusConsulta statusConsulta)
        {

            var consulta = await _context.Consultas.IgnoreQueryFilters().FirstOrDefaultAsync(c => c.Id == ConsultaId);
            if (consulta != null)
            {
                consulta.Status = statusConsulta;
                _repositorioGeral.Update(consulta);
                await _repositorioGeral.SaveChangesAsync();

                switch (statusConsulta)
                {
                    case StatusConsulta.AGUARDANDO_CONFIRMACAO:
                        await _notificacaoService.EnviarNotificacaoParaCliente("Sinto muito, Sua consulta não está mais confirmada, pode ter acontecido um imprevisto!", "Atualização de Consulta", consulta.UsuarioId);
                        break;
                    case StatusConsulta.AGENDADA:
                        await _notificacaoService.EnviarNotificacaoParaCliente("Sua consulta foi confirmada! Em breve, será será feito o contato com mais informações da consulta!", "Consulta Confirmada", consulta.UsuarioId);
                        break;
                    case StatusConsulta.CONCLUIDA:
                        await _notificacaoService.EnviarNotificacaoParaCliente("Muito obrigado pela confiança! Sua consulta foi finalizada!", "Consulta Finalizada", consulta.UsuarioId);
                        break;
                    case StatusConsulta.CANCELADA:
                        await _notificacaoService.EnviarNotificacaoParaCliente("Sinto muito... sua consulta teve que ser cancelada.", "Consulta Cancelada", consulta.UsuarioId);
                        break;
                }
            }
        }
    }
}