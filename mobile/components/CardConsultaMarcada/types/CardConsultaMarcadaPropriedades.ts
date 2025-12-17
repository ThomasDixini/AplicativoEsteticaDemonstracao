import { Consultas } from "@/interfaces/Consultas/Consultas";

export interface CardConsultaMarcadaPropriedades {
    item: Consultas;
    atualizarConsultas: () => void;
    recarregarConsultas: (reseta: boolean) => void;
}