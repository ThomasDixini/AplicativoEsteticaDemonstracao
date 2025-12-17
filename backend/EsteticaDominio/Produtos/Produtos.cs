using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio.Consulta;

namespace EsteticaDominio.Produtos
{
    public class Produtos
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string UriImagem { get; set;  }
        public byte[] Imagem { get; set; }
        [NotMapped]
        public string ImagemBase64 { get; set; }
        
        [StringLength(2, MinimumLength = 2)]
        public string UnidadeMedida { get; set; }
        [Column(TypeName = "NUMERIC(18,2)")]
        public decimal ValorDeVenda { get; set; }
        [Column(TypeName = "NUMERIC(18,2)")]
        public decimal ValorDeCusto { get; set; }
        public int EstimativaEntrega { get; set;}
        public bool Ativo { get; set; }
        public int TipoProdutosId { get; set; }
        public TipoProdutos TipoProdutos { get; set; }
    }
}