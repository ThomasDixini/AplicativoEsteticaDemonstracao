using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace EsteticaDominio.Consulta
{
    public class TipoConsulta
    {
        public int Id { get; set; }
        public required string Nome { get; set; }
        public string Descricao { get; set; }
        [Column(TypeName = "NUMERIC(18,2)")]
        public decimal ValorAtual { get; set; }
        public string UriImagem { get; set;  }
        public byte[] Imagem { get; set; }
        [NotMapped]
        public string ImagemBase64 { get; set; }
        public bool Ativo { get; set; }
        [JsonIgnore]

        public List<Consultas> Consultas { get; set; } = new List<Consultas>();
        public List<TipoConsultaHorarios> TipoConsultaHorarios { get; set; }
    }
}