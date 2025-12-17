import { Href } from "expo-router";

type FormData = {
    primeiroNome: string;
    sobrenome: string;
    nomeUsuario: string;
    senha: string;
    confirmarSenha: string;
}

export interface BotaoPropriedades {
    variante?: boolean;
    texto: string;
    redirect?: boolean;
    rota?: Href;
    login?: () => void;
    registrar?: () => void;
}