import { HorarioConsultas } from "./HorarioConsultas";
import { TipoConsultas } from "./TipoConsultas";

export interface TipoConsultaHorarios {
    tipoConsultaId: number;
    tipoConsulta: TipoConsultas;
    horarioId: number;
    horario: HorarioConsultas
    reservado: boolean;
    data: Date;
}