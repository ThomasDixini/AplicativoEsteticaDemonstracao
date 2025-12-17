import axios, { AxiosError, isAxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { navigate } from './navigationAxios';
import { Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';

export const baseURL = Platform.OS === 'android' 
    ? process.env.EXPO_PUBLIC_API_APP_URL
    : process.env.EXPO_PUBLIC_API_WEB_URL;

export const api = axios.create({
    baseURL: baseURL,
}) 

api.interceptors.request.use(
    async (config) => {
        if(config.url?.includes("login") || config.url?.includes("registrar")) {
            return config;
        }
        const token = Platform.OS === 'android' 
            ? await SecureStore.getItemAsync('token').then(token => token)
            : localStorage.getItem('token');

        const usuarioId = Platform.OS === 'android' 
            ? await SecureStore.getItemAsync('usuarioId').then(usuarioId => usuarioId)
            : localStorage.getItem('usuarioId');
        
        if(token !== null){
            config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
        }

        if(usuarioId !== null){
            config.headers.UsuarioId = usuarioId;
        }

        return config;
    },
    (error) => {
        console.error("#### Houve algum erro com a requisição ####")
        console.error(error)
    }
)

api.interceptors.response.use(
    async (config) => {
        return config;
    },
    async (error) => {
        console.error("#### Houve algum erro com a resposta ####")
        console.error(error)
        console.error(error.message)

       

        if(error.response && error.response.status === 401){
            var token = Platform.OS === 'android' 
                ? await SecureStore.getItemAsync('token')
                : localStorage.getItem('token')

            if(token !== null && token !== '' && token !== undefined){
                Platform.OS === 'android'
                    ? await SecureStore.deleteItemAsync("token")
                    : localStorage.removeItem('token')

                Platform.OS === 'android' 
                    ? await SecureStore.deleteItemAsync("usuarioId")
                    : localStorage.removeItem('usuarioId')
                    
                showMessage({
                    message: "Sessão Expirada, faça login novamente!",
                    type: "warning"
                })
            }

            navigate("/(auth)/auth")
        }

        if(isAxiosError(error)){
            var erroAxios = error as AxiosError;
            console.log(erroAxios.response?.data)
            console.log(erroAxios)
        }

        return Promise.reject(error)
    }
)