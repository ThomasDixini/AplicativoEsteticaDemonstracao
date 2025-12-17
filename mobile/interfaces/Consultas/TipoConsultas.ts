import { Consultas } from "./Consultas";
import { TipoConsultaHorarios } from "./TipoConsultaHorarios";

export interface TipoConsultas {
    id: number;
    nome: string;
    descricao: string;
    valorAtual: number;
    imagem?: string;
    imagemBase64?: string;
    uriImagem?: string;
    tipoConsultaHorarios: TipoConsultaHorarios[];
    ativo: boolean;
}