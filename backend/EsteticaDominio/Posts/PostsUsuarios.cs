using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EsteticaDominio
{
    public class PostsUsuarios
    {
        public int PostId { get; set; }
        Posts Post { get; set; }
        public int UsuarioId { get; set; }
        Usuarios Usuario { get; set; }
    }
}