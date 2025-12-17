import { Produtos } from "@/interfaces/Produtos/Produtos";
import { TipoProdutos } from "@/interfaces/Produtos/TipoProdutos";
import { api } from "@/utils/api"

const api_url = '/produtos'

export async function buscarTipoProdutos() {
    const produtos: TipoProdutos[] = await api.get(`${api_url}/tipo-produtos`).then(response => response.data);
    return produtos;
}
export async function buscarTipoProdutoPorId(tipoProdutoId: number) {
    return await api.get(`${api_url}/tipo-produto/${tipoProdutoId}`)
}

export async function cadastrarTipoProduto(tipoProduto: TipoProdutos) {
    const tipoProdutoResponse: TipoProdutos = await api.post(`${api_url}/cadastrar_tipoProduto`, tipoProduto)
    return tipoProdutoResponse;
}

export async function cadastrarProduto(produto: Produtos) {
    const produtoResponse: Produtos = await api.post(`${api_url}/cadastrar`, produto).then(res => res.data)
    return produtoResponse;
}

export async function cadastrarProdutoImagem(formData: FormData, produtoId: number) {
    console.log(formData)
    console.log(produtoId)
    const response = await api.post(`${api_url}/cadastrar_imagem/${produtoId}`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data', // ✅ Correto
            'Accept': 'application/json',
        },
    }).catch(error => {
        console.error("❌ ERRO AO ENVIAR IMAGEM");

        if (error.isAxiosError) {
            console.error("⚠️ Axios error.code:", error.code);
            console.error("⚠️ Axios error.message:", error.message);
            console.error("⚠️ Axios error.request:", error.request);
            console.error("⚠️ Axios error.response:", error.response);
            console.error("⚠️ Axios error.toJSON():", error.toJSON());
        } else {
            console.error("❌ Erro desconhecido:", error);
        }

        throw error;
    })
    return response;
}

export async function alterarProduto(produtoId: number, ativo: boolean) {
    return await api.patch(`${api_url}/${produtoId}/alterar`, null, {
        params: {
            ativo: ativo
        }
    })
}

export async function alterarTipoProduto(tipoProdutoId: number, ativo: boolean) {
    return await api.patch(`${api_url}/tipo-produto/${tipoProdutoId}/alterar`, null, {
        params: {
            ativo: ativo
        }
    })
}

export async function buscarProdutoPorId(produtoId: number) {
    return await api.get(`${api_url}/${produtoId}`)
}

export async function editarProduto(produto: Produtos) {
    return await api.put(`${api_url}/editar`, produto)
}

export async function editarTipoProduto(tipoProduto: TipoProdutos) {
    return await api.put(`${api_url}/tipo-produto/editar`, tipoProduto)
}

export async function editarProdutoImagem(imagem: FormData, produtoId: number) {
    return await api.post(`${api_url}/editar/produto/imagem/${produtoId}`, imagem, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}