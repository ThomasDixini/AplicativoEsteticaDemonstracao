using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EsteticaDominio
{
    public class Posts
    {
        public int Id { get; set; }
        public string ImagemURL { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public int QuantidadeLike { get; set; }
        public int QuantidadeAcesso { get; set; }
        public List<PostsUsuarios> PostsUsuarios { get; set; }

    }
}