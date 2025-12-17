export interface DataBotaoPropriedades {
    id: number;
    diaSelecionado: {
        id: number;
        data: string;
    };
    data?: string;
    numeroDia: string;
    dia: string;
    setarDiaSelecionado: (dia: any) => void;
}