import { LoginDto } from "@/interfaces/Usuarios/LoginDto";
import { RegistrarDto } from "@/interfaces/Usuarios/RegistrarDto";
import { Usuarios } from "@/interfaces/Usuarios/Usuarios";
import { api } from "@/utils/api";
import * as SecureStore from 'expo-secure-store'
import { jwtDecode } from 'jwt-decode'
import { Platform } from "react-native";

export async function login(login: LoginDto) {
    var response = await api.post('/usuarios/login', login).then(response => response.data)
    return response;
}

export async function registrar(dadosUsuario: RegistrarDto) {
    var response = await api.post('/usuarios/registrar', dadosUsuario).then(response => response.data)
    return response;
}

export async function checarUsuarioAdmin(){
    var token = Platform.OS === 'android' 
        ? await SecureStore.getItemAsync('token')
        : localStorage.getItem('token');
        
    if(!token) return null;

    var decode = jwtDecode(token) as any;
    if(decode.role === 'Admin' || (Array.isArray(decode.role) && decode.role.includes("Admin"))){
        return true
    } else {
        return false;
    }
}

export async function buscarUsuarioLogado() {
    return await api.get<Usuarios>(`/usuarios/logado`);
}

export async function editarUsuario(usuario: Usuarios) {
    return await api.patch(`/usuarios/editar`, usuario);
}

export async function salvarNotificacaoToken(notificacaoToken: string) {
    return await api.post(`/usuarios/notificacao-token`, notificacaoToken, {
        headers: {
            Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
        },
    });
}