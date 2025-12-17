export interface Produtos {
    id: number;
    nome: string;
    descricao: string;
    imagemBase64?: string;
    uriImagem?: string;
    unidadeMedida: string;
    valorDeVenda: number;
    valorDeCusto: number;
    estimativaEntrega: number;
    ativo: boolean;
    tipoProdutosId: number;
}