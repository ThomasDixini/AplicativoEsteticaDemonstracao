using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using EsteticaDominio.Consulta;
using Microsoft.AspNetCore.Identity;

namespace EsteticaDominio
{
    public class Usuarios : IdentityUser<int>
    {
        public string PrimeiroNome { get; set; }
        public string UltimoNome { get; set; }
        public char Genero { get; set; }
        public string Telefone { get; set;  }
        public string Cidade { get; set;  }
        public string NotificacaoToken { get; set;  }
        [NotMapped]
        public string NovaSenha { get; set; }
        public IEnumerable<IdentityUserRole<int>> Roles { get; set; }
        public List<Consultas> Consultas { get; set; }
        public List<PostsUsuarios> PostsUsuarios { get; set; }
        
    }
}