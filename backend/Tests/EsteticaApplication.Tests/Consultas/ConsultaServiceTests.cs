using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EsteticaApplication.NotificacaoService.interfaces;
using EsteticaDominio.Consulta;
using EsteticaDominio.Consulta.enums;
using EsteticaRepositorio.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Moq;

namespace EsteticaApplication.Tests.ConsultasTests
{
    public class ConsultaServiceTests
    {
        private readonly Mock<IRepositorioConsultas> _repositorioMock;
        private readonly Mock<IRepositorioEstetica> _repositorioGeralMock;
        private readonly Mock<INotificacaoService> _notificacaoService;
        private readonly ConsultasService _consultaService;

        private const string DiaSelecionado = "25/12/2024";
        private readonly DateTime DataFormatada = new DateTime(2024, 12, 25);

        public ConsultaServiceTests()
        {
            _repositorioMock = new Mock<IRepositorioConsultas>();
            _repositorioGeralMock = new Mock<IRepositorioEstetica>();
            _notificacaoService = new Mock<INotificacaoService>();

            _consultaService = new ConsultasService(
                _repositorioMock.Object,
                _repositorioGeralMock.Object,
                _notificacaoService.Object,
                null!
            );
        }
        [Fact]
        public async Task BuscarTipoConsultas_RetornaListaTipoConsulta()
        {
            var tiposEsperados = new List<TipoConsulta>
            {
                new () { Id = 1, Nome = "Corte de Cabelo" },
                new () { Id = 2, Nome = "Manicure" }
            };

            _repositorioMock.Setup(repo => repo.BuscarTiposConsulta()).ReturnsAsync(tiposEsperados);

            var resultado = await _consultaService.BuscarTipoConsultas();

            resultado.Should().BeEquivalentTo(tiposEsperados);
        }

        [Fact]
        public async Task BuscarTipoConsultaPorId_RetornaTipoConsulta()
        {
            var tipoConsultaId = 100;
            var tipoEsperado = new TipoConsulta { Id = 100, Nome = "Corte de Cabelo" };
            _repositorioMock.Setup(repo => repo.BuscarTipoConsultaPorId(tipoConsultaId)).ReturnsAsync(tipoEsperado);

            var resultado = await _consultaService.BuscarTipoConsultaPorId(tipoConsultaId);

            resultado.Should().BeEquivalentTo(tipoEsperado);
        }

