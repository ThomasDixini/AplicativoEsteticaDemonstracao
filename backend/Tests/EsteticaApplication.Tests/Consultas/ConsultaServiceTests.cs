using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaApplication.NotificacaoService.interfaces;
using EsteticaDominio.Consulta;
using EsteticaRepositorio.Interfaces;
using FluentAssertions;
using Moq;

namespace EsteticaApplication.Tests.Consultas
{
    public class ConsultaServiceTests
    {
        private readonly Mock<IRepositorioConsultas> _repositorioMock;
        private readonly ConsultasService _consultaService;

        public ConsultaServiceTests()
        {
            _repositorioMock = new Mock<IRepositorioConsultas>();

            _consultaService = new ConsultasService(
                _repositorioMock.Object,
                new Mock<IRepositorioEstetica>().Object,
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
    }
}