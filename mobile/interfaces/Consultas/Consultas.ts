import { Usuarios } from "../Usuarios/Usuarios";
import { HorarioConsultas } from "./HorarioConsultas";
import { StatusConsulta } from "./StatusConsulta";
import { TipoConsultas } from "./TipoConsultas";

export interface Consultas {
    id: number;  
    usuarioId?: number;  
    usuario?: Usuarios;  
    tipoConsultaId: number;  
    tipoConsulta?: TipoConsultas;  
    data: Date;  
    inicio: string;  
    fim: string; 
    status: StatusConsulta;  
    valor?: number;  
}