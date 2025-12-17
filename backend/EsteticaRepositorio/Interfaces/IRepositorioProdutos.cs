using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio.Produtos;

namespace EsteticaRepositorio.Interfaces
{
    public interface IRepositorioProdutos
    {
        Task<List<Produtos>> BuscarProdutos();
        Task<Produtos> BuscarProdutoPorId(int ProdutoId);
        Task<List<TipoProdutos>> BuscarTipoProdutos();
        Task<TipoProdutos?> BuscarTipoProdutoPorId(int TipoProdutoId);
    }
}