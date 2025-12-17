using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio.Produtos;
using Microsoft.AspNetCore.Http;

namespace EsteticaApplication
{
    public interface IProdutosService
    {
        Task<List<Produtos>> ListarProdutos();
        Task<Produtos> BuscarProdutoPorId(int ProdutoId);
        Task<Produtos> CadastrarProduto(Produtos model);
        Task<TipoProdutos> CadastrarTipoProduto(TipoProdutos model);
        Task CadastrarProdutoImagem(IFormFile model, int ProdutoId);
        Task EditarProdutoImagem(IFormFile model, int ProdutoId);
        Task<bool> InativarProduto(int ProdutoId);
        Task<Produtos> EditarProduto(Produtos model);
        Task<TipoProdutos> EditarTipoProduto(TipoProdutos model);
        Task<List<TipoProdutos>> BuscarTipoProdutos();
        Task<TipoProdutos?> BuscarTipoProdutoPorId(int TipoProdutoId);
        Task<Produtos?> AlterarProduto(int ProdutoId, bool ativo);
        Task<TipoProdutos?> AlterarTipoProduto(int TipoProdutoId, bool ativo);
    }
}