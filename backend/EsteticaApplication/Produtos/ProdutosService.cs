using EsteticaApplication.Helper;
using EsteticaDominio.Produtos;
using EsteticaRepositorio.Interfaces;
using Microsoft.AspNetCore.Http;

namespace EsteticaApplication
{
    public class ProdutosService : IProdutosService
    {
        private readonly IRepositorioProdutos _repositorioProdutos;
        private readonly IRepositorioEstetica _repositorioEstetica;

        public ProdutosService(IRepositorioProdutos repositorioProdutos, IRepositorioEstetica repositorioEstetica)
        {
            this._repositorioProdutos = repositorioProdutos;
            this._repositorioEstetica = repositorioEstetica;
        }
        public async Task<List<TipoProdutos>> BuscarTipoProdutos()
        {
            var tipoProdutos = await _repositorioProdutos.BuscarTipoProdutos();
            return tipoProdutos;
        }

        public async Task<Produtos> CadastrarProduto(Produtos model)
        {
            model.Id = 0;
            model.Nome = model.Nome.ToUpper();
            model.UnidadeMedida = model.UnidadeMedida.ToUpper();


            _repositorioEstetica.Add(model);
            await _repositorioEstetica.SaveChangesAsync();

            return model;
        }
        public async Task CadastrarProdutoImagem(IFormFile imagem, int ProdutoId)
        {
            using var ms = new MemoryStream();
            await imagem.CopyToAsync(ms);
            var bytes = ms.ToArray();

            var produto = await _repositorioProdutos.BuscarProdutoPorId(ProdutoId);
            produto.Imagem = bytes;

            var uri = ImagemUploader.EscreverImagem(produto.Id, ".jpg", bytes);
            produto.UriImagem = uri;

            _repositorioEstetica.Update(produto);
            await _repositorioEstetica.SaveChangesAsync();

            return;
        }
        public async Task<TipoProdutos> CadastrarTipoProduto(TipoProdutos model)
        {
            model.Id = 0;
            model.Nome = model.Nome.ToUpper();
            model.Descricao = model.Descricao.ToUpper();

            _repositorioEstetica.Add(model);
            await _repositorioEstetica.SaveChangesAsync();

            return model;
        }

        public async Task<Produtos> EditarProduto(Produtos model)
        {
            model.Nome = model.Nome.ToUpper();
            model.UnidadeMedida = model.UnidadeMedida.ToUpper();

            _repositorioEstetica.Update(model);
            await _repositorioEstetica.SaveChangesAsync();

            return model;
        }
        public async Task<TipoProdutos> EditarTipoProduto(TipoProdutos model)
        {
            model.Nome = model.Nome.ToUpper();
            model.Descricao = model.Descricao.ToUpper();

            _repositorioEstetica.Update(model);
            await _repositorioEstetica.SaveChangesAsync();

            return model;
        }

        public async Task<bool> InativarProduto(int ProdutoId)
        {
            var produto = await _repositorioProdutos.BuscarProdutoPorId(ProdutoId);
            if(produto == null) throw new Exception("Produto inexistente");

            produto.Ativo = false;

            _repositorioEstetica.Update(produto);
            if(await _repositorioEstetica.SaveChangesAsync())
            {
                return true;
            }
            else 
            {
                return false;
            }
        }

        public async Task<List<Produtos>> ListarProdutos()
        {
            var produtos = await _repositorioProdutos.BuscarProdutos();
            ImagemConversor.ConverterParaImagemBase64(produtos);
            return produtos;
        }

        public async Task<Produtos> BuscarProdutoPorId(int ProdutoId)
        {
            var produto = await _repositorioProdutos.BuscarProdutoPorId(ProdutoId);
            return produto;
        }
        public async Task<TipoProdutos?> BuscarTipoProdutoPorId(int TipoProdutoId)
        {
            var tipoProduto = await _repositorioProdutos.BuscarTipoProdutoPorId(TipoProdutoId);
            return tipoProduto;
        }
        
        public async Task<Produtos?> AlterarProduto(int ProdutoId, bool ativo)
        {
            var produto = await _repositorioProdutos.BuscarProdutoPorId(ProdutoId);
            if (produto == null) return null;

            produto.Ativo = ativo;
            _repositorioEstetica.Update(produto);
            await _repositorioEstetica.SaveChangesAsync();
            return produto;
        }

        public async Task<TipoProdutos?> AlterarTipoProduto(int TipoProdutoId, bool ativo)
        {
            var tipoProduto = await _repositorioProdutos.BuscarTipoProdutoPorId(TipoProdutoId);
            if (tipoProduto == null) return null;

            tipoProduto.Ativo = ativo;
            foreach (var produto in tipoProduto.Produtos)
            {
                if (ativo == false)
                {
                    produto.Ativo = ativo;
                }
            }

            _repositorioEstetica.Update(tipoProduto);
            await _repositorioEstetica.SaveChangesAsync();
            return tipoProduto;
        }

        public async Task EditarProdutoImagem(IFormFile imagem, int ProdutoId)
        {
            using var ms = new MemoryStream();
            await imagem.CopyToAsync(ms);
            var bytes = ms.ToArray();

            var produto = await _repositorioProdutos.BuscarProdutoPorId(ProdutoId);

            var uri = ImagemUploader.EscreverImagem(produto.Id, ".jpg", bytes);
            produto.UriImagem = uri;

            _repositorioEstetica.Update(produto);
            await _repositorioEstetica.SaveChangesAsync();

            return;
        }
    }
}