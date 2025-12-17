using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EsteticaDominio.DTO
{
    public class RegistrarDTO
    {
        public string Username { get; set;}
        public string Password { get; set;}
        public string PrimeiroNome { get; set;}
        public string UltimoNome { get; set;}
        public string Cidade { get; set;}
        public string Telefone { get; set;}
        public char Genero { get; set; }
    }
}