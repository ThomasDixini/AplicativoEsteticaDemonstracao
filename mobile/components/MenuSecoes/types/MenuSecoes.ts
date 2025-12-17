import { TipoProdutos } from "@/interfaces/Produtos/TipoProdutos";

export interface MenuSecoesTipo {
    secoes: Secoes[];
    enviarSecoesFiltradas: (tipoProdutosId: number | null, reseta?: boolean) => void
}

export interface Secoes {
    id: number;
    secao: string;
}