using EsteticaDominio.Consulta;
using EsteticaDominio.Produtos;

namespace EsteticaApplication
{
    public class ImagemConversor 
    {
        public static void ConverterParaImagemBase64(List<TipoProdutos> tipoProdutos)
        {
            foreach (var tipoProduto in tipoProdutos)
            {
                foreach (var produto in tipoProduto.Produtos)
                {
                    if (produto.Imagem != null)
                    {
                        produto.ImagemBase64 = Convert.ToBase64String(produto.Imagem);
                    }
                }
            }
        }
        public static void ConverterParaImagemBase64(List<TipoConsulta> tipoConsultas)
        {
            foreach (var tipoConsulta in tipoConsultas)
            {
                if (tipoConsulta.Imagem != null)
                {
                    tipoConsulta.ImagemBase64 = Convert.ToBase64String(tipoConsulta.Imagem);
                }
            }
        }
        public static void ConverterParaImagemBase64(List<Produtos> produtos)
        {
            foreach (var produto in produtos)
            {
                if (produto.Imagem != null)
                {
                    produto.ImagemBase64 = Convert.ToBase64String(produto.Imagem);
                }
            }
        }
        public static void ConverterParaImagemBase64(Produtos produto)
        {
            if (produto.Imagem != null)
            {
                produto.ImagemBase64 = Convert.ToBase64String(produto.Imagem);
            }
        }
    }
}