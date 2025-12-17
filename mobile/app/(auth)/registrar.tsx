import Botao from "@/components/Botao/Botao";
import { LoginDto } from "@/interfaces/Usuarios/LoginDto";
import { RegistrarDto } from "@/interfaces/Usuarios/RegistrarDto";
import { login, registrar } from "@/services/usuarios/usuario-service";
import { useRouter } from "expo-router";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as SecureStore from 'expo-secure-store';
import { Image, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import axios from "axios";
import { showMessage } from "react-native-flash-message";
import { ActivityIndicator } from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { useState } from "react";
import { Platform } from "react-native";

const schema = yup.object({
    primeiroNome: yup
        .string()
        .required("O nome é obrigatória!"),
    sobrenome: yup
        .string()
        .required("O sobrenome é obrigatória!"),
    cidade: yup
        .string()
        .required("A cidade é obrigatória!"),
    telefone: yup
        .string()
        .matches(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, 'Número de Telefone inválido')
        .required("O Telefone é obrigatório!"),
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
    confirmarSenha: yup
        .string()
        .oneOf([yup.ref('senha')], "As senhas não coincidem!")
        .required("Confirmar senha é obrigatório!"),
})

type FormData = {
    primeiroNome: string;
    sobrenome: string;
    nomeUsuario: string;
    cidade: string;
    telefone: string;
    senha: string;
    confirmarSenha: string;
}

export default function RegistrarPagina() {
    const navegador = useRouter();
    const { control, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    })
    const [loading, setLoading] = useState(false);

    const onSubmit = (formularioDados: FormData) => {
        const dadosUsuario: RegistrarDto = {
            username: formularioDados.nomeUsuario,
            password: formularioDados.senha,
            primeiroNome: formularioDados.primeiroNome,
            ultimoNome: formularioDados.sobrenome,
            genero: 'M',
            cidade: formularioDados.cidade,
            telefone: formularioDados.telefone
        }
        registrarUsuario(dadosUsuario);
    }

    async function registrarUsuario(dadosUsuario: RegistrarDto) {
        try {
            setLoading(true)
            const response = await registrar(dadosUsuario);
            
            if(response !== null) {
                showMessage({
                    message: "Usuário Cadastrado com sucesso!",
                    type: 'success'
                })

                let loginDto: LoginDto = {
                    username: dadosUsuario.username,
                    password: dadosUsuario.password,
                }

                var responseLogin = await login(loginDto);
                            
                if(responseLogin !== null && responseLogin !== undefined){
                    if(responseLogin.token !== null && responseLogin.token !== undefined) {
                        Platform.OS === 'android' 
                            ? await SecureStore.setItemAsync('token', JSON.stringify(responseLogin.token))
                            : localStorage.setItem('token', JSON.stringify(responseLogin.token));
                        navegador.replace('/(app)')
                    }
    
                    if(responseLogin.usuarioId !== null && responseLogin.usuarioId !== undefined) {
                        Platform.OS === 'android' 
                            ? await SecureStore.setItemAsync('usuarioId', JSON.stringify(responseLogin.usuarioId))
                            : localStorage.setItem('usuarioId', JSON.stringify(responseLogin.usuarioId));
                    }
                } 
            }

            setLoading(false)
        } catch(error) {
            if(axios.isAxiosError(error)){
                const status = error.response?.status;
                const serverMessage = error.response?.data?.message || "Erro desconhecido";
                const errors = error.response?.data;

                console.error(status)
                console.error(serverMessage)
                errors.forEach((errorResponse: any) => {
                    if(errorResponse.code === 'DuplicateUserName'){
                        showMessage({
                            message: "Nome de usuário já existe!",
                            type: "warning",
                            style: {
                                height: 100,
                            }
                        })
                    }

                    console.error(errorResponse.description)
                })
            } else {
                console.error("Erro inesperado com o servidor.")
                console.error(error)
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
                    <ScrollView style={styles.topo}>
                        <Image 
                            style={styles.imagem}
                            source={require('../../assets/images/sem_imagem.png')}
                            resizeMode="contain"
                        />
                        <View style={styles.agrupamentoInput}>
                            <Controller 
                                control={control}
                                name="primeiroNome"
                                render={({ field: {onChange, value}}) => (
                                    <TextInput onChangeText={onChange} value={value} style={styles.input} placeholder="Digite seu nome" placeholderTextColor={'#565e6a60'}/>
                                )}/>
                                {errors.primeiroNome && <Text style={styles.error}>{errors.primeiroNome.message}</Text>}
                        </View>
                        <View style={styles.agrupamentoInput}>
                            <Controller 
                                control={control}
                                name="sobrenome"
                                render={({ field: {onChange, value}}) => (
                                    <TextInput onChangeText={onChange} style={styles.input} placeholder="Digite seu sobrenome" placeholderTextColor={'#565e6a60'}/>
                                )}
                            />
                            {errors.sobrenome && <Text style={styles.error}>{errors.sobrenome.message}</Text>}
                        </View>
                        <View style={styles.agrupamentoInput}>
                            <Controller 
                                control={control}
                                name="cidade"
                                render={({ field: {onChange, value}}) => (
                                    <TextInput onChangeText={onChange} style={styles.input} placeholder="Digite sua Cidade" placeholderTextColor={'#565e6a60'}/>
                                )}
                            />
                            {errors.cidade && <Text style={styles.error}>{errors.cidade.message}</Text>}
                        </View>
                        <View style={styles.agrupamentoInput}>
                            <Controller 
                                control={control}
                                name="telefone"
                                render={({ field: {onChange, value}}) => (
                                    <TextInput onChangeText={onChange} style={styles.input} placeholder="Digite seu Telefone" placeholderTextColor={'#565e6a60'}/>
                                )}
                            />
                            {errors.telefone && <Text style={styles.error}>{errors.telefone.message}</Text>}
                        </View>
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
                        <View style={styles.agrupamentoInput}>
                            <Controller 
                                control={control}
                                name="confirmarSenha"
                                render={({ field: {onChange, value}}) => (
                                    <TextInput onChangeText={onChange} style={styles.input} placeholder="Confirme a senha" placeholderTextColor={'#565e6a60'} secureTextEntry/>
                                )}
                            />
                            {errors.confirmarSenha && <Text style={styles.error}>{errors.confirmarSenha.message}</Text>}
                        </View>

                        <View style={{ width: '100%', marginTop: 50, marginBottom: 32}}>
                            <Botao texto="Registrar" registrar={handleSubmit(onSubmit)}/>
                        </View>
                    </ScrollView>
                )
            }
        </>
    );
}


const styles = StyleSheet.create({
    topo: {
        flex: 1,
        padding: 16,
        paddingBottom: 50,
        backgroundColor: '#f8fafc'
    },

    imagem: {
        width: '100%',
        height: 200,
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
        color: '#C58867',
    },

    error: {
        color: 'red',
        marginTop: 10,
        marginLeft: 20
    }
})