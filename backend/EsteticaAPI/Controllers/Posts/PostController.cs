using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaApplication.interfaces;
using EsteticaDominio;
using Microsoft.AspNetCore.Mvc;

namespace EsteticaAPI.Controllers
{
    [ApiController]
    [Route("api/posts")]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostController(IPostService postService)
        {
            this._postService = postService;
        }
        [HttpGet("listar")]
        public async Task<IActionResult> BuscarTodosPosts()
        {
            try
            {
                var posts = await _postService.BuscarPosts();
                return Ok(posts);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }
        [HttpGet("cadastrar")]
        public async Task<IActionResult> CadastrarPost(Posts post)
        {
            try
            {
                var postCadastrado = await _postService.CadastrarPost(post);
                return Created("Post cadastrado com sucesso", postCadastrado);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }
        [HttpGet("editar")]
        public async Task<IActionResult> EditarPost(Posts post)
        {
            try
            {
                var postEditado = await _postService.EditarPost(post);
                return Ok(postEditado);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message ?? ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }
        [HttpGet("deletar/{PostId}")]
        public async Task<IActionResult> DeletarPost(int PostId)
        {
            try
            {
                await _postService.DeletarPost(PostId);
                return Ok("Post deletado com sucesso.");
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