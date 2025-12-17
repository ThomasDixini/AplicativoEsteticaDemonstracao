import { Consultas } from "@/interfaces/Consultas/Consultas"
import { HorarioConsultas } from "@/interfaces/Consultas/HorarioConsultas"
import { HorariosIndisponiveis } from "@/interfaces/Consultas/HorariosIndisponiveis"
import { TipoConsultas } from "@/interfaces/Consultas/TipoConsultas"
import { api } from "@/utils/api"
import { Axios, AxiosError } from "axios"

export async function buscarTipoConsultas() {
    const tipoConsultas = await api.get('/consultas/tipos').then(response => response.data)
    return tipoConsultas
}

export async function buscarTipoConsultaPorId(tipoConsultaId: number) {
    return await api.get(`/consultas/tipos/${tipoConsultaId}`)
}

export async function buscarHorariosPorTipoConsulta(tipoConsultaId: number, diaSelecionado: string): Promise<HorarioConsultas[]> {
    const horarios: HorarioConsultas[] = await api.post(`/consultas/tipos/${tipoConsultaId}/horarios`, diaSelecionado, {
        headers: { 'Content-Type': 'application/json'}
    }).then(response => response.data)
    return horarios
}

export async function marcarConsulta(consulta: Consultas) {
    const consultaMarcada: Consultas = await api.post(`/consultas/marcar`, consulta, {
        headers: { 'Content-Type': 'application/json'}
    }).then(response => response.data)

    return consultaMarcada;
}

export async function buscarConsultasAgendadas(paginaAtual: number, itensPorPagina: number, tipoConsultaFiltro: number | null) {
    return await api.get<Consultas[]>(`/consultas/listar`, {
        params: {
            paginaAtual,
            itensPorPagina,
            tipoConsultaFiltro: tipoConsultaFiltro ?? ''
        }
    }).then(response => response.data)
}

export async function cancelarConsulta(consultaId: number) {
    return await api.patch(`/consultas/cancelar/${consultaId}`).then(response => response.data)
}

export async function atualizarStatusConsulta(consultaId: number, statusId: number) {
    return await api.patch(`/consultas/${consultaId}/status/${statusId}`).then(response => response.data)
}

export async function cadastrarHorarios(horarios: HorarioConsultas[], tipoConsultaId: number) {
    return await api.post(`/consultas/cadastrar/horarios/${tipoConsultaId}`, horarios).then(response => response.data);
}

export async function editarHorarios(horarios: HorarioConsultas[], tipoConsultaId: number) {
    return await api.patch(`/consultas/editar/horarios/${tipoConsultaId}`, horarios)
}

export async function cadastrarTipoConsulta(tipoConsulta: TipoConsultas) {
    return await api.post(`/consultas/cadastrar/tipoConsulta`, tipoConsulta).then(response => response.data)
}

export async function editarTipoConsulta(tipoConsultaId: number, tipoConsulta: TipoConsultas) {
    return await api.post(`/consultas/editar/tipoConsulta/${tipoConsultaId}`, tipoConsulta)
}

export async function alterarTipoConsulta(tipoConsultaId: number, ativo: boolean) {
    return await api.patch(`/consultas/tipos/${tipoConsultaId}/alterar`, null, {
        params: {
            ativo: ativo
        }
    })
}

export async function cadastrarTipoConsultaImagem(imagem: FormData, consultaId: number) {
    return await api.post(`/consultas/cadastrar/tipoConsulta/imagem/${consultaId}`, imagem, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
        },
    })
}

export async function editarTipoConsultaImagem(imagem: FormData, consultaId: number) {
    return await api.post(`/consultas/editar/tipoConsulta/imagem/${consultaId}`, imagem, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export async function definirHorariosIndisponiveis(horariosIndisponiveis: HorariosIndisponiveis) {
    return await api.post(`/consultas/definir/horarios/indisponiveis`, horariosIndisponiveis);
}

export async function editarHorariosIndisponiveis(horariosIndisponiveis: HorariosIndisponiveis[]) {
    return await api.post(`/consultas/editar/horarios/indisponiveis`, horariosIndisponiveis);
}

export async function buscarHorariosIndisponiveis(tipoConsultaId: number, data: string) {
    return await api.get<HorariosIndisponiveis[]>(`/consultas/buscar/horarios/indisponiveis/${tipoConsultaId}`, {
        params: {
            data: data
        }
    });
}

