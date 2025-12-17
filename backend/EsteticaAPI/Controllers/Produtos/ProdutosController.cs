using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaApplication;
using EsteticaDominio;
using EsteticaDominio.Produtos;
using EsteticaRepositorio;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EsteticaAPI.Controllers
{
    [ApiController]
    [Route("api/produtos")]
    public class ProdutosController : ControllerBase
    {
        private readonly IProdutosService _produtosService;
        private readonly UserManager<Usuarios> _userManager;
        private readonly ApplicationDbContext _context;

        public ProdutosController(IProdutosService produtosService, UserManager<Usuarios> userManager, ApplicationDbContext context)
        {
            this._produtosService = produtosService;
            this._userManager = userManager;
            this._context = context;
        }

        [HttpGet("listar")]
        public async Task<IActionResult> ListarProdutos()
        {
            try
            {
                var produtos = await _produtosService.ListarProdutos();
                if (produtos == null || produtos.Count() <= 0) return NoContent();

                return Ok(produtos);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpGet("{ProdutoId}")]
        public async Task<IActionResult> BuscarProdutoPorId(int ProdutoId)
        {
            try
            {
                var produto = await _produtosService.BuscarProdutoPorId(ProdutoId);
                if (produto == null) return NoContent();

                return Ok(produto);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpGet("tipo-produto/{TipoProdutoId}")]
        public async Task<IActionResult> BuscarTipoProdutoPorId(int TipoProdutoId)
        {
            try
            {
                var tipoProduto = await _produtosService.BuscarTipoProdutoPorId(TipoProdutoId);
                if (tipoProduto == null) return NoContent();

                return Ok(tipoProduto);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("cadastrar")]
        public async Task<IActionResult> CadastrarProduto(Produtos model)
        {
            try
            {
                var produtoCadastrado = await _produtosService.CadastrarProduto(model);
                return Created("Produto Cadastrado com sucesso!", produtoCadastrado);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }
        [HttpPost("cadastrar_imagem/{ProdutoId}")]
        public async Task<IActionResult> CadastrarProdutoImagem([FromForm] IFormFile imagem, int ProdutoId)
        {
            try
            {
                if (imagem == null || imagem.Length == 0)
                    return BadRequest("Nenhuma imagem enviada");

                await _produtosService.CadastrarProdutoImagem(imagem, ProdutoId);
                return Ok("Imagem cadastrada com sucesso!");
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPost("cadastrar_tipoProduto")]
        public async Task<IActionResult> CadastrarTipoProduto(TipoProdutos model)
        {
            try
            {
                var tipoProduto = await _produtosService.CadastrarTipoProduto(model);
                return Created("Tipo Produto Cadastrado com sucesso!", tipoProduto);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPut("editar")]
        public async Task<IActionResult> EditarProduto(Produtos model)
        {
            try
            {
                var produtoEditado = await _produtosService.EditarProduto(model);
                return Ok(produtoEditado);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPut("tipo-produto/editar")]
        public async Task<IActionResult> EditarTipoProduto(TipoProdutos model)
        {
            try
            {
                var tipoProdutoEditado = await _produtosService.EditarTipoProduto(model);
                return Ok(tipoProdutoEditado);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPatch("inativar/{ProdutoId}")]
        public async Task<IActionResult> InativarProduto(int ProdutoId)
        {
            try
            {
                var inativado = await _produtosService.InativarProduto(ProdutoId);
                if (inativado)
                    return Ok(inativado);

                return BadRequest("Houve um erro ao tentar inativar produto.");
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpGet("tipo-produtos")]
        public async Task<IActionResult> BuscarTipoProdutos()
        {
            try
            {
                var usuarioLogado = await _userManager.GetUserAsync(User);
                if (usuarioLogado != null && await _userManager.IsInRoleAsync(usuarioLogado, "Admin"))
                {
                    var tipoProdutos = await _produtosService.BuscarTipoProdutos();
                    if (tipoProdutos == null || tipoProdutos.Count() <= 0) return NoContent();

                    return Ok(tipoProdutos);
                }
                else
                {
                    var tipoProdutos = await _produtosService.BuscarTipoProdutos();
                    if (tipoProdutos == null) return NoContent();

                    foreach (var tipoProduto in tipoProdutos)
                    {
                        tipoProduto.Produtos = tipoProduto.Produtos.Where(c => c.Ativo == true).ToList();
                    }

                    return Ok(tipoProdutos);
                }
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPatch("{ProdutoId}/alterar")]
        public async Task<IActionResult> AlterarProduto(int ProdutoId, [FromQuery] bool ativo)
        {
            try
            {
                var produto = await _produtosService.AlterarProduto(ProdutoId, ativo);
                if (produto == null) return NoContent();

                return Ok(produto);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        [HttpPatch("tipo-produto/{TipoProdutoId}/alterar")]
        public async Task<IActionResult> AlterarTipoProduto(int TipoProdutoId, [FromQuery] bool ativo)
        {
            try
            {
                var tipoProduto = await _produtosService.AlterarTipoProduto(TipoProdutoId, ativo);
                if (tipoProduto == null) return NoContent();

                return Ok(tipoProduto);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }
        
        [HttpPost("editar/produto/imagem/{ProdutoId}")]
        public async Task<IActionResult> EditarTipoConsultaImagem([FromForm] IFormFile imagem, int ProdutoId)
        {
            try
            {
                await _produtosService.EditarProdutoImagem(imagem, ProdutoId);
                return Ok(new { mensagem = "Imagem Editada com sucesso"});
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