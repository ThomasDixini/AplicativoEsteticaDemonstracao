using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio.Consulta;
using EsteticaRepositorio;
using EsteticaRepositorio.Interfaces;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace EsteticaRepositorioTests.RepositorioConsultasTest
{
    public class RepositorioConsultasTests
    {
        private readonly IRepositorioConsultas _repositorioConsultas;
        private readonly ApplicationDbContext _context;

        public RepositorioConsultasTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _repositorioConsultas = new RepositorioConsultas(_context);
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

            var resultado = await _repositorioConsultas.BuscarConsultaPorId(consulta.Id, false);

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

            var resultado = await _repositorioConsultas.BuscarConsultaPorId(consulta.Id, true);

            resultado.Should().NotBeNull();
            resultado.Id.Should().Be(consultaId);
            resultado.Should().BeEquivalentTo(consulta);
        }

        [Fact]
        public async Task BuscarHorarioPorPeriodo_DeveRetornarHorarioExistente_QuandoPeriodoCorresponder()
        {
            var horario = new HorarioConsultas
            {
                Id = 1,
                Inicio = new TimeSpan(9, 0, 0),
                Fim = new TimeSpan(10, 0, 0)
            };
            _context.HorarioConsultas.Add(horario);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioConsultas.BuscarHorarioPorPeriodo(new TimeSpan(9, 0, 0), new TimeSpan(10, 0, 0));

            resultado.Should().NotBeNull();
            resultado.Id.Should().Be(horario.Id);
            resultado.Should().BeEquivalentTo(horario);
        }

        [Fact]
        public async Task BuscarConsultasPorData_DeveRetornarConsultasExistentes_QuandoDataCorresponder()
        {
            var data = DateTime.Now.Date;
            var consulta1 = new Consultas
            {
                Id = 1,
                TipoConsultaId = 1,
                Inicio = new TimeSpan(9, 0, 0),
                Fim = new TimeSpan(10, 0, 0),
                Data = data
            };
            var consulta2 = new Consultas
            {
                Id = 2,
                TipoConsultaId = 1,
                Inicio = new TimeSpan(10, 0, 0),
                Fim = new TimeSpan(11, 0, 0),
                Data = data
            };
            _context.Consultas.AddRange(consulta1, consulta2);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioConsultas.BuscarConsultasPorData(data);

            resultado.Should().NotBeNull();
            resultado.Count.Should().Be(2);
            resultado.Should().ContainEquivalentOf(consulta1);
            resultado.Should().ContainEquivalentOf(consulta2);
        }

        [Fact]
        public async Task BuscarHorariosIndisponiveisPorData_DeveRetornarHorariosIndisponiveisExistentes_QuandoDataCorresponder()
        {
            var data = DateTime.Now.Date;
            var horarioIndisponivel1 = new HorariosIndisponiveis
            {
                Id = 1,
                Data = data,
                Ativo = true,
            };
            var horarioIndisponivel2 = new HorariosIndisponiveis
            {
                Id = 2,
                Data = data,
                Ativo = true,
            };
            _context.HorariosIndisponiveis.AddRange(horarioIndisponivel1, horarioIndisponivel2);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioConsultas.BuscarHorariosIndisponiveisPorData(data);

            resultado.Should().NotBeNull();
            resultado.Count.Should().Be(2);
            resultado.Should().ContainEquivalentOf(horarioIndisponivel1);
            resultado.Should().ContainEquivalentOf(horarioIndisponivel2);
        }

        [Fact]
        public async Task BuscarHorariosIndisponiveis_DeveRetornarHorariosIndisponiveisExistentes_QuandoDataCorresponder()
        {
            var data = DateTime.Now.Date;
            var horarioIndisponivel1 = new HorariosIndisponiveis
            {
                Id = 1,
                Data = data,
                Ativo = true,
            };
            var horarioIndisponivel2 = new HorariosIndisponiveis
            {
                Id = 2,
                Data = data,
                Ativo = true,
            };
            _context.HorariosIndisponiveis.AddRange(horarioIndisponivel1, horarioIndisponivel2);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioConsultas.BuscarHorariosIndisponiveis(data);

            resultado.Should().NotBeNull();
            resultado.Count.Should().Be(2);
            resultado.Should().ContainEquivalentOf(horarioIndisponivel1);
            resultado.Should().ContainEquivalentOf(horarioIndisponivel2);
        }

        [Fact]
        public async Task BuscarHorarioPorId_DeveRetornarHorarioExistente_QuandoIdCorresponder()
        {
            var horario = new HorarioConsultas
            {
                Id = 1,
                Inicio = new TimeSpan(9, 0, 0),
                Fim = new TimeSpan(10, 0, 0)
            };
            _context.HorarioConsultas.Add(horario);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioConsultas.BuscarHorarioPorId(horario.Id);

            resultado.Should().NotBeNull();
            resultado.Id.Should().Be(horario.Id);
            resultado.Should().BeEquivalentTo(horario);
        }

        [Fact]
        public async Task BuscarTipoConsultaPorId_DeveRetornarTipoConsultaExistente_QuandoIdCorresponder()
        {
            var horario = new HorarioConsultas
            {
                Id = 0,
                Inicio = new TimeSpan(9, 0, 0),
                Fim = new TimeSpan(10, 0, 0)
            };
            var tipoConsultaHorario = new TipoConsultaHorarios
            {
                TipoConsultaId = 1,
                HorarioId = horario.Id,
                Horario = horario
            };

            _context.TipoConsultaHorarios.Add(tipoConsultaHorario);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var tipoConsulta = new TipoConsulta
            {
                Id = 1,
                Nome = "Teste",
                ValorAtual = 100,
                Descricao = "Teste",
                Ativo = true,
                TipoConsultaHorarios = new List<TipoConsultaHorarios> { tipoConsultaHorario }
            };
            _context.TipoConsulta.Add(tipoConsulta);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioConsultas.BuscarTipoConsultaPorId(tipoConsulta.Id);

            resultado.Should().NotBeNull();
            resultado.Id.Should().Be(tipoConsulta.Id);
            resultado.Should().BeEquivalentTo(tipoConsulta, options => options.IgnoringCyclicReferences());
        }

        [Fact]
        public async Task BuscarHorariosPorTipoConsulta_DeveRetornarHorariosExistentes_QuandoTipoConsultaCorresponder()
        {
            var horario1 = new HorarioConsultas
            {
                Id = 0,
                Inicio = new TimeSpan(9, 0, 0),
                Fim = new TimeSpan(10, 0, 0)
            };
            var horario2 = new HorarioConsultas
            {
                Id = 0,
                Inicio = new TimeSpan(10, 0, 0),
                Fim = new TimeSpan(11, 0, 0)
            };
            var tipoConsultaHorario1 = new TipoConsultaHorarios
            {
                TipoConsultaId = 1,
                HorarioId = horario1.Id,
                Horario = horario1
            };
            var tipoConsultaHorario2 = new TipoConsultaHorarios
            {
                TipoConsultaId = 1,
                HorarioId = horario2.Id,
                Horario = horario2
            };

            _context.TipoConsultaHorarios.AddRange(tipoConsultaHorario1, tipoConsultaHorario2);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var tipoConsulta = new TipoConsulta
            {
                Id = 1,
                Nome = "Teste",
                ValorAtual = 100,
                Descricao = "Teste",
                Ativo = true,
                TipoConsultaHorarios = new List<TipoConsultaHorarios> { tipoConsultaHorario1, tipoConsultaHorario2 }
            };
            _context.TipoConsulta.Add(tipoConsulta);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioConsultas.BuscarHorariosPorTipoConsulta(tipoConsulta.Id);

            resultado.Should().NotBeNull();
            resultado.Count.Should().Be(2);
            resultado.Should().ContainEquivalentOf(horario1);
            resultado.Should().ContainEquivalentOf(horario2);
        }

        [Fact]
        public async Task BuscarTiposConsulta_DeveRetornarTiposConsultaExistentes()
        {
            var tipoConsulta1 = new TipoConsulta
            {
                Id = 1,
                Nome = "Teste1",
                ValorAtual = 100,
                UriImagem = "http://example2.com/image.png",
                Descricao = "Teste1",
                Ativo = true
            };
            var tipoConsulta2 = new TipoConsulta
            {
                Id = 2,
                Nome = "Teste2",
                ValorAtual = 200,
                Descricao = "Teste2",
                UriImagem = "http://example.com/image.png",
                Ativo = true
            };
            _context.TipoConsulta.AddRange(tipoConsulta1, tipoConsulta2);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioConsultas.BuscarTiposConsulta();

            resultado.Should().NotBeNull();
            resultado.Count.Should().Be(2);
            resultado.Should().ContainEquivalentOf(tipoConsulta1);
            resultado.Should().ContainEquivalentOf(tipoConsulta2);
        }

        [Fact]
        public async Task BuscarConsultas_DeveRetornarConsultasExistentes_QuandoFiltrosCorresponderem()
        {
            int paginaAtual = 1;
            int itensPorPagina = 10;
            int? tipoConsultaFiltro = null;

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

            var consulta1 = new Consultas
            {
                Id = 1,
                TipoConsultaId = tipoConsulta.Id,
                TipoConsulta = tipoConsulta,
                Inicio = new TimeSpan(9, 0, 0),
                Fim = new TimeSpan(10, 0, 0),
                Data = DateTime.Now.Date
            };
            var consulta2 = new Consultas
            {
                Id = 2,
                TipoConsultaId = tipoConsulta.Id,
                TipoConsulta = tipoConsulta,
                Inicio = new TimeSpan(10, 0, 0),
                Fim = new TimeSpan(11, 0, 0),
                Data = DateTime.Now.Date
            };
            _context.Consultas.AddRange(consulta1, consulta2);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioConsultas.BuscarConsultas(paginaAtual, itensPorPagina, tipoConsultaFiltro);

            resultado.Should().NotBeNull();
            resultado.Count.Should().Be(2);
            resultado.Select(c => c.Id).Should().Contain(new[] { consulta1.Id, consulta2.Id });
            resultado.All(c => c.TipoConsultaId == consulta1.TipoConsultaId).Should().BeTrue();
        }

        [Fact]
        public async Task BuscarConsultas_DeveRetornarConsultasFiltradasExistentes_QuandoFiltrosCorresponderem()
        {
            int paginaAtual = 1;
            int itensPorPagina = 10;
            int? tipoConsultaFiltro = 1;

            var tipoConsulta = new TipoConsulta
            {
                Id = 1,
                Nome = "Teste",
                ValorAtual = 100,
                Descricao = "Teste",
                Ativo = true
            };
            var tipoConsulta2 = new TipoConsulta
            {
                Id = 2,
                Nome = "Teste2",
                ValorAtual = 200,
                Descricao = "Teste2",
                Ativo = true
            };
            _context.TipoConsulta.AddRange(tipoConsulta, tipoConsulta2);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var consulta1 = new Consultas
            {
                Id = 1,
                TipoConsultaId = tipoConsulta.Id,
                TipoConsulta = tipoConsulta,
                Inicio = new TimeSpan(9, 0, 0),
                Fim = new TimeSpan(10, 0, 0),
                Data = DateTime.Now.Date
            };
            var consulta2 = new Consultas
            {
                Id = 2,
                TipoConsultaId = tipoConsulta2.Id,
                TipoConsulta = tipoConsulta,
                Inicio = new TimeSpan(10, 0, 0),
                Fim = new TimeSpan(11, 0, 0),
                Data = DateTime.Now.Date
            };
            _context.Consultas.AddRange(consulta1, consulta2);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioConsultas.BuscarConsultas(paginaAtual, itensPorPagina, tipoConsultaFiltro);

            resultado.Should().NotBeNull();
            resultado.Count.Should().Be(2);
            resultado.Select(c => c.Id).Should().Contain(new[] { consulta1.Id });
            resultado.All(c => c.TipoConsultaId == consulta1.TipoConsultaId).Should().BeTrue();
        }
    }
}