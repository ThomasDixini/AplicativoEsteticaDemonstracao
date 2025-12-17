import { Consultas } from "../Consultas/Consultas";

export interface Usuarios {
    normalizedUserName: string;
    primeiroNome: string;
    ultimoNome: string;
    genero: string[1];
    telefone: string;
    cidade: string;
    // roles: ;
    consultas: Consultas[];
    // postsUsuarios: ;
}