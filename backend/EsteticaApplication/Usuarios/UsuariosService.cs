using EsteticaDominio;
using EsteticaRepositorio.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EsteticaApplication
{
    public class UsuariosService : IUsuariosService
    {
        private readonly IRepositorioUsuarios _repositorioUsuarios;
        private readonly IRepositorioEstetica _repositorioEstetica;
        private readonly UserManager<Usuarios> _userManager;
        private readonly RoleManager<IdentityRole<int>> _roleManager;

        public UsuariosService(
            IRepositorioUsuarios repositorioUsuarios,
            IRepositorioEstetica repositorioEstetica,
            UserManager<Usuarios> userManager,
            RoleManager<IdentityRole<int>> roleManager
            )
        {
            this._repositorioUsuarios = repositorioUsuarios;
            this._repositorioEstetica = repositorioEstetica;
            this._userManager = userManager;
            this._roleManager = roleManager;
        }

        public async Task<Usuarios?> BuscarUsuarioPorId(int id)
        {
            return await Task.Run(() => _repositorioUsuarios.BuscarUsuarioPorId(id));
        }

        public async Task<Usuarios?> BuscarUsuarioPorUsername(string username)
        {
            return await Task.Run(() => _repositorioUsuarios.BuscarUsuarioPorUsername(username));
        }

        public async Task<List<Usuarios>> BuscarUsuariosAdm()
        {
            var role = await _roleManager.Roles.FirstOrDefaultAsync(c => c.NormalizedName == "ADMIN");
            if (role == null) return new List<Usuarios>();

            var usuariosAdmin = await _userManager.Users.Include(c => c.Roles).Where(c => c.Roles.Any(ur => ur.RoleId == role.Id)).ToListAsync();
            return usuariosAdmin;
        }

        public async Task EditarUsuario(Usuarios model, Usuarios usuarioLogado)
        {
            model.PrimeiroNome = model.PrimeiroNome.ToUpper();
            model.UltimoNome = model.UltimoNome.ToUpper();
            model.Cidade = model.Cidade.ToUpper();
            model.Telefone = model.Telefone.Replace(".", "").Replace("(", "").Replace(")", "").Replace("-", "");

            usuarioLogado.PrimeiroNome = model.PrimeiroNome;
            usuarioLogado.UltimoNome = model.UltimoNome;
            usuarioLogado.Cidade = model.Cidade;
            usuarioLogado.Telefone = model.Telefone;

            if (model.NovaSenha != null)
            {
                var hashedSenha = _userManager.PasswordHasher.HashPassword(usuarioLogado, model.NovaSenha);
                if (hashedSenha == null) return;

                usuarioLogado.PasswordHash = hashedSenha;
            }
            
            _repositorioEstetica.Update(usuarioLogado);
            await _repositorioEstetica.SaveChangesAsync();
        }

        public async Task<bool> SalvarNotificacaoToken(Usuarios usuarioLogado, string NotificacaoToken)
        {
            try
            {
                var response = false;
                if (usuarioLogado.NotificacaoToken != NotificacaoToken)
                {
                    usuarioLogado.NotificacaoToken = NotificacaoToken;
                    _repositorioEstetica.Update(usuarioLogado);

                    response = await _repositorioEstetica.SaveChangesAsync();
                }

                return response;
            }
            catch (System.Exception)
            {
                
                throw;
            }
        }
    }
}