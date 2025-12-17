import { HorarioConsultas } from "@/interfaces/Consultas/HorarioConsultas";
import { TipoConsultaHorarios } from "@/interfaces/Consultas/TipoConsultaHorarios";

export interface HorarioBotaoPropriedades {
    horario: HorarioConsultas;
    idHorarioSelecionado: number;
    setarHorarioSelecionado: (horario: HorarioConsultas) => void;
}