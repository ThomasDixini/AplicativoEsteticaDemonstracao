using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaApplication;
using EsteticaApplication.Jwt;
using EsteticaDominio;
using EsteticaDominio.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EsteticaAPI.Controllers
{
    [ApiController]
    [Route("api/usuarios")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuariosService _usuarioService;
        private readonly JwtService _jwtService;
        private readonly UserManager<Usuarios> _userManager;
        private readonly SignInManager<Usuarios> _signInManager;

        public UsuariosController(
            IUsuariosService usuarioService, 
            JwtService jwtService, 
            UserManager<Usuarios> userManager, 
            SignInManager<Usuarios> signInManager)
        {
            this._usuarioService = usuarioService;
            this._jwtService = jwtService;
            this._userManager = userManager;
            this._signInManager = signInManager;
        }

        [HttpGet("logado")]
        public async Task<IActionResult> BuscarUsuarioPorId()
        {
            try
            {
                var usuarioLogado = await _userManager.GetUserAsync(User);
                if (usuarioLogado == null) return NoContent();

                var usuarioDTO = new
                {
                    PrimeiroNome = usuarioLogado.PrimeiroNome,
                    UltimoNome = usuarioLogado.UltimoNome,
                    Cidade = usuarioLogado.Cidade,
                    Telefone = usuarioLogado.Telefone,
                };
                
                return Ok(usuarioDTO);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }
        [HttpDelete("deletar")]
        public async Task<IActionResult> DeletarConta()
        {
            try
            {
                var usuarioLogado = await _userManager.GetUserAsync(User);
                if (usuarioLogado == null) return NoContent();

                await _userManager.DeleteAsync(usuarioLogado);
                
                return NoContent();
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] Login login)
        {
            try
            {
                if(login.Password == null || login.Username == null) return BadRequest("'username' ou 'password' do objeto não foi fornecido.");

                var usuario = await _usuarioService.BuscarUsuarioPorUsername(login.Username);
                if (usuario == null) return BadRequest("Não existe usuário com esse Username");

                var result = await _signInManager.CheckPasswordSignInAsync(usuario, login.Password, false);
                if(result.Succeeded)
                {
                    var token = await _jwtService.CreateToken(usuario);
                    bool isAdmin = await _userManager.IsInRoleAsync(usuario, "Admin");
                    return Ok(new
                    {
                        Token = token,
                        UsuarioId = usuario.Id,
                        isAdmin
                    });
                }

                return Unauthorized();
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("registrar")]
        [AllowAnonymous]
        public async Task<IActionResult> Registrar(RegistrarDTO model)
        {
            try
            {
                var usuario = new Usuarios
                {
                    UserName = model.Username.ToUpper(),
                    PrimeiroNome = model.PrimeiroNome.ToUpper(),
                    UltimoNome = model.UltimoNome.ToUpper(),
                    Genero = model.Genero,
                    Cidade = model.Cidade.ToUpper(),
                    Telefone = model.Telefone.ToUpper(),
                };

                var result = await _userManager.CreateAsync(usuario, model.Password);
                
                if(result.Succeeded)
                {
                    var admins = await _usuarioService.BuscarUsuariosAdm();
                    if(admins == null || admins.Count == 0)
                    {
                        await _userManager.AddToRoleAsync(usuario, "Admin");
                    }
                    
                    await _signInManager.SignInAsync(usuario, false);
                    return Ok("Usuário registrado com sucesso!");
                }

                return BadRequest(result.Errors);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await _signInManager.SignOutAsync();
                return Ok("Logout realizado!");
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPatch("editar")]
        public async Task<IActionResult> EditarUsuario(Usuarios novoUsuario)
        {
            try
            {
                var usuarioLogado = await _userManager.GetUserAsync(User);
                if (usuarioLogado == null) return Unauthorized();

                await _usuarioService.EditarUsuario(novoUsuario, usuarioLogado);
                return Ok("Usuário editado com sucesso!");
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("notificacao-token")]
        public async Task<IActionResult> SalvarNotificacaoToken([FromBody] string NotificacaoToken)
        {
            try
            {
                var usuarioLogado = await _userManager.GetUserAsync(User);
                if (usuarioLogado == null) return BadRequest();

                var response = await _usuarioService.SalvarNotificacaoToken(usuarioLogado, NotificacaoToken);
                
                return response == true ? Ok("Notificacao cadastrada com sucesso!") : Ok("Ja possui Token");
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }
    }
}