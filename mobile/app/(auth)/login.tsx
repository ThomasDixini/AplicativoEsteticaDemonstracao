import Botao from "@/components/Botao/Botao";
import { LoginDto } from "@/interfaces/Usuarios/LoginDto";
import { login } from "@/services/usuarios/usuario-service";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { AxiosError } from "axios";
import { showMessage } from "react-native-flash-message";


const schema = yup.object({
    nomeUsuario: yup
        .string()
        .min(4, 'Nome de Usuário muito curto')
        .max(20, 'Nome de Usuário muito longo')
        .matches(/^\S+$/, 'O nomde de usuário não pode conter espaços')
        .required("O nome de usuário é obrigatório!"),
    senha: yup
        .string()
        .min(6, 'Senha muito curta')
        .matches(/^\S+$/, 'A senha não pode conter espaços')
        .required("A senha é obrigatória!"),
})

type FormData = {
    nomeUsuario: string;
    senha: string;
}

export default function LoginPagina() {
    const navegador = useRouter();
    const { control, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    })
    const [loading, setLoading] = useState(false);

    const onSubmit = (formularioDados: FormData) => {
        var loginDto: LoginDto = {
            username: formularioDados.nomeUsuario,
            password: formularioDados.senha,
        }

        loginUsuario(loginDto);
    }

    async function loginUsuario(loginDto: LoginDto){
        try {
            setLoading(true)
            var response = await login(loginDto);
            
            if(response !== null && response !== undefined){
                if(response.token !== null && response.token !== undefined) {
                    Platform.OS === 'android' 
                        ? await SecureStore.setItemAsync('token', JSON.stringify(response.token))
                        : localStorage.setItem('token', JSON.stringify(response.token));
                    navegador.replace('/(app)')
                }

                if(response.usuarioId !== null && response.usuarioId !== undefined) {
                    Platform.OS === 'android' 
                        ? await SecureStore.setItemAsync('usuarioId', JSON.stringify(response.usuarioId))
                        : localStorage.setItem('usuarioId', JSON.stringify(response.usuarioId));
                }
            } 
            setLoading(false)
        } catch(e) {
            const error = e as AxiosError;
            
            if(error.response && error.response.status === 400){
                showMessage({
                    message: "Usuário Inexistente!",
                    description: "Esse usuário não existe.",
                    type: "warning"
                })
            }  else if(error.response && error.response.status === 401) {
                showMessage({
                    message: "Autenticação falhou!",
                    description: "Usuário ou senha inválidos.",
                    type: "warning"
                })
            }
            else {
                showMessage({
                    message: "Erro inesperado ao fazer login!",
                    type: "warning"
                })
            }

            setLoading(false)
        }
    }


    return (
        <>
            {
                loading ? (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color={'gray'}/>
                    </View>
                ) : (
                    <View style={styles.topo}>
                        <Image 
                            style={styles.imagem}
                            source={require('../../assets/images/sem_imagem.png')}
                            resizeMode="contain"
                        />
                        <View style={styles.agrupamentoInput}>
                            <Controller 
                                control={control}
                                name="nomeUsuario"
                                render={({ field: {onChange, value}}) => (
                                    <TextInput onChangeText={onChange} style={styles.input} placeholder="Digite o nome de usuário" placeholderTextColor={'#565e6a60'}/>
                                )}
                            />
                            {errors.nomeUsuario && <Text style={styles.error}>{errors.nomeUsuario.message}</Text>}
                        </View>
                        <View style={styles.agrupamentoInput}>
                            <Controller 
                                control={control}
                                name="senha"
                                render={({ field: {onChange, value}}) => (
                                    <TextInput onChangeText={onChange} style={styles.input} placeholder="Digite a senha" placeholderTextColor={'#565e6a60'} secureTextEntry/>
                                )}
                            />
                            {errors.senha && <Text style={styles.error}>{errors.senha.message}</Text>}
                        </View>

                        <View style={{ width: '100%', marginTop: 'auto'}}>
                            <Botao texto="Entrar"  login={handleSubmit(onSubmit)}/>
                        </View>
                    </View>
                )
            }
        </>
    );
}


const styles = StyleSheet.create({
    topo: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 32,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc'
    },

    imagem: {
        width: '100%',
        height: 150,
        padding: 16,
    },

    agrupamentoInput: {
        width: "100%",
        flexDirection: 'column',
        marginTop: 30,
    },

    input: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#d5d9de',
        backgroundColor: '#ffffff',
        padding: 16,
        width: '100%',
        marginTop: 10,
    },

    textoInput: {
        fontWeight: 'bold',
        color: '#565e6a',
    },

    error: {
        color: 'red',
        marginTop: 10,
        marginLeft: 20
    }
})