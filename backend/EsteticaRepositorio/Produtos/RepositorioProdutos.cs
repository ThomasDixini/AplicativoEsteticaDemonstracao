using EsteticaDominio.Produtos;
using EsteticaRepositorio.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EsteticaRepositorio
{
    public class RepositorioProdutos : IRepositorioProdutos
    {
        private readonly ApplicationDbContext _context;
        private readonly IRepositorioEstetica _repositorio;

        public RepositorioProdutos(ApplicationDbContext context, IRepositorioEstetica repositorio)
        {
            this._context = context;
            this._repositorio = repositorio;
        }
        public async Task<Produtos> BuscarProdutoPorId(int ProdutoId)
        {
            return await Task.Run(() =>  _context.Produtos.FirstAsync(c => c.Id == ProdutoId));
        }

        public async Task<List<Produtos>> BuscarProdutos()
        {
            return await Task.Run(() => _context.Produtos.ToListAsync());
        }

        public async Task<List<TipoProdutos>> BuscarTipoProdutos()
        {
            return await Task.Run(() => _context.TipoProdutos.Include(c => c.Produtos).Select(c => new TipoProdutos
            {
                Id = c.Id,
                Descricao = c.Descricao,
                Nome = c.Nome,
                Ativo = c.Ativo,
                Produtos = c.Produtos != null ? c.Produtos.Select(produto => new Produtos
                {
                    Id = produto.Id,
                    Ativo = produto.Ativo,
                    Descricao = produto.Descricao,
                    EstimativaEntrega = produto.EstimativaEntrega,
                    Nome = produto.Nome,
                    TipoProdutosId = produto.TipoProdutosId,
                    UnidadeMedida = produto.UnidadeMedida,
                    ValorDeCusto = produto.ValorDeCusto,
                    ValorDeVenda = produto.ValorDeVenda,
                    UriImagem = produto.UriImagem
                }).ToList() : null,
            }).ToListAsync());
        }
        public async Task<TipoProdutos?> BuscarTipoProdutoPorId(int TipoProdutoId)
        {
            return await Task.Run(() => _context.TipoProdutos.Include(c => c.Produtos).FirstOrDefaultAsync(c => c.Id == TipoProdutoId));
        }
    }
}