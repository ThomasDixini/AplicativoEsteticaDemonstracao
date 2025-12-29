using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EsteticaApplication.Helper
{
    public class ImagemUploader
    {
        private static string _CurrentDirectory { get; set; } = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imagens");
        public static string EscreverImagem(int id, string extensao, byte[] imagem)
        {
            ChecaDiretorio();
            var nomeArquivo = $"imagem_{id}_{DateTime.Now.GetHashCode().ToString().Replace("-", "")}{extensao}";
            var caminhoArquivo = Path.Combine(_CurrentDirectory, nomeArquivo);
            
            File.WriteAllBytes(caminhoArquivo, imagem);
            return $"/imagens/{nomeArquivo}";
        }

        public static bool ChecaDiretorio()
        {
            if (!Directory.Exists(_CurrentDirectory))
            {
                Directory.CreateDirectory(_CurrentDirectory);
            }

            return true;
        }
    }
}