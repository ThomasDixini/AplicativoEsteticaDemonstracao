using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio.Produtos;
using EsteticaRepositorio.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Moq;

namespace EsteticaApplication.Tests.ProdutosTests
{
    public class ProdutosServiceTests
    {
        private readonly Mock<IRepositorioProdutos> _repositorioProdutos;
        private readonly Mock<IRepositorioEstetica> _repositorioEstetica;
        private readonly ProdutosService _produtosService;
        public ProdutosServiceTests()
        {
            _repositorioProdutos = new Mock<IRepositorioProdutos>();
            _repositorioEstetica = new Mock<IRepositorioEstetica>();
            _produtosService = new ProdutosService(_repositorioProdutos.Object, _repositorioEstetica.Object);
        }

        [Fact]
        public async Task BuscarTipoProdutos_DeveRetornarListaDeTiposDeProdutos()
        {
            var tipoProdutosMock = new List<TipoProdutos>
            {
                new TipoProdutos { Id = 1, Nome = "Tipo 1", Descricao = "Descrição do Tipo 1" },
                new TipoProdutos { Id = 2, Nome = "Tipo 2", Descricao = "Descrição do Tipo 2" }
            };
            _repositorioProdutos.Setup(r => r.BuscarTipoProdutos()).ReturnsAsync(tipoProdutosMock);

            var resultado = await _produtosService.BuscarTipoProdutos();

            resultado.Should().HaveCount(2);
            resultado.Should().BeEquivalentTo(tipoProdutosMock);
        }

