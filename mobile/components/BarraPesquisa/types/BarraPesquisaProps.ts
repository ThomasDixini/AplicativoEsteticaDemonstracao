export interface BarraPesquisaProps {
    textoPesquisa: string;
    placeholder: string;
    enviarItensFiltrados?: (nomeProduto: string) => void;
}