using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EsteticaDominio.Produtos
{
    public class TipoProdutos
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        
        public string Descricao { get; set; }
        public bool Ativo { get; set; }
        public List<Produtos> Produtos { get; set; } = new List<Produtos>();
    }
}