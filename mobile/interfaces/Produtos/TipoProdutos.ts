import { Produtos } from "./Produtos";

export interface TipoProdutos {
    id: number;
    nome: string;
    descricao: string;
    produtos: Produtos[];
    ativo: boolean;
}
