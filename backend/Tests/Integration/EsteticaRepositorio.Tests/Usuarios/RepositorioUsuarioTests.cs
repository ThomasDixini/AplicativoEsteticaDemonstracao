using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio;
using EsteticaDominio.Consulta;
using EsteticaRepositorio;
using EsteticaRepositorio.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

namespace EsteticaApplication.RepositorioUsuarioTests
{
    public class RepositorioUsuarioTests
    {
        private readonly IRepositorioUsuarios _repositorioUsuarios;
        private readonly ApplicationDbContext _context;

        public RepositorioUsuarioTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _repositorioUsuarios = new RepositorioUsuarios(_context);
        }

        [Fact]
        public async Task BuscarUsuarioPorId_DeveRetornarUsuarioExistente_QuandoIdCorresponder()
        {
            var usuario = new Usuarios
            {
                Id = 1,
                UserName = "usuarioTeste",
                Email = "usuarioTeste@example.com",
                AccessFailedCount= 0,
                ConcurrencyStamp = Guid.NewGuid().ToString(),
                EmailConfirmed = true,
                LockoutEnabled = false,
                NormalizedEmail = "USUARIOTESTE@EXAMPLE.COM",
                NormalizedUserName = "USUARIOTESTE",
                PasswordHash = "AQAAAAEAACcQAAAAEJv1mXo9n5s1v8X9Zl3n2k5j6h7g89l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4A==",
                PhoneNumber = "1234567890",
                PhoneNumberConfirmed = true,
                Cidade = "Cidade Teste",
                Genero = 'M',
                PrimeiroNome = "Primeiro",
                Telefone = "1234567890",
                UltimoNome = "Teste",
                TwoFactorEnabled = false,
                NotificacaoToken = "tokenTeste",
                LockoutEnd = null,
                NovaSenha = null,
                SecurityStamp = Guid.NewGuid().ToString(),
                Roles = new List<IdentityUserRole<int>>(),
                Consultas = new List<Consultas>(),
            };
            _context.Users.Add(usuario);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioUsuarios.BuscarUsuarioPorId(1);

            resultado.Should().NotBeNull();
            resultado.Id.Should().Be(usuario.Id);
            resultado.UserName.Should().Be(usuario.UserName);
            resultado.Email.Should().Be(usuario.Email);
        }

        [Fact]
        public async Task BuscarUsuarioPorUsername_DeveRetornarUsuarioExistente_QuandoUsernameCorresponder()
        {
            var usuario = new Usuarios
            {
                Id = 1,
                UserName = "usuarioTeste",
                Email = "usuarioTeste@example.com"
            };
            _context.Users.Add(usuario);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioUsuarios.BuscarUsuarioPorUsername("usuarioTeste");

            resultado.Should().NotBeNull();
            resultado.Id.Should().Be(usuario.Id);
            resultado.UserName.Should().Be(usuario.UserName);
            resultado.Email.Should().Be(usuario.Email);
        }

    }
}