using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio.Consulta;
using EsteticaRepositorio;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace EsteticaRepositorioTests.RepositorioConsultasTest
{
    public class RepositorioConsultasTests
    {
        private readonly ApplicationDbContext _context;

        public RepositorioConsultasTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
        }

        [Fact]
        public async Task BuscarConsultaPorId_DeveRetornarConsultaExistente_QuandoIgnorarQueryFiltersForFalse()
        {
            int consultaId = 1;
            var tipoConsulta = new TipoConsulta
            {
                Id = 1,
                Nome = "Teste",
                ValorAtual = 100,
                Descricao = "Teste",
                Ativo = true
            };
            _context.TipoConsulta.Add(tipoConsulta);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var consulta = new Consultas
            {
                Id = consultaId,
                TipoConsultaId = tipoConsulta.Id,
                TipoConsulta = tipoConsulta,
                Inicio = DateTime.Now.TimeOfDay,
                Fim = DateTime.Now.TimeOfDay,
                Data = DateTime.Now,
            };
            _context.Consultas.Add(consulta);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var repo = new RepositorioConsultas(_context);

            var resultado = await repo.BuscarConsultaPorId(consulta.Id, false);

            resultado.Should().NotBeNull();
            resultado.Id.Should().Be(consultaId);
            resultado.Should().BeEquivalentTo(consulta);
        }
        [Fact]
        public async Task BuscarConsultaPorId_DeveRetornarConsultaExistente_QuandoIgnorarQueryFiltersForTrue()
        {
            int consultaId = 1;
            var tipoConsulta = new TipoConsulta
            {
                Id = 1,
                Nome = "Teste",
                ValorAtual = 100,
                Descricao = "Teste",
                Ativo = true
            };
            _context.TipoConsulta.Add(tipoConsulta);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var consulta = new Consultas
            {
                Id = consultaId,
                TipoConsultaId = tipoConsulta.Id,
                TipoConsulta = tipoConsulta,
                Inicio = DateTime.Now.TimeOfDay,
                Fim = DateTime.Now.TimeOfDay,
                Data = DateTime.Now,
            };
            _context.Consultas.Add(consulta);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var repo = new RepositorioConsultas(_context);

            var resultado = await repo.BuscarConsultaPorId(consulta.Id, true);

            resultado.Should().NotBeNull();
            resultado.Id.Should().Be(consultaId);
            resultado.Should().BeEquivalentTo(consulta);
        }
    }
}