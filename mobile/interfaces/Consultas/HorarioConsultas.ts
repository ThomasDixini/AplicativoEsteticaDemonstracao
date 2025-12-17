import { Consultas } from "./Consultas";
import { TipoConsultaHorarios } from "./TipoConsultaHorarios";

export interface HorarioConsultas {
    id: number;  
    inicio: string;  
    fim: string;  
    tipoConsultaHorarios: TipoConsultaHorarios[];
    ativo: boolean;
}