        [Fact]
        public async Task CadastrarProduto_DeveCadastrarNovoProduto()
        {
            var produto = new Produtos
            {
                Id = 0,
                Nome = "Produto Teste",
                UnidadeMedida = "Un",
            };

            var resultado = await _produtosService.CadastrarProduto(produto);

            resultado.Nome.Should().BeUpperCased();
            resultado.UnidadeMedida.Should().BeUpperCased();
            _repositorioEstetica.Verify(r => r.Add(It.IsAny<Produtos>()), Times.Once);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task CadastrarProduto_DeveRetornarErro_QuandoNomeForInvalido()
        {
            var produto = new Produtos
            {
                Id = 0,
                UnidadeMedida = "Un",
            };

            var resultado = async () => await _produtosService.CadastrarProduto(produto);

            await resultado.Should().ThrowAsync<NullReferenceException>();
            _repositorioEstetica.Verify(r => r.Add(It.IsAny<Produtos>()), Times.Never);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
        [Fact]
        public async Task CadastrarProduto_DeveRetornarErro_QuandoUnidadeMedidaForInvalido()
        {
            var produto = new Produtos
            {
                Id = 0,
                Nome = "Produto Teste",
            };

            var resultado = async () => await _produtosService.CadastrarProduto(produto);

            await resultado.Should().ThrowAsync<NullReferenceException>();
            _repositorioEstetica.Verify(r => r.Add(It.IsAny<Produtos>()), Times.Never);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task CadastrarTipoProduto_DeveCadastrarNovoTipoProduto()
        {
            var tipoProduto = new TipoProdutos
            {
                Id = 0,
                Nome = "Tipo Teste",
                Descricao = "Descrição do Tipo Teste"
            };

            var resultado = await _produtosService.CadastrarTipoProduto(tipoProduto);

            resultado.Nome.Should().BeUpperCased();
            resultado.Descricao.Should().BeUpperCased();

            _repositorioEstetica.Verify(r => r.Add(It.IsAny<TipoProdutos>()), Times.Once);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task CadastrarTipoProduto_DeveRetornarErro_QuandoNomeForInvalido()
        {
            var tipoProduto = new TipoProdutos
            {
                Id = 0,
                Descricao = "Descrição do Tipo Teste"
            };

            var resultado = async () => await _produtosService.CadastrarTipoProduto(tipoProduto);

            await resultado.Should().ThrowAsync<NullReferenceException>();
            _repositorioEstetica.Verify(r => r.Add(It.IsAny<TipoProdutos>()), Times.Never);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
        [Fact]
        public async Task CadastrarTipoProduto_DeveRetornarErro_QuandoDescricaForInvalida()
        {
            var tipoProduto = new TipoProdutos
            {
                Id = 0,
                Nome = "Tipo Teste",
            };

            var resultado = async () => await _produtosService.CadastrarTipoProduto(tipoProduto);

            await resultado.Should().ThrowAsync<NullReferenceException>();
            _repositorioEstetica.Verify(r => r.Add(It.IsAny<TipoProdutos>()), Times.Never);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task EditarProduto_DeveEditarProdutoExistente()
        {
            var produtoEditar = new Produtos
            {
                Id = 1,
                Nome = "Produto Editar",
                UnidadeMedida = "Un"
            };

            var resultado = await _produtosService.EditarProduto(produtoEditar);

            resultado.Nome.Should().BeUpperCased();
            resultado.UnidadeMedida.Should().BeUpperCased();
            _repositorioEstetica.Verify(r => r.Update(It.IsAny<Produtos>()), Times.Once);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task EditarProduto_DeveRetornarErro_QuandoNomeForInvalido()
        {
            var produtoEditar = new Produtos
            {
                Id = 1,
                UnidadeMedida = "Un"
            };

            var resultado = async () => await _produtosService.EditarProduto(produtoEditar);

            await resultado.Should().ThrowAsync<NullReferenceException>();
            _repositorioEstetica.Verify(r => r.Update(It.IsAny<Produtos>()), Times.Never);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
        [Fact]
        public async Task EditarProduto_DeveRetornarErro_QuandoUnidadeMedidaForInvalida()
        {
            var produtoEditar = new Produtos
            {
                Id = 1,
                Nome = "Produto Editar"
            };

            var resultado = async () => await _produtosService.EditarProduto(produtoEditar);

            await resultado.Should().ThrowAsync<NullReferenceException>();
            _repositorioEstetica.Verify(r => r.Update(It.IsAny<Produtos>()), Times.Never);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task EditarTipoProduto_DeveEditarTipoProdutoExistente()
        {
            var tipoProdutoEditar = new TipoProdutos
            {
                Id = 1,
                Nome = "Tipo Produto Editar",
                Descricao = "Descrição do Tipo Produto Editar"
            };

            var resultado = await _produtosService.EditarTipoProduto(tipoProdutoEditar);

            resultado.Nome.Should().BeUpperCased();
            resultado.Descricao.Should().BeUpperCased();
            _repositorioEstetica.Verify(r => r.Update(It.IsAny<TipoProdutos>()), Times.Once);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task EditarTipoProduto_DeveRetornarErro_QuandoNomeForInvalido()
        {
            var tipoProdutoEditar = new TipoProdutos
            {
                Id = 1,
                Descricao = "Descrição do Tipo Produto Editar"
            };

            var resultado = async () => await _produtosService.EditarTipoProduto(tipoProdutoEditar);

            await resultado.Should().ThrowAsync<NullReferenceException>();
            _repositorioEstetica.Verify(r => r.Update(It.IsAny<TipoProdutos>()), Times.Never);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
        [Fact]
        public async Task EditarTipoProduto_DeveRetornarErro_QuandoDescricaoForInvalida()
        {
            var tipoProdutoEditar = new TipoProdutos
            {
                Id = 1,
                Nome = "Tipo Produto Editar"
            };

            var resultado = async () => await _produtosService.EditarTipoProduto(tipoProdutoEditar);

            await resultado.Should().ThrowAsync<NullReferenceException>();
            _repositorioEstetica.Verify(r => r.Update(It.IsAny<TipoProdutos>()), Times.Never);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task InativarProduto_DeveInativarProdutoExistente()
        {
            var produtoId = 1;
            var produtoEsperado = new Produtos
            {
                Id = 1,
                Nome = "Produto Teste",
                Descricao = "Descricao do Produto Teste",
                Ativo = true
            };
            _repositorioProdutos.Setup(r => r.BuscarProdutoPorId(produtoId)).ReturnsAsync(produtoEsperado);
            _repositorioEstetica.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            var resultado = await _produtosService.InativarProduto(produtoId);

            produtoEsperado.Ativo.Should().BeFalse();
            _repositorioEstetica.Verify(r => r.Update(It.IsAny<Produtos>()), Times.Once);
            resultado.Should().BeTrue();
        }
        [Fact]
        public async Task InativarProduto_DeveRetornarErro_QuandoProdutoInexistente()
        {
            var produtoId = 1;

            var resultado = async () => await _produtosService.InativarProduto(produtoId);

            await resultado.Should().ThrowAsync<Exception>().WithMessage("Produto inexistente");
            _repositorioEstetica.Verify(r => r.Update(It.IsAny<Produtos>()), Times.Never);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
        [Fact]
        public async Task InativarProduto_DeveRetornarFalse_QuandoSaveFalhar()
        {
            var produtoId = 1;
            var produtoEsperado = new Produtos
            {
                Id = 1,
                Nome = "Produto Teste",
                Descricao = "Descricao do Produto Teste",
                Ativo = true
            };
            _repositorioProdutos.Setup(r => r.BuscarProdutoPorId(produtoId)).ReturnsAsync(produtoEsperado);
            _repositorioEstetica.Setup(r => r.SaveChangesAsync()).ReturnsAsync(false);

            var resultado = await _produtosService.InativarProduto(produtoId);

            produtoEsperado.Ativo.Should().BeFalse();
            _repositorioEstetica.Verify(r => r.Update(It.IsAny<Produtos>()), Times.Once);
            resultado.Should().BeFalse();
        }

        [Fact]
        public async Task ListarProdutos_DeveRetornarListaDeProdutos()
        {
            var listaProdutos = new List<Produtos>
            {
                new Produtos { Id = 1, Nome = "Produto 1", UnidadeMedida = "Un", Ativo = true },
                new Produtos { Id = 2, Nome = "Produto 2", UnidadeMedida = "Un", Ativo = true }
            };
            _repositorioProdutos.Setup(r => r.BuscarProdutos()).ReturnsAsync(listaProdutos);

            var resultado = await _produtosService.ListarProdutos();

            resultado.Should().HaveCount(2);
            resultado.Should().BeEquivalentTo(listaProdutos);
        }

        [Fact]
        public async Task BuscarProdutoPorId_DeveRetornarProdutoExistente()
        {
            int ProdutoId = 1;
            var produtoEsperado = new Produtos
            {
                Id = 1,
                Nome = "Produto Teste",
                Descricao = "Descricao do Produto Teste",
                Ativo = true
            };
            _repositorioProdutos.Setup(r => r.BuscarProdutoPorId(ProdutoId)).ReturnsAsync(produtoEsperado);

            var resultado = await _produtosService.BuscarProdutoPorId(ProdutoId);

            resultado.Should().BeEquivalentTo(produtoEsperado);
        }

        [Fact]
        public async Task BuscarTipoProdutoPorId_DeveRetornarTipoProdutoExistente()
        {
            int TipoProdutoId = 1;
            var tipoProdutoEsperado = new TipoProdutos
            {
                Id = 1,
                Nome = "Tipo Produto Teste"
            };
            _repositorioProdutos.Setup(r => r.BuscarTipoProdutoPorId(TipoProdutoId)).ReturnsAsync(tipoProdutoEsperado);

            var resultado = await _produtosService.BuscarTipoProdutoPorId(TipoProdutoId);

            resultado.Should().BeEquivalentTo(tipoProdutoEsperado);
        }

        [Fact]
        public async Task AlterarProduto_DeveRetornarProdutoAlterado()
        {
            int ProdutoId = 1;
            bool ativo = false;
            var produtoEsperado = new Produtos
            {
                Id = 1,
                Nome = "Produto Teste",
                Descricao = "Descricao do Produto Teste",
                Ativo = true
            };
            _repositorioProdutos.Setup(r => r.BuscarProdutoPorId(ProdutoId)).ReturnsAsync(produtoEsperado);

            var resultado = await _produtosService.AlterarProduto(ProdutoId, ativo);

            resultado.Should().NotBeNull();
            resultado.Should().BeEquivalentTo(produtoEsperado);
            _repositorioEstetica.Verify(r => r.Update(It.IsAny<Produtos>()), Times.Once);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task AlterarProduto_DeveRetornarNulo_QuandoProdutoNaoExistir()
        {
            int ProdutoId = 1;
            bool ativo = false;

            var resultado = await _produtosService.AlterarProduto(ProdutoId, ativo);

            resultado.Should().BeNull();
        }

        [Fact]
        public async Task AlterarTipoProduto_DeveRetornarNulo_QuandoTipoProdutoNaoExistir()
        {
            int tipoProdutoId = 1;
            bool ativo = false;

            var resultado = await _produtosService.AlterarTipoProduto(tipoProdutoId, ativo);

            resultado.Should().BeNull();
        }
        [Fact]
        public async Task AlterarTipoProduto()
        {
            int tipoProdutoId = 1;
            bool ativo = false;
            var tipoProdutoEsperado = new TipoProdutos
            {
                Id = 1,
                Nome = "Tipo Produto Teste",
                Ativo = true,
                Produtos = new List<Produtos>
                {
                    new Produtos { Id = 1, Nome = "Produto 1", UnidadeMedida = "Un", Ativo = true },
                    new Produtos { Id = 2, Nome = "Produto 2", UnidadeMedida = "Un", Ativo = true }
                }
            };
            _repositorioProdutos.Setup(r => r.BuscarTipoProdutoPorId(tipoProdutoId)).ReturnsAsync(tipoProdutoEsperado);

            var resultado = await _produtosService.AlterarTipoProduto(tipoProdutoId, ativo);

            resultado.Should().NotBeNull();
            resultado.Produtos.Should().AllSatisfy(p => p.Ativo.Should().BeFalse());
            _repositorioEstetica.Verify(r => r.Update(It.IsAny<TipoProdutos>()), Times.Once);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task CadastrarProdutoImagem_DeveCadastrarImagem_QuandoProdutoExistir()
        {
            var content = "Fake image content";
            var bytes = System.Text.Encoding.UTF8.GetBytes(content);
            var stream = new MemoryStream(bytes);
            IFormFile imagem = new FormFile(stream, 0, bytes.Length, "Name", "FileName.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
            int produtoId = 1;
            var produtoEsperado = new Produtos
            {
                Id = produtoId,
                Nome = "Produto Teste",
                Descricao = "Descricao do Produto Teste",
                Ativo = true
            };

            _repositorioProdutos.Setup(r => r.BuscarProdutoPorId(produtoId)).ReturnsAsync(produtoEsperado);

            await _produtosService.CadastrarProdutoImagem(imagem, produtoId);

            _repositorioEstetica.Verify(r => r.Update(It.Is<Produtos>(p => p.Id == produtoId && p.Imagem != null && p.UriImagem != null)), Times.Once);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task CadastrarProdutoImagem_DeveLancarExcecao_QuandoProdutoNaoExistir()
        {
            var content = "Fake image content";
            var bytes = System.Text.Encoding.UTF8.GetBytes(content);
            var stream = new MemoryStream(bytes);
            IFormFile imagem = new FormFile(stream, 0, bytes.Length, "Name", "FileName.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
            int produtoId = 1;

            var resultado = async () => await _produtosService.CadastrarProdutoImagem(imagem, produtoId);

            await resultado.Should().ThrowAsync<NullReferenceException>();
            _repositorioEstetica.Verify(r => r.Update(It.Is<Produtos>(p => p.Id == produtoId && p.Imagem != null && p.UriImagem != null)), Times.Never);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task EditarProdutoImagem_DeveAtualizarImagem_QuandoProdutoExistir()
        {
            var content = "Fake image content";
            var bytes = System.Text.Encoding.UTF8.GetBytes(content);
            var stream = new MemoryStream(bytes);
            IFormFile imagem = new FormFile(stream, 0, bytes.Length, "Name", "FileName.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
            int produtoId = 1;
            var produtoEsperado = new Produtos
            {
                Id = produtoId,
                Nome = "Produto Teste",
                Descricao = "Descricao do Produto Teste",
                Ativo = true
            };
            _repositorioProdutos.Setup(r => r.BuscarProdutoPorId(produtoId)).ReturnsAsync(produtoEsperado);

            await _produtosService.EditarProdutoImagem(imagem, produtoId);

            _repositorioEstetica.Verify(r => r.Update(It.Is<Produtos>(p => p.Id == produtoId && p.UriImagem != null)), Times.Once);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
        [Fact]
        public async Task EditarProdutoImagem_DeveLancarExcecao_QuandoProdutoNaoExistir()
        {
            var content = "Fake image content";
            var bytes = System.Text.Encoding.UTF8.GetBytes(content);
            var stream = new MemoryStream(bytes);
            IFormFile imagem = new FormFile(stream, 0, bytes.Length, "Name", "FileName.jpg")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg"
            };
            int produtoId = 1;

            var resultado = async () => await _produtosService.EditarProdutoImagem(imagem, produtoId);

            await resultado.Should().ThrowAsync<NullReferenceException>();
            _repositorioEstetica.Verify(r => r.Update(It.Is<Produtos>(p => p.Id == produtoId && p.UriImagem != null)), Times.Never);
            _repositorioEstetica.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
    }
}