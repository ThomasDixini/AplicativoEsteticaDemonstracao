using EsteticaDominio;
using EsteticaRepositorio.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace EsteticaApplication.Tests.UsuariosTests
{
    public class UsuariosServiceTests
    {
        private readonly Mock<IRepositorioUsuarios> _repositorioUsuarios;
        private readonly Mock<IRepositorioEstetica> _repositorioEstetica;
        private readonly UsuariosService _usuariosService;
        public UsuariosServiceTests()
        {
            _repositorioUsuarios = new Mock<IRepositorioUsuarios>();
            _repositorioEstetica = new Mock<IRepositorioEstetica>();
            _usuariosService = new UsuariosService(_repositorioUsuarios.Object, _repositorioEstetica.Object, null, null);
        }

        [Fact]
        public async Task BuscarUsuarioPorId_DeveRetornarUsuario_SeExiste()
        {
            var usuario = new Usuarios { Id = 1, UserName = "testuser" };
            _repositorioUsuarios.Setup(x => x.BuscarUsuarioPorId(1)).ReturnsAsync(usuario);

            var result = await _usuariosService.BuscarUsuarioPorId(1);

            result.Should().BeEquivalentTo(usuario);
        }

        [Fact]
        public async Task BuscarUsuarioPorId_DeveRetornarNull_SeNaoExiste()
        {
            _repositorioUsuarios.Setup(x => x.BuscarUsuarioPorId(1)).ReturnsAsync((Usuarios)null);

            var result = await _usuariosService.BuscarUsuarioPorId(1);

            result.Should().BeNull();
        }

        [Fact]
        public async Task BuscarUsuarioPorUsername_DeveRetornarUsuario_SeExiste()
        {
            var usuario = new Usuarios { Id = 1, UserName = "testuser" };
            _repositorioUsuarios.Setup(x => x.BuscarUsuarioPorUsername("testuser")).ReturnsAsync(usuario);

            var result = await _usuariosService.BuscarUsuarioPorUsername("testuser");

            result.Should().BeEquivalentTo(usuario);
        }

        [Fact]
        public async Task SalvarNotificacaoToken_DeveSalvarToken()
        {
            var notificacaoToken = "testtoken_123";
            var usuario = new Usuarios { Id = 1, UserName = "testuser", NotificacaoToken = "testtoken" };
            _repositorioEstetica.Setup(c => c.SaveChangesAsync()).ReturnsAsync(true);

            var resultado = await _usuariosService.SalvarNotificacaoToken(usuario, notificacaoToken);

            resultado.Should().BeTrue();
            usuario.NotificacaoToken.Should().Be(notificacaoToken);
            _repositorioEstetica.Verify(x => x.Update<Usuarios>(It.Is<Usuarios>(u => u.Id == usuario.Id && u.NotificacaoToken == notificacaoToken)), Times.Once);
            _repositorioEstetica.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task SalvarNotificacaoToken_DeveRetornarFalse_SeTokenIgual()
        {
            var notificacaoToken = "testtoken_123";
            var usuario = new Usuarios { Id = 1, UserName = "testuser", NotificacaoToken = "testtoken_123" };

            var resultado = await _usuariosService.SalvarNotificacaoToken(usuario, notificacaoToken);

            resultado.Should().BeFalse();
        }
    }
}