using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaApplication.NotificacaoService.interfaces;
using EsteticaDominio.Consulta;
using EsteticaDominio.Consulta.enums;
using EsteticaRepositorio.Interfaces;
using FluentAssertions;
using Moq;

namespace EsteticaApplication.Tests.ConsultasTests
{
    public class ConsultaServiceTests
    {
        private readonly Mock<IRepositorioConsultas> _repositorioMock;
        private readonly Mock<IRepositorioEstetica> _repositorioGeralMock;
        private readonly ConsultasService _consultaService;

        private const string DiaSelecionado = "25/12/2024";
        private readonly DateTime DataFormatada = new DateTime(2024, 12, 25);

        public ConsultaServiceTests()
        {
            _repositorioMock = new Mock<IRepositorioConsultas>();
            _repositorioGeralMock = new Mock<IRepositorioEstetica>();

            _consultaService = new ConsultasService(
                _repositorioMock.Object,
                _repositorioGeralMock.Object,
                new Mock<INotificacaoService>().Object,
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

            _repositorioMock.Setup(repo => repo.BuscarHorariosPorTipoConsulta(tipoConsultaId, DiaSelecionado)).ReturnsAsync(horariosEsperados);

            _repositorioMock.Setup(repo => repo.BuscarConsultasPorData(DataFormatada))
                .ReturnsAsync(new List<Consultas>());

            _repositorioMock.Setup(repo => repo.BuscarHorariosIndisponiveisPorData(DataFormatada))
                .ReturnsAsync(new List<HorariosIndisponiveis>());

            var resultado = await _consultaService.BuscarHorariosPorTipoConsulta(tipoConsultaId, DiaSelecionado);

            resultado.Should().HaveCount(2);
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

            _repositorioMock.Setup(repo => repo.BuscarHorariosPorTipoConsulta(tipoConsultaId, DiaSelecionado)).ReturnsAsync(horariosEsperados);

            _repositorioMock.Setup(repo => repo.BuscarConsultasPorData(DataFormatada))
                .ReturnsAsync(consultasMarcadas);

            _repositorioMock.Setup(repo => repo.BuscarHorariosIndisponiveisPorData(DataFormatada))
                .ReturnsAsync(new List<HorariosIndisponiveis>());

            var resultado = await _consultaService.BuscarHorariosPorTipoConsulta(tipoConsultaId, DiaSelecionado);

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

            _repositorioMock.Setup(r => r.BuscarHorariosPorTipoConsulta(1, DiaSelecionado))
                .ReturnsAsync(horarios);

            _repositorioMock.Setup(r => r.BuscarConsultasPorData(DataFormatada))
                .ReturnsAsync(consultasMarcadas);

            _repositorioMock.Setup(r => r.BuscarHorariosIndisponiveisPorData(DataFormatada))
                .ReturnsAsync(new List<HorariosIndisponiveis>());

            var resultado = await _consultaService.BuscarHorariosPorTipoConsulta(1, DiaSelecionado);

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

            _repositorioMock.Setup(r => r.BuscarHorariosPorTipoConsulta(1, DiaSelecionado))
                .ReturnsAsync(horarios);

            _repositorioMock.Setup(r => r.BuscarConsultasPorData(DataFormatada))
                .ReturnsAsync(new List<Consultas>());

            _repositorioMock.Setup(r => r.BuscarHorariosIndisponiveisPorData(DataFormatada))
                .ReturnsAsync(horariosIndisponiveis);

            var resultado = await _consultaService.BuscarHorariosPorTipoConsulta(1, DiaSelecionado);

            resultado.Should().HaveCount(1);
            resultado.First().Id.Should().Be(2);
        }

        [Fact]
        public async Task BuscarHorariosPorTipoConsulta_DeveLancarExcecao_QuandoDataFormatoInvalido()
        {
            _repositorioMock.Setup(r => r.BuscarHorariosPorTipoConsulta(1, "data-invalida"))
                .ReturnsAsync(new List<HorarioConsultas>());

            var resultado = async () => await _consultaService.BuscarHorariosPorTipoConsulta(1, "data-invalida");

            await resultado.Should().ThrowAsync<FormatException>();
        }

        [Fact]
        public async Task BuscarHorariosPorTipoConsulta_DeveLancarExcecao_QuandoNaoHouverHorariosDisponiveis()
        {
            _repositorioMock.Setup(r => r.BuscarHorariosPorTipoConsulta(1, DiaSelecionado))
                .ReturnsAsync(new List<HorarioConsultas>());

            _repositorioMock.Setup(repo => repo.BuscarConsultasPorData(DataFormatada))
                .ReturnsAsync(new List<Consultas>());

            _repositorioMock.Setup(repo => repo.BuscarHorariosIndisponiveisPorData(DataFormatada))
                .ReturnsAsync(new List<HorariosIndisponiveis>());

            var resultado = await _consultaService.BuscarHorariosPorTipoConsulta(1, DiaSelecionado);

            resultado.Should().BeEmpty();
        }
    }
}