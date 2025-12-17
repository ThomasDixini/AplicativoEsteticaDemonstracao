using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EsteticaDominio.Consulta
{
    public class TipoConsultaHorarios
    {
        public int TipoConsultaId { get; set; }
        public TipoConsulta TipoConsulta { get; set; }
        public int HorarioId { get; set; }
        public HorarioConsultas Horario { get; set; }
        public bool Reservado { get; set; }
        public DateTime DataReserva { get; set; }
    }
}