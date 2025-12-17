export interface Card {
    id: number,
    nome: string,
    descricao: string,
    imagemBase64?: string
    uriImagem?: string;
    ativo: boolean;
}