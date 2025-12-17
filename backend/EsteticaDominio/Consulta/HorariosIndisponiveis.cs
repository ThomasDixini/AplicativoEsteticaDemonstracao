using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EsteticaDominio.Consulta
{
    public class HorariosIndisponiveis
    {
        public int Id { get; set; }
        public DateTime Data { get; set; }
        public TimeSpan Inicio { get; set; }
        public TimeSpan Fim { get; set; }
        public bool Ativo { get; set; }
    }
}