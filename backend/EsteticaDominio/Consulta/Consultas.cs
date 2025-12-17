using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using EsteticaDominio.Consulta.enums;

namespace EsteticaDominio.Consulta
{
    public class Consultas
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuarios Usuario { get; set; }
        public int TipoConsultaId { get; set; }
        public TipoConsulta TipoConsulta { get; set; }
        public DateTime Data { get; set; }
        public TimeSpan Inicio { get; set; }
        public TimeSpan Fim { get; set; }
        public StatusConsulta Status { get; set; }
        [Column(TypeName = "NUMERIC(18,2)")]
        public decimal Valor { get; set; }

    }
}