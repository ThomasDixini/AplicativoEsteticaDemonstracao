using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaApplication.interfaces;
using EsteticaDominio;
using EsteticaRepositorio.Interfaces;

namespace EsteticaApplication
{
    public class PostService : IPostService
    {
        private readonly IRepositorioEstetica _repositorioEstetica;
        private readonly IRepositorioPosts _repositorioPosts;

        public PostService(IRepositorioEstetica repositorioEstetica, IRepositorioPosts repositorioPosts)
        {
            this._repositorioEstetica = repositorioEstetica;
            this._repositorioPosts = repositorioPosts;
        }

        public async Task<List<Posts>> BuscarPosts()
        {
            return await Task.Run(() => _repositorioPosts.BuscarPosts());
        }

        public async Task<Posts?> CadastrarPost(Posts post)
        {
            post.QuantidadeAcesso = 0;
            post.QuantidadeLike = 0;
            post.Titulo = post.Titulo.ToUpper();
            post.Descricao = post.Descricao.ToUpper();
            if(!post.ImagemURL.Contains("http://") || !post.ImagemURL.Contains("https://")) throw new Exception("URL da imagem inválida.");

            _repositorioEstetica.Add(post);
            await _repositorioEstetica.SaveChangesAsync();

            return post;
        }

        public async Task<bool> DeletarPost(int PostId)
        {
            var post = await _repositorioPosts.BuscarPostPorId(PostId);
            if(post == null) throw new Exception("Post inexistente.");

            _repositorioEstetica.Delete(post);
            if(await _repositorioEstetica.SaveChangesAsync())
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<Posts?> EditarPost(Posts post)
        {
            post.QuantidadeAcesso = 0;
            post.QuantidadeLike = 0;
            post.Titulo = post.Titulo.ToUpper();
            post.Descricao = post.Descricao.ToUpper();
            if(!post.ImagemURL.Contains("http://") || !post.ImagemURL.Contains("https://")) throw new Exception("URL da imagem inválida.");

            _repositorioEstetica.Update(post);
            await _repositorioEstetica.SaveChangesAsync();

            return post;
        }
    }
}