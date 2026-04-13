using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio.Produtos;
using EsteticaRepositorio;
using EsteticaRepositorio.Interfaces;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace EsteticaRepositorioTests.RepositorioProdutosTests
{
    public class RepositorioProdutosTests
    {
        private readonly IRepositorioProdutos _repositorioProdutos;
        private readonly IRepositorioEstetica _repositorioEstetica;
        private readonly ApplicationDbContext _context;

        public RepositorioProdutosTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _repositorioEstetica = new RepositorioEstetica(_context);
            _repositorioProdutos = new RepositorioProdutos(_context, _repositorioEstetica);
        }

        [Fact]
        public async Task BuscarProdutoPorId_DeveRetornarProdutoExistente_QuandoIdCorresponder()
        {
            var tipoProduto = new TipoProdutos
            {
                Id = 1,
                Nome = "Teste",
                Descricao = "Teste",
                Ativo = true
            };
            _context.TipoProdutos.Add(tipoProduto);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var produto = new Produtos
            {
                Id = 1,
                Nome = "Produto Teste",
                Descricao = "Descrição do Produto Teste",
                ValorDeCusto = 50,
                ValorDeVenda = 100,
                EstimativaEntrega = 7,
                UnidadeMedida = "Unidade",
                TipoProdutosId = tipoProduto.Id,
                Ativo = true
            };
            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioProdutos.BuscarProdutoPorId(produto.Id);

            resultado.Should().NotBeNull();
            resultado.Id.Should().Be(produto.Id);
            resultado.Nome.Should().Be(produto.Nome);
            resultado.Descricao.Should().Be(produto.Descricao);
            resultado.ValorDeCusto.Should().Be(produto.ValorDeCusto);
            resultado.ValorDeVenda.Should().Be(produto.ValorDeVenda);
            resultado.EstimativaEntrega.Should().Be(produto.EstimativaEntrega);
            resultado.UnidadeMedida.Should().Be(produto.UnidadeMedida);
            resultado.TipoProdutosId.Should().Be(produto.TipoProdutosId);
            resultado.Ativo.Should().Be(produto.Ativo);
        }

        [Fact]
        public async Task BuscarProdutos_DeveRetornarTodosProdutosExistentes()
        {
            var tipoProduto = new TipoProdutos
            {
                Id = 1,
                Nome = "Teste",
                Descricao = "Teste",
                Ativo = true
            };
            _context.TipoProdutos.Add(tipoProduto);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var produto1 = new Produtos
            {
                Id = 1,
                Nome = "Produto Teste 1",
                Descricao = "Descrição do Produto Teste 1",
                ValorDeCusto = 50,
                ValorDeVenda = 100,
                EstimativaEntrega = 7,
                UnidadeMedida = "Unidade",
                TipoProdutosId = tipoProduto.Id,
                Ativo = true
            };
            var produto2 = new Produtos
            {
                Id = 2,
                Nome = "Produto Teste 2",
                Descricao = "Descrição do Produto Teste 2",
                ValorDeCusto = 30,
                ValorDeVenda = 60,
                EstimativaEntrega = 5,
                UnidadeMedida = "Unidade",
                TipoProdutosId = tipoProduto.Id,
                Ativo = true
            };
            _context.Produtos.AddRange(produto1, produto2);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioProdutos.BuscarProdutos();

            resultado.Should().NotBeNull();
            resultado.Count.Should().Be(2);
        }

        [Fact]
        public async Task BuscarTipoProdutos_DeveRetornarTodosTiposProdutosExistentes()
        {
            var produto = new Produtos
            {
                Id = 1,
                Nome = "Produto Teste",
                Descricao = "Descrição do Produto Teste",
                UriImagem = "http://example.com/produto.jpg",
                ValorDeCusto = 50,
                ValorDeVenda = 100,
                EstimativaEntrega = 7,
                UnidadeMedida = "Unidade",
                TipoProdutosId = 1,
                Ativo = true
            };
            var tipoProduto1 = new TipoProdutos
            {
                Id = 1,
                Nome = "Teste 1",
                Descricao = "Teste 1",
                Ativo = true,
                Produtos = new List<Produtos> { produto }
            };
            var tipoProduto2 = new TipoProdutos
            {
                Id = 2,
                Nome = "Teste 2",
                Descricao = "Teste 2",
                Ativo = true,
                Produtos = new List<Produtos>()
            };
            _context.TipoProdutos.AddRange(tipoProduto1, tipoProduto2);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioProdutos.BuscarTipoProdutos();

            resultado.Should().NotBeNull();
            resultado.Count.Should().Be(2);
        }

        [Fact]
        public async Task BuscarTipoProdutoPorId_DeveRetornarTipoProdutoExistente_QuandoIdCorresponder()
        {
            var tipoProduto = new TipoProdutos
            {
                Id = 1,
                Nome = "Teste",
                Descricao = "Teste",
                Ativo = true
            };
            _context.TipoProdutos.Add(tipoProduto);
            await _context.SaveChangesAsync(cancellationToken: CancellationToken.None);

            var resultado = await _repositorioProdutos.BuscarTipoProdutoPorId(tipoProduto.Id);

            resultado.Should().NotBeNull();
            resultado.Id.Should().Be(tipoProduto.Id);
            resultado.Nome.Should().Be(tipoProduto.Nome);
            resultado.Descricao.Should().Be(tipoProduto.Descricao);
            resultado.Ativo.Should().Be(tipoProduto.Ativo);
        }
    }
}