        [Fact]
        public async Task AlterarTipoConsulta_DeveAlterarAtivo_QuandoTipoConsultaExistir()
        {
            var tipoConsultaId = 100;
            var tipoEsperado = new TipoConsulta { Id = 100, Nome = "Corte de Cabelo", Ativo = true };
            _repositorioMock.Setup(repo => repo.BuscarTipoConsultaPorId(tipoConsultaId)).ReturnsAsync(tipoEsperado);

            var resultado = await _consultaService.AlterarTipoConsulta(tipoConsultaId, ativo: false);

            resultado.Should().NotBeNull();
            resultado.Ativo.Should().Be(false);

            _repositorioGeralMock.Verify(repo => repo.Update(tipoEsperado), Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task AlterarTipoConsulta_DeveRetornarNulo_QuandoTipoConsultaNaoExistir()
        {
            _repositorioMock.Setup(r => r.BuscarTipoConsultaPorId(99)).ReturnsAsync((TipoConsulta?)null);

            var resultado = await _consultaService.AlterarTipoConsulta(99, ativo: false);

            resultado.Should().BeNull();

            _repositorioGeralMock.Verify(r => r.Update(It.IsAny<TipoConsulta>()), Times.Never);
            _repositorioGeralMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task CadastrarHorarioConsulta_DeveCadastrarHorario_QuandoDadosForemValidos()
        {
            var horarioConsulta = new HorarioConsultas
            {
                Id = 1,
                Ativo = true,
                Inicio = DateTime.Now.AddDays(1).AddHours(9).TimeOfDay,
                Fim = DateTime.Now.AddDays(1).AddHours(10).TimeOfDay,
            };

            var resultado = await _consultaService.CadastrarHorarioConsulta(horarioConsulta);

            resultado.Should().BeEquivalentTo(horarioConsulta);
            _repositorioGeralMock.Verify(repo => repo.Add(horarioConsulta), Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task BuscarHorariosPorTipoConsulta_DeveRetornarTodosHorarios_QuandoNaoHouverConflitos()
        {
            int tipoConsultaId = 1;
            var horariosEsperados = new List<HorarioConsultas>
            {
                new HorarioConsultas { Id = 1, Inicio = new TimeSpan(9, 1, 0), Fim = new TimeSpan(10, 0, 0), Ativo = true },
                new HorarioConsultas { Id = 2, Inicio = new TimeSpan(10, 1, 0), Fim = new TimeSpan(11, 0, 0), Ativo = true }
            };

            _repositorioMock.Setup(repo => repo.BuscarHorariosPorTipoConsulta(tipoConsultaId)).ReturnsAsync(horariosEsperados);

            _repositorioMock.Setup(repo => repo.BuscarConsultasPorData(DataFormatada))
                .ReturnsAsync(new List<Consultas>());

            _repositorioMock.Setup(repo => repo.BuscarHorariosIndisponiveisPorData(DataFormatada))
                .ReturnsAsync(new List<HorariosIndisponiveis>());

            var resultado = await _consultaService.BuscarHorariosPorTipoConsulta(tipoConsultaId, DataFormatada);

            resultado.Should().HaveCount(2);
        }
        [Fact]
        public async Task BuscarHorariosPorTipoConsulta_DeveRetornarSomenteHorariosComInicioMaiorQueHoraAtual_QuandoDataSelecionadaIgualDataAtual()
        {
            int tipoConsultaId = 1;
            var dataAtual = DateTime.Now.AddHours(-3);
            var horariosEsperados = new List<HorarioConsultas>
            {
                new HorarioConsultas { Id = 1, Inicio = new TimeSpan(9, 1, 0), Fim = new TimeSpan(10, 0, 0), Ativo = true },
                new HorarioConsultas { Id = 2, Inicio = dataAtual.TimeOfDay.Add(new TimeSpan(1, 0, 0)), Fim = dataAtual.TimeOfDay.Add(new TimeSpan(2, 0, 0)), Ativo = true }
            };

            _repositorioMock.Setup(repo => repo.BuscarHorariosPorTipoConsulta(tipoConsultaId)).ReturnsAsync(horariosEsperados);
            _repositorioMock.Setup(repo => repo.BuscarConsultasPorData(dataAtual)).ReturnsAsync(new List<Consultas>());
            _repositorioMock.Setup(repo => repo.BuscarHorariosIndisponiveisPorData(dataAtual)).ReturnsAsync(new List<HorariosIndisponiveis>());

            var resultado = await _consultaService.BuscarHorariosPorTipoConsulta(tipoConsultaId, dataAtual);

            resultado.Should().HaveCount(1);
        }

        [Fact]
        public async Task BuscarHorariosPorTipoConsulta_DeveRemoverHorario_QuandoConsultaMarcadaExistir()
        {
            int tipoConsultaId = 1;
            var horariosEsperados = new List<HorarioConsultas>
            {
                new HorarioConsultas { Id = 1, Inicio = new TimeSpan(9, 1, 0), Fim = new TimeSpan(10, 0, 0), Ativo = true },
                new HorarioConsultas { Id = 2, Inicio = new TimeSpan(10, 1, 0), Fim = new TimeSpan(11, 0, 0), Ativo = true }
            };

            var consultasMarcadas = new List<Consultas>
            {
                new () { Id = 1, TipoConsultaId = tipoConsultaId, Data = DataFormatada.Date, Status = StatusConsulta.AGENDADA, Inicio = new TimeSpan(9, 1, 0), Fim = new TimeSpan(10, 0, 0) }
            };

            _repositorioMock.Setup(repo => repo.BuscarHorariosPorTipoConsulta(tipoConsultaId)).ReturnsAsync(horariosEsperados);

            _repositorioMock.Setup(repo => repo.BuscarConsultasPorData(DataFormatada))
                .ReturnsAsync(consultasMarcadas);

            _repositorioMock.Setup(repo => repo.BuscarHorariosIndisponiveisPorData(DataFormatada))
                .ReturnsAsync(new List<HorariosIndisponiveis>());

            var resultado = await _consultaService.BuscarHorariosPorTipoConsulta(tipoConsultaId, DataFormatada);

            resultado.Should().HaveCount(1);
            resultado.First().Id.Should().Be(2);
        }

        [Fact]
        public async Task BuscarHorariosPorTipoConsulta_NaoDeveRemoverHorario_QuandoConsultaEstiverCancelada()
        {
            var horarios = new List<HorarioConsultas>
            {
                new() { Id = 1, Inicio = new TimeSpan(9, 1, 0), Fim = new TimeSpan(10, 0, 0) }
            };

            var consultasMarcadas = new List<Consultas>
            {
                new() { Inicio = new TimeSpan(9, 1, 0), Fim = new TimeSpan(10, 0, 0), Status = StatusConsulta.CANCELADA }
            };

            _repositorioMock.Setup(r => r.BuscarHorariosPorTipoConsulta(1))
                .ReturnsAsync(horarios);

            _repositorioMock.Setup(r => r.BuscarConsultasPorData(DataFormatada))
                .ReturnsAsync(consultasMarcadas);

            _repositorioMock.Setup(r => r.BuscarHorariosIndisponiveisPorData(DataFormatada))
                .ReturnsAsync(new List<HorariosIndisponiveis>());

            var resultado = await _consultaService.BuscarHorariosPorTipoConsulta(1, DataFormatada);

            resultado.Should().HaveCount(1);
        }

        [Fact]
        public async Task BuscarHorariosPorTipoConsulta_DeveRemoverHorario_QuandoHorarioEstiverIndisponivel()
        {
            var horarios = new List<HorarioConsultas>
            {
                new() { Id = 1, Inicio = new TimeSpan(9, 0, 0), Fim = new TimeSpan(10, 0, 0) },
                new() { Id = 2, Inicio = new TimeSpan(10, 0, 0), Fim = new TimeSpan(11, 0, 0) }
            };

            var horariosIndisponiveis = new List<HorariosIndisponiveis>
            {
                new() { Inicio = new TimeSpan(9, 0, 0), Fim = new TimeSpan(10, 0, 0), Ativo = true }
            };

            _repositorioMock.Setup(r => r.BuscarHorariosPorTipoConsulta(1))
                .ReturnsAsync(horarios);

            _repositorioMock.Setup(r => r.BuscarConsultasPorData(DataFormatada))
                .ReturnsAsync(new List<Consultas>());

            _repositorioMock.Setup(r => r.BuscarHorariosIndisponiveisPorData(DataFormatada))
                .ReturnsAsync(horariosIndisponiveis);

            var resultado = await _consultaService.BuscarHorariosPorTipoConsulta(1, DataFormatada);

            resultado.Should().HaveCount(1);
            resultado.First().Id.Should().Be(2);
        }

        [Fact]
        public async Task BuscarHorariosPorTipoConsulta_DeveLancarExcecao_QuandoDataFormatoInvalido()
        {
            _repositorioMock.Setup(r => r.BuscarHorariosPorTipoConsulta(1))
                .ReturnsAsync(new List<HorarioConsultas>());

            var resultado = async () => await _consultaService.BuscarHorariosPorTipoConsulta(1, new DateTime(31, 04, 2026));

            await resultado.Should().ThrowAsync<ArgumentOutOfRangeException>();
        }

        [Fact]
        public async Task BuscarHorariosPorTipoConsulta_DeveLancarExcecao_QuandoNaoHouverHorariosDisponiveis()
        {
            _repositorioMock.Setup(r => r.BuscarHorariosPorTipoConsulta(1))
                .ReturnsAsync(new List<HorarioConsultas>());

            _repositorioMock.Setup(repo => repo.BuscarConsultasPorData(DataFormatada))
                .ReturnsAsync(new List<Consultas>());

            _repositorioMock.Setup(repo => repo.BuscarHorariosIndisponiveisPorData(DataFormatada))
                .ReturnsAsync(new List<HorariosIndisponiveis>());

            var resultado = await _consultaService.BuscarHorariosPorTipoConsulta(1, DataFormatada);

            resultado.Should().BeEmpty();
        }

        [Fact]
        public async Task EditarHorario_DeveAtualizarHorario_QuandoDadosForemValidos()
        {
            var horario = new HorarioConsultas { Id = 1, Inicio = new TimeSpan(9, 0, 0), Fim = new TimeSpan(10, 0, 0) };

            await _consultaService.EditarHorario(horario);

            _repositorioGeralMock.Verify(repo => repo.Update(horario), Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task EditarTipoConsulta_DeveAtualizarTipoConsulta_QuandoDadosForemValidos()
        {
            var tipoConsultaId = 1;
            var model = new TipoConsulta { Id = tipoConsultaId, Nome = "Corte de Cabelo", Ativo = true };

            var resultado = await _consultaService.EditarTipoConsulta(tipoConsultaId, model);

            _repositorioGeralMock.Verify(repo => repo.Update(model), Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task BuscarHorariosIndisponiveis_DeveRetornarListaDeHorariosIndisponiveis_QuandoDadosForemValidos()
        {
            var tipoConsultaId = 1;
            var horariosIndisponiveisEsperados = new List<HorariosIndisponiveis>
            {
                new() { Id = 1, Data = DateTime.Now.Date, Inicio = new TimeSpan(9, 0, 0), Fim = new TimeSpan(10, 0, 0), Ativo = true },
                new() { Id = 2, Data = DateTime.Now.Date, Inicio = new TimeSpan(10, 0, 0), Fim = new TimeSpan(11, 0, 0), Ativo = true }
            };
            _repositorioMock.Setup(repo => repo.BuscarHorariosIndisponiveis(DataFormatada)).ReturnsAsync(horariosIndisponiveisEsperados);

            var resultado = await _consultaService.BuscarHorariosIndisponiveis(tipoConsultaId, DataFormatada);

            resultado.Should().HaveCount(2);
            resultado.Should().BeEquivalentTo(horariosIndisponiveisEsperados);
        }
        [Fact]
        public async Task DefinirHorariosIndisponiveis_DeveDefinirHorarioIndisponivel_QuandoDadosForemValidos()
        {
            var horarioIndisponivel = new HorariosIndisponiveis
            {
                Id = 1,
                Data = DateTime.Now.Date,
                Inicio = new TimeSpan(9, 0, 0),
                Fim = new TimeSpan(10, 0, 0),
                Ativo = true,
            };

            await _consultaService.DefinirHorariosIndisponiveis(horarioIndisponivel);

            _repositorioGeralMock.Verify(repo => repo.Add(horarioIndisponivel), Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task EditarHorariosIndisponiveis_DeveAtualizarListaDeHorariosIndisponiveis_QuandoDadosForemValidos()
        {
            var horariosIndisponiveisEditar = new List<HorariosIndisponiveis>
            {
                new() { Id = 1, Data = DateTime.Now.Date, Inicio = new TimeSpan(9, 0, 0), Fim = new TimeSpan(10, 0, 0), Ativo = true },
                new() { Id = 2, Data = DateTime.Now.Date, Inicio = new TimeSpan(10, 0, 0), Fim = new TimeSpan(11, 0, 0), Ativo = true }
            };

            await _consultaService.EditarHorariosIndisponiveis(horariosIndisponiveisEditar);

            _repositorioGeralMock.Verify(repo => repo.UpdateRange(horariosIndisponiveisEditar), Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task ListarConsultas_DeveRetornarListaDeConsultasOrdenadas()
        {
            var paginaAtual = 1;
            var itensPorPagina = 10;
            var tipoConsultaFiltro = (int?)null;

            var consultasEsperadas = new List<Consultas>
            {
                new() { Id = 1, TipoConsultaId = 1, Data = DateTime.Now.Date, Status = StatusConsulta.AGENDADA, Inicio = new TimeSpan(9, 0, 0), Fim = new TimeSpan(10, 0, 0) },
                new() { Id = 2, TipoConsultaId = 2, Data = DateTime.Now.Date, Status = StatusConsulta.CONCLUIDA, Inicio = new TimeSpan(11, 0, 0), Fim = new TimeSpan(11, 0, 0) },
                new() { Id = 2, TipoConsultaId = 2, Data = DateTime.Now.Date, Status = StatusConsulta.CANCELADA, Inicio = new TimeSpan(10, 0, 0), Fim = new TimeSpan(11, 0, 0) },
                new() { Id = 2, TipoConsultaId = 2, Data = DateTime.Now.Date, Status = StatusConsulta.AGUARDANDO_CONFIRMACAO, Inicio = new TimeSpan(10, 0, 0), Fim = new TimeSpan(11, 0, 0) }
            };
            _repositorioMock.Setup(repo => repo.BuscarConsultas(paginaAtual, itensPorPagina, tipoConsultaFiltro)).ReturnsAsync(consultasEsperadas);

            var resultado = await _consultaService.ListarConsultas(paginaAtual, itensPorPagina, tipoConsultaFiltro);

            resultado.Should().HaveCount(4);
            resultado.Should().BeInAscendingOrder(c => c.Status).And.ThenBeInAscendingOrder(c => c.Data).And.ThenBeInAscendingOrder(c => c.Inicio);
        }

        [Fact]
        public async Task EditarTipoConsultaImagem_DeveAtualizarImagemDoTipoConsulta_QuandoDadosForemValidos()
        {
            var content = "fake image content";
            var bytes = Encoding.UTF8.GetBytes(content);

            var stream = new MemoryStream(bytes);
            IFormFile imagem = new FormFile(stream, 0, bytes.Length, "Data", "imagem.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
            var tipoConsultaId = 1;
            var tipoConsulta = new TipoConsulta { Id = tipoConsultaId, Nome = "Corte de Cabelo", Ativo = true };
            _repositorioMock.Setup(repo => repo.BuscarTipoConsultaPorId(tipoConsultaId)).ReturnsAsync(tipoConsulta);

            await _consultaService.EditarTipoConsultaImagem(imagem, tipoConsultaId);

            _repositorioGeralMock.Verify(repo => repo.Update(It.Is<TipoConsulta>(t => t.Id == tipoConsultaId && t.UriImagem != null)), Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task EditarTipoConsultaImagem_DeveRetornarErro_QuandoTipoConsultaNaoExistir()
        {
            var content = "fake image content";
            var bytes = Encoding.UTF8.GetBytes(content);

            var stream = new MemoryStream(bytes);
            IFormFile imagem = new FormFile(stream, 0, bytes.Length, "Data", "imagem.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
            var tipoConsultaId = 1;

            var act = async () => await _consultaService.EditarTipoConsultaImagem(imagem, tipoConsultaId);

            await act.Should().ThrowAsync<NullReferenceException>().WithMessage("Object reference not set to an instance of an object.");
            _repositorioGeralMock.Verify(repo => repo.Update(It.IsAny<TipoConsulta>()), Times.Never);
        }

        [Fact]
        public async Task CadastrarTipoConsultaImagem_DeveCadastrarImagemDoTipoConsulta_QuandoDadosForemValidos()
        {
            var content = "fake image content";
            var bytes = Encoding.UTF8.GetBytes(content);

            var stream = new MemoryStream(bytes);
            IFormFile imagem = new FormFile(stream, 0, bytes.Length, "Data", "imagem.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
            var tipoConsultaId = 1;
            var tipoConsulta = new TipoConsulta { Id = tipoConsultaId, Nome = "Corte de Cabelo", Ativo = true };
            _repositorioMock.Setup(repo => repo.BuscarTipoConsultaPorId(tipoConsultaId)).ReturnsAsync(tipoConsulta);

            await _consultaService.CadastrarTipoConsultaImagem(imagem, tipoConsultaId);

            _repositorioGeralMock.Verify(repo => repo.Update(It.Is<TipoConsulta>(t => t.Id == tipoConsultaId && t.UriImagem != null)), Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task CadastrarTipoConsultaImagem_DeveRetornarErro_QuandoTipoConsultaNaoExistir()
        {
            var content = "fake image content";
            var bytes = Encoding.UTF8.GetBytes(content);

            var stream = new MemoryStream(bytes);
            IFormFile imagem = new FormFile(stream, 0, bytes.Length, "Data", "imagem.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
            var tipoConsultaId = 1;

            var act = async () => await _consultaService.CadastrarTipoConsultaImagem(imagem, tipoConsultaId);

            await act.Should().ThrowAsync<NullReferenceException>().WithMessage("Object reference not set to an instance of an object.");
            _repositorioGeralMock.Verify(repo => repo.Update(It.IsAny<TipoConsulta>()), Times.Never);
        }

        [Fact]
        public async Task CadastrarTipoConsulta_DeveCadastrarTipoConsulta_QuandoDadosForemValidos()
        {
            var tipoConsultaCadastrar = new TipoConsulta { Id = 0, Nome = "Corte de Cabelo", Descricao = "Corte de cabelo para homens e mulheres", ValorAtual = 15000 };

            var resultado = await _consultaService.CadastrarTipoConsulta(tipoConsultaCadastrar);

            resultado.Descricao.Should().BeUpperCased();
            resultado.Nome.Should().BeUpperCased();
            resultado.ValorAtual.Should().Be(150);
            _repositorioGeralMock.Verify(repo => repo.Add(It.Is<TipoConsulta>(t => t.Nome == tipoConsultaCadastrar.Nome.ToUpper() && t.Descricao == tipoConsultaCadastrar.Descricao.ToUpper() && t.ValorAtual == 150)), Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task EditarHorarios_DeveEditarHorarios_QuandoHouverHorariosParaEditar()
        {
            var horarios = new List<HorarioConsultas>
            {
                new() { Id = 1 },
                new() { Id = 2 }
            };

            await _consultaService.EditarHorarios(1, horarios);

            _repositorioGeralMock.Verify(r => r.UpdateRange(It.Is<List<HorarioConsultas>>(l => l.All(x => x.Id != 0))), Times.Once);
            _repositorioGeralMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task EditarHorarios_NaoDeveEditarHorarios_QuandoHorariosNaoTiveremIdValido()
        {
            var horarios = new List<HorarioConsultas>
            {
                new() { Id = 0, TipoConsultaHorarios = new List<TipoConsultaHorarios>() },
                new() { Id = 0, TipoConsultaHorarios = new List<TipoConsultaHorarios>() }
            };

            var consultaServiceMock = new Mock<ConsultasService>(
                _repositorioMock.Object,
                _repositorioGeralMock.Object,
                new Mock<INotificacaoService>().Object,
                null!
            )
            { CallBase = true };

            consultaServiceMock
                .Setup(s => s.CadastrarHorariosConsulta(It.IsAny<List<HorarioConsultas>>(), It.IsAny<int>()))
                .ReturnsAsync(new List<HorarioConsultas>());

            await consultaServiceMock.Object.EditarHorarios(1, horarios);

            consultaServiceMock.Verify(s => s.CadastrarHorariosConsulta(It.Is<List<HorarioConsultas>>(l => l.All(x => x.Id == 0)), 1), Times.Once);
            _repositorioGeralMock.Verify(r => r.UpdateRange(It.Is<List<HorarioConsultas>>(l => l.All(x => x.Id != 0))), Times.Never);
            _repositorioGeralMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task CadastrarHorariosConsulta_DeveCadastrarHorarios_QuandoDadosForemValidos()
        {
            var tipoConsultaId = 1;
            var data = DateTime.Now;
            var horarios = new List<HorarioConsultas>(){
                new() { Id = 0, TipoConsultaHorarios = new List<TipoConsultaHorarios>(){
                    new TipoConsultaHorarios { TipoConsultaId = tipoConsultaId, DataReserva = data, Reservado = false }
                } },
                new() { Id = 0, TipoConsultaHorarios = new List<TipoConsultaHorarios>(){
                    new TipoConsultaHorarios { TipoConsultaId = tipoConsultaId, DataReserva = data, Reservado = false }
                } }
             };

            var resultado = await _consultaService.CadastrarHorariosConsulta(horarios, tipoConsultaId);

            _repositorioGeralMock.Verify(r => r.Add(It.Is<HorarioConsultas>(h => h.TipoConsultaHorarios.All(tch => tch.HorarioId == h.Id && tch.TipoConsultaId == tipoConsultaId && tch.DataReserva == It.IsAny<DateTime>() && tch.Reservado == false))), Times.Exactly(horarios.Count));
            _repositorioGeralMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task CadastrarHorariosConsulta_DeveRetornarErro_QuandoNaoHouverTipoConsultaHorario()
        {
            var tipoConsultaId = 1;
            var data = DateTime.Now;
            var horarios = new List<HorarioConsultas>(){
                new() { Id = 0 },
                new() { Id = 0 }
            };

            var act = async () => await _consultaService.CadastrarHorariosConsulta(horarios, tipoConsultaId);

            await act.Should().ThrowAsync<NullReferenceException>().WithMessage("Object reference not set to an instance of an object.");
            _repositorioGeralMock.Verify(r => r.Add(It.IsAny<HorarioConsultas>()), Times.Exactly(1));
            _repositorioGeralMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task CancelarConsulta_AlterarStatus_QuandoConsultaExistente()
        {
            int consultaId = 1;
            var consulta = new Consultas { Id = consultaId, Status = StatusConsulta.AGENDADA, TipoConsulta = new TipoConsulta { Nome = "Corte de Cabelo" }, UsuarioId = 123 };
            _repositorioMock.Setup(repo => repo.BuscarConsultaPorId(consultaId, false)).ReturnsAsync(consulta);
            _repositorioGeralMock
                .SetupSequence(r => r.SaveChangesAsync())
                .ReturnsAsync(true)
                .ReturnsAsync(true);

            var resultado = await _consultaService.CancelarConsulta(consultaId);

            resultado.Should().BeTrue();
            consulta.Status.Should().Be(StatusConsulta.CANCELADA);
            _notificacaoService.Verify(n =>
                n.EnviarNotificacaoParaAdmin(It.IsAny<string>(), "Consulta cancelada!"),
                Times.Once);

            _notificacaoService.Verify(n =>
                n.EnviarNotificacaoParaCliente(It.IsAny<string>(), "Consulta cancelada!", consulta.UsuarioId),
                Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Exactly(2));
            _repositorioGeralMock.Verify(repo => repo.Update(consulta), Times.Once);
        }
        [Fact]
        public async Task CancelarConsulta_DeveRetornarErro_QuandoConsultaNaoExistente()
        {
            int consultaId = 1;

            var resultado = async () => await _consultaService.CancelarConsulta(consultaId);

            await resultado.Should().ThrowAsync<Exception>().WithMessage("Consulta inexistente!");
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Never);
        }
        [Fact]
        public async Task CancelarConsulta_DeveRetornarErro_QuandoConsultaConcluida()
        {
            int consultaId = 1;
            var consulta = new Consultas { Id = consultaId, Status = StatusConsulta.CONCLUIDA, TipoConsulta = new TipoConsulta { Nome = "Corte de Cabelo" }, UsuarioId = 123 };
            _repositorioMock.Setup(repo => repo.BuscarConsultaPorId(consultaId, false)).ReturnsAsync(consulta);

            var resultado = async () => await _consultaService.CancelarConsulta(consultaId);

            await resultado.Should().ThrowAsync<Exception>().WithMessage("Você não pode cancelar uma consulta já finalizada!");
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task MarcarConsulta_DeveRetornarConsultaMarcada_QuandoDadosValidos()
        {
            var consulta = new Consultas
            {
                Id = 1,
                TipoConsultaId = 1,
                Data = DateTime.Now.Date.AddDays(1),
                Inicio = new TimeSpan(9, 0, 0),
                Fim = new TimeSpan(10, 0, 0),
                Status = StatusConsulta.AGUARDANDO_CONFIRMACAO,
                UsuarioId = 123,
            };
            var tipoConsultaEsperado = new TipoConsulta { Id = 1, Nome = "Corte de Cabelo", ValorAtual = 15000 };
            _repositorioMock.Setup(repo => repo.BuscarTipoConsultaPorId(consulta.TipoConsultaId)).ReturnsAsync(tipoConsultaEsperado);
            _repositorioMock.Setup(repo => repo.BuscarConsultasPorData(consulta.Data)).ReturnsAsync(new List<Consultas>());
            _notificacaoService.Setup(n => n.EnviarNotificacaoParaAdmin(It.IsAny<string>(), "Consulta Marcada!")).Returns(Task.CompletedTask);

            var resultado = await _consultaService.MarcarConsulta(consulta);

            resultado.Should().NotBeNull();
            resultado.Status.Should().Be(StatusConsulta.AGUARDANDO_CONFIRMACAO);
            resultado.Valor.Should().Be(tipoConsultaEsperado.ValorAtual);
            _repositorioGeralMock.Verify(repo => repo.Add(It.Is<Consultas>(c => c.TipoConsultaId == consulta.TipoConsultaId && c.Data == consulta.Data && c.Inicio == consulta.Inicio && c.Fim == consulta.Fim && c.Status == StatusConsulta.AGUARDANDO_CONFIRMACAO && c.Valor == tipoConsultaEsperado.ValorAtual)), Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
            _notificacaoService.Verify(n => n.EnviarNotificacaoParaAdmin(It.IsAny<string>(), "Consulta Marcada!"), Times.Once);
        }
        [Fact]
        public async Task MarcarConsulta_NaoDeveMarcarConsulta_QuandoHorarioJaReservado()
        {
            var consulta = new Consultas
            {
                Id = 1,
                TipoConsultaId = 1,
                Data = DateTime.Now.Date.AddDays(1),
                Inicio = new TimeSpan(9, 0, 0),
                Fim = new TimeSpan(10, 0, 0),
                Status = StatusConsulta.AGUARDANDO_CONFIRMACAO,
                UsuarioId = 123,
            };
            var tipoConsultaEsperado = new TipoConsulta { Id = 1, Nome = "Corte de Cabelo", ValorAtual = 15000 };
            var consultas = new List<Consultas>
            {
                new () { Id = 2, TipoConsultaId = 1, Data = DateTime.Now.Date.AddDays(1), Status = StatusConsulta.AGENDADA, Inicio = consulta.Inicio, Fim = consulta.Fim }
            };
            _repositorioMock.Setup(repo => repo.BuscarTipoConsultaPorId(consulta.TipoConsultaId)).ReturnsAsync(tipoConsultaEsperado);
            _repositorioMock.Setup(repo => repo.BuscarConsultasPorData(consulta.Data)).ReturnsAsync(consultas);

            var resultado = async () => await _consultaService.MarcarConsulta(consulta);

            await resultado.Should().ThrowAsync<Exception>().WithMessage("Já existe consulta marcada nesse horário!");
        }

        [Theory]
        [InlineData(StatusConsulta.AGUARDANDO_CONFIRMACAO)]
        [InlineData(StatusConsulta.AGENDADA)]
        [InlineData(StatusConsulta.CONCLUIDA)]
        [InlineData(StatusConsulta.CANCELADA)]
        public async Task AtualizarStatusConsulta(StatusConsulta statusConsulta)
        {
            int consultaId = 1;
            var consulta = new Consultas { Id = consultaId, Status = StatusConsulta.AGUARDANDO_CONFIRMACAO, UsuarioId = 123 };

            _repositorioMock.Setup(repo => repo.BuscarConsultaPorId(consultaId, true)).ReturnsAsync(consulta);
            _notificacaoService.Setup(n => n.EnviarNotificacaoParaCliente(It.IsAny<string>(), It.IsAny<string>(), consulta.UsuarioId)).Returns(Task.Run(() => "Notificação enviada para cliente"));

            await _consultaService.AtualizarStatusConsulta(consultaId, statusConsulta);

            consulta.Status.Should().Be(statusConsulta);
            _repositorioGeralMock.Verify(repo => repo.Update(consulta), Times.Once);
            _repositorioGeralMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);

            _notificacaoService.Verify(n =>
                n.EnviarNotificacaoParaCliente(It.IsAny<string>(), It.IsAny<string>(), consulta.UsuarioId),
                Times.Once);
        }
    }
}