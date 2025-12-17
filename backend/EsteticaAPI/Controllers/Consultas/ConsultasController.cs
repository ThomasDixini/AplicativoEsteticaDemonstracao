using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using EsteticaApplication;
using EsteticaApplication.NotificacaoService.interfaces;
using EsteticaDominio;
using EsteticaDominio.Consulta;
using EsteticaDominio.Consulta.enums;
using EsteticaRepositorio;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EsteticaAPI.Controllers
{
    [ApiController]
    [Route("api/consultas")]
    public class ConsultasController : ControllerBase
    {
        private readonly IConsultasService _consultasService;
        private readonly INotificacaoService _notificacaoService;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Usuarios> _userManager;

        public ConsultasController(IConsultasService consultasService, UserManager<Usuarios> userManager, ApplicationDbContext context, INotificacaoService notificacaoService)
        {
            this._consultasService = consultasService;
            this._userManager = userManager;
            this._context = context;
            this._notificacaoService = notificacaoService;
        }
        
        [HttpGet("listar")]
        public async Task<IActionResult> ListarConsultasAgendadas(int PaginaAtual, int ItensPorPagina, int? TipoConsultaFiltro)
        {   
            try
            {

                var usuarioLogado = await _userManager.GetUserAsync(User);
                if (usuarioLogado != null && await _userManager.IsInRoleAsync(usuarioLogado, "Admin"))
                {
                    var query = _context.Consultas.AsQueryable();
                    if (TipoConsultaFiltro != null)
                    {
                        query = query.Where(c => c.TipoConsultaId == TipoConsultaFiltro);
                    }
                    var consultas = await query.Include(c => c.Usuario)
                                                .Include(c => c.TipoConsulta)
                                                .OrderBy(c => c.Status)
                                                .ThenBy(c => c.Data)
                                                .ThenBy(c => c.Inicio)
                                                .IgnoreQueryFilters()
                                                .Skip((PaginaAtual - 1) * ItensPorPagina)
                                                .Take(ItensPorPagina)
                                                .AsNoTracking()
                                                .ToListAsync();
                                                            
                    if (consultas == null || consultas.Count() <= 0) return NoContent();

                    return Ok(consultas);
                }
                else
                {
                    var consultas = await _consultasService.ListarConsultas(PaginaAtual, ItensPorPagina, TipoConsultaFiltro);
                    if (consultas == null || consultas.Count() <= 0) return NoContent();

                    return Ok(consultas);
                }
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                throw ;
            }
        }

        [HttpPost("marcar")]
        public async Task<IActionResult> MarcarConsulta(Consultas model)
        {
            try
            {
                var consulta = await _consultasService.MarcarConsulta(model);
                return Created("Consulta marcada com sucesso", consulta);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                Console.WriteLine(ex);
                throw;
            }
        }
        [HttpPatch("cancelar/{ConsultaId}")]
        public async Task<IActionResult> CancelarConsulta(int ConsultaId)
        {
            try
            {
                var cancelada = await _consultasService.CancelarConsulta(ConsultaId);
                return Ok("Consulta cancelada com sucesso.");
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPatch("{ConsultaId}/status/{StatusId}")]
        public async Task<IActionResult> CancelarConsulta(int ConsultaId, StatusConsulta StatusId)
        {
            try
            {
                var usuarioLogado = await _userManager.GetUserAsync(User);
                if (usuarioLogado != null && await _userManager.IsInRoleAsync(usuarioLogado, "Admin"))
                {
                    await _consultasService.AtualizarStatusConsulta(ConsultaId, StatusId);
                }
                
                return Ok();
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpGet("tipos")]
        public async Task<IActionResult> BuscarTiposConsultas()
        {
            try
            {
                var usuarioLogado = await _userManager.GetUserAsync(User);
                if (usuarioLogado != null && await _userManager.IsInRoleAsync(usuarioLogado, "Admin"))
                {
                    var tipoConsultas = await _context.TipoConsulta.IgnoreQueryFilters().ToListAsync();
                    if (tipoConsultas == null || tipoConsultas.Count() <= 0) return NoContent();

                    return Ok(tipoConsultas);
                }
                else
                {
                    var tipoConsultas = await _consultasService.BuscarTipoConsultas(); 
                    if (tipoConsultas == null) return NoContent();

                    tipoConsultas = tipoConsultas.Where(c => c.Ativo == true).ToList();

                    return Ok(tipoConsultas); 
                }
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpGet("tipos/{TipoConsultaId}")]
        public async Task<IActionResult> BuscarTiposConsultaPorId(int TipoConsultaId)
        {
            try
            {
                var tipoConsulta = await _consultasService.BuscarTipoConsultaPorId(TipoConsultaId); 
                if(tipoConsulta == null) return NoContent();

                return Ok(tipoConsulta);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("tipos/{TipoConsultaId}/horarios")]
        public async Task<IActionResult> BuscarHorariosPorTipoConsulta(int TipoConsultaId, [FromBody] string DiaSelecionado)
        {
            try
            {
                var horarios = await _consultasService.BuscarHorariosPorTipoConsulta(TipoConsultaId, DiaSelecionado); 
                if(horarios == null || horarios.Count() == 0) return NoContent();

                return Ok(horarios);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, new { 
                    message = ex.Message, 
                    inner = ex.InnerException?.Message, 
                    stack = ex.StackTrace 
                });
            }
        }

        [HttpPatch("tipos/{TipoConsultaId}/alterar")]
        public async Task<IActionResult> AlterarTipoConsulta(int TipoConsultaId, [FromQuery] bool ativo)
        {
            try
            {
                var tipoConsulta = await _consultasService.AlterarTipoConsulta(TipoConsultaId, ativo);
                if(tipoConsulta == null) return NoContent();

                return Ok(tipoConsulta);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("cadastrar/tipoConsulta")]
        public async Task<IActionResult> CadastrarTipoConsulta(TipoConsulta model)
        {
            try
            {
                var tipoConsultaCadastrado = await _consultasService.CadastrarTipoConsulta(model);
                if (tipoConsultaCadastrado != null)
                {
                    return Ok(tipoConsultaCadastrado);
                }
                else
                {
                    return BadRequest("Houve um erro ao cadastrar o tipo Consulta");
                }
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("cadastrar/tipoConsulta/imagem/{ConsultaId}")]
        public async Task<IActionResult> CadastrarTipoConsultaImagem([FromForm] IFormFile imagem, int ConsultaId)
        {
            try
            {
                await _consultasService.CadastrarTipoConsultaImagem(imagem, ConsultaId);
                return Ok("Imagem cadastrada com sucesso");
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }
        [HttpPost("editar/tipoConsulta/imagem/{ConsultaId}")]
        public async Task<IActionResult> EditarTipoConsultaImagem([FromForm] IFormFile imagem, int ConsultaId)
        {
            try
            {
                await _consultasService.EditarTipoConsultaImagem(imagem, ConsultaId);
                return Ok(new { mensagem = "Imagem Editada com sucesso"});
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("editar/tipoConsulta/{TipoConsultaId}")]
        public async Task<IActionResult> EditarTipoConsulta(int TipoConsultaId, [FromBody] TipoConsulta model)
        {
            try
            {
                var tipoConsultaEditado = await _consultasService.EditarTipoConsulta(TipoConsultaId, model);
                if (tipoConsultaEditado != null)
                {
                    return Ok(tipoConsultaEditado);
                }
                else
                {
                    return BadRequest("Houve um erro ao editar o tipo Consulta");
                }
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("cadastrar/horario")]
        public async Task<IActionResult> CadastrarHorarioConsulta(HorarioConsultas model)
        {
            try
            {
                var horarioCadastrado = await _consultasService.CadastrarHorarioConsulta(model);
                return Created("Horário cadastrado com sucesso", horarioCadastrado);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }
        [HttpPost("cadastrar/horarios/{TipoConsultaId}")]
        public async Task<IActionResult> CadastrarHorariosConsulta([FromRoute] int TipoConsultaId, [FromBody] List<HorarioConsultas> model)
        {
            try
            {
                var horariosCadastrado = await _consultasService.CadastrarHorariosConsulta(model, TipoConsultaId);
                return Created("Horarios cadastrados com sucesso", horariosCadastrado);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPatch("editar/horario")]
        public IActionResult EditarHorario(HorarioConsultas model)
        {
            try
            {
                _consultasService.EditarHorario(model);
                return Ok();
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpGet("buscar/horarios/indisponiveis/{TipoConsultaId}")]
        public async Task<IActionResult> DefinirHorariosIndisponiveis(int TipoConsultaId, [FromQuery] string Data)
        {
            try
            {
                var horariosIndisponiveis = await _consultasService.BuscarHorariosIndisponiveis(TipoConsultaId, Data);
                if (horariosIndisponiveis == null) return NoContent();

                return Ok(horariosIndisponiveis);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("definir/horarios/indisponiveis")]
        public async Task<IActionResult> DefinirHorariosIndisponiveis(HorariosIndisponiveis model)
        {
            try
            {
                await _consultasService.DefinirHorariosIndisponiveis(model);
                return Ok("Horários Definidos");
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("editar/horarios/indisponiveis")]
        public async Task<IActionResult> EditarHorariosIndisponiveis(List<HorariosIndisponiveis> model)
        {
            try
            {
                await _consultasService.EditarHorariosIndisponiveis(model);
                return Ok("Horários Editados");
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPatch("editar/horarios/{TipoConsultaId}")]
        public async Task<IActionResult> EditarHorarios(int TipoConsultaId, List<HorarioConsultas> model)
        {
            try
            {
                await _consultasService.EditarHorarios(TipoConsultaId, model);
                return Ok();
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