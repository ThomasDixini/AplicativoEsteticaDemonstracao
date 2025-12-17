import { Produtos } from "@/interfaces/Produtos/Produtos";

export interface CardProdutosProps {
    recarregarItens?: () => Promise<void>;
    produto: Produtos;
}