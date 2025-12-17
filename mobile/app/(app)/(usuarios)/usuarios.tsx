import Header from "@/components/Header/Header";
import { Usuarios } from "@/interfaces/Usuarios/Usuarios";
import { buscarUsuarioLogado, editarUsuario } from "@/services/usuarios/usuario-service";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { isAxiosError } from "axios";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, Text, View, TextInput, Image, ScrollView, Dimensions, TouchableOpacity } from "react-native"
import { showMessage } from "react-native-flash-message";
import { ActivityIndicator, HelperText } from "react-native-paper";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import * as yup from 'yup';

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
    novaSenha: yup
        .string()
        .nullable()
        .notRequired()
        .when([], {
            is: (value: string | null) => !!value, // só se tiver valor
            then: (schema) => schema.min(6, "Senha muito curta"),
        })
        .matches(/^\S*$/, "A senha não pode conter espaços"),

    confirmarSenha: yup
        .string()
        .nullable()
        .notRequired()
        .when("novaSenha", {
            is: (senha: string | null) => !!senha, // se senha estiver preenchida
            then: (schema) =>
                schema
                    .required("Confirmar senha é obrigatório")
                    .oneOf([yup.ref("novaSenha")], "As senhas não coincidem!"),
                otherwise: (schema) => schema.notRequired(),
        }),
})

export default function UsuarioPagina(){
    const { control, handleSubmit, setValue, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    })
    const [loading, setLoading] = useState(false);
    const [usuario, setUsuario] = useState<Usuarios>();
    const path = usePathname();
    const navegador = useRouter();

    const { width, height } = Dimensions.get('window');

    function navegarParaInicio(){
        if(!(path === "/"))
        {
            navegador.back();
        }
    }

    async function carregarUsuario() {
        try{
            setLoading(true);
            const usuario = await buscarUsuarioLogado().then(res => res.data);
            if(usuario){
                setValue("primeiroNome", usuario.primeiroNome)
                setValue("sobrenome", usuario.ultimoNome)
                setValue("cidade", usuario.cidade)
                setValue("telefone", usuario.telefone)
                setUsuario(usuario);
            }

            setLoading(false);
        } catch(error){
            if (isAxiosError(error)) {
                console.error("⚠️ Axios error.code:", error.code);
                console.error("⚠️ Axios error.message:", error.message);
                console.error("⚠️ Axios error.request:", error.request);
                console.error("⚠️ Axios error.response:", error.response);
            } else {
                console.error("❌ Erro desconhecido:", error);
            }
            setLoading(false);
            throw error;
        }
    }

    async function onEditarUsuario(formularioDados: any){
        try{
            setLoading(true);
            const novoUsuario: any = {
                primeiroNome: formularioDados.primeiroNome,
                ultimoNome: formularioDados.sobrenome,
                cidade: formularioDados.cidade,
                telefone: formularioDados.telefone,
                genero: 'S',
                normalizedUserName: formularioDados.nomeUsuario,
                novaSenha: formularioDados.novaSenha,
            }
            await editarUsuario(novoUsuario);
            showMessage({
                message: "Usuario editado com sucesso!",
                type: 'success'
            })
            setLoading(false);
        } catch(error: any){
            if (isAxiosError(error)) {
                console.error("⚠️ Axios error.code:", error.code);
                console.error("⚠️ Axios error.message:", error.message);
                console.error("⚠️ Axios error.request:", error.request);
                console.error("⚠️ Axios error.response:", error.response);
                error.response?.data
               
            } else {
                console.error("❌ Erro desconhecido:", error);
            }
            setLoading(false);

            showMessage({
                message:  "Houve algum erro ao editar usuário!",
                type: 'danger'
            })
            throw error;
        }
    }

    useEffect(() => {
        carregarUsuario();
    }, [])

    return (
        <>
            {
                loading ? (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color={'gray'}/>
                    </View>
                ) : (
                    <View style={styles.topo}>
                        <ScrollView  contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
                            <View style={styles.backgroundUsuario} />
                            <View style={{ flexDirection: 'column', gap: 50, alignItems: 'center' }}>
                                <View style={styles.circulo}>
                                    <FontAwesomeIcon icon={faUser} size={70} color="#232d3a"/>
                                </View>
                                <Text style={styles.texto}> {usuario?.primeiroNome} {usuario?.ultimoNome} </Text>
                            </View>
                            <View style={[
                                styles.agrupamentoInput,
                                { marginTop: 32 }
                            ]}>
                                <Controller 
                                    control={control}
                                    name="primeiroNome"
                                    render={({ field: {onChange, value}}) => (
                                        <>
                                            <HelperText type="info" style={{ color: '#6d7681', marginBottom: -4, padding: 0}}>
                                                Primeiro Nome
                                            </HelperText>
                                            <TextInput onChangeText={onChange} value={value} style={styles.input} placeholder="Digite seu nome" placeholderTextColor={'#454d5960'}/>
                                        </>
                                    )}/>
                                    {errors.primeiroNome && <Text style={styles.error}>{errors.primeiroNome.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <Controller 
                                    control={control}
                                    name="sobrenome"
                                    render={({ field: {onChange, value}}) => (
                                        <>
                                            <HelperText type="info" style={{ color: '#6d7681', marginBottom: -4, padding: 0}}>
                                                Sobrenome
                                            </HelperText>
                                            <TextInput onChangeText={onChange} value={value} style={styles.input} placeholder="Digite seu sobrenome" placeholderTextColor={'#454d5960'}/>
                                        </>
                                    )}
                                />
                                {errors.sobrenome && <Text style={styles.error}>{errors.sobrenome.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <Controller 
                                    control={control}
                                    name="cidade"
                                    render={({ field: {onChange, value}}) => (
                                        <>
                                            <HelperText type="info" style={{ color: '#6d7681', marginBottom: -4, padding: 0}}>
                                                Cidade
                                            </HelperText>
                                            <TextInput onChangeText={onChange} value={value} style={styles.input} placeholder="Digite sua Cidade" placeholderTextColor={'#454d5960'}/>
                                        </>
                                    )}
                                />
                                {errors.cidade && <Text style={styles.error}>{errors.cidade.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <Controller 
                                    control={control}
                                    name="telefone"
                                    render={({ field: {onChange, value}}) => (
                                        <>
                                            <HelperText type="info" style={{ color: '#6d7681', marginBottom: -4, padding: 0}}>
                                                Telefone
                                            </HelperText>
                                            <TextInput onChangeText={onChange} value={value} style={styles.input} placeholder="Digite seu Telefone" placeholderTextColor={'#454d5960'}/>
                                        </>
                                    )}
                                />
                                {errors.telefone && <Text style={styles.error}>{errors.telefone.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <Controller 
                                    control={control}
                                    name="novaSenha"
                                    render={({ field: {onChange, value}}) => (
                                        <>
                                            <HelperText type="info" style={{ color: '#6d7681', marginBottom: -4, padding: 0}}>
                                                Nova Senha
                                            </HelperText>
                                            <TextInput onChangeText={onChange} value={value ? value : ''} style={styles.input} placeholder="Digite a senha" placeholderTextColor={'#454d5960'} secureTextEntry/>
                                        </>
                                    )}
                                />
                                {errors.novaSenha && <Text style={styles.error}>{errors.novaSenha.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <Controller 
                                    control={control}
                                    name="confirmarSenha"
                                    render={({ field: {onChange, value}}) => (
                                        <>
                                            <HelperText type="info" style={{ color: '#6d7681', marginBottom: -4, padding: 0}} visible={true}>
                                                Confirmar Senha
                                            </HelperText>
                                            <TextInput onChangeText={onChange} value={value ? value : ''} style={styles.input} placeholder="Confirme a senha" placeholderTextColor={'#454d5960'} secureTextEntry/>
                                        </>
                                    )}
                                />
                                {errors.confirmarSenha && <Text style={styles.error}>{errors.confirmarSenha.message}</Text>}
                            </View>
                        </ScrollView>
                        <View style={{ flexDirection: 'column',  gap: 10, padding: 16, borderTopColor: '#e9ebef', borderTopWidth: 1 }}>
                            <View style={{ width: '100%' }}>
                                <TouchableOpacity style={styles.botaoVariante} onPress={navegarParaInicio}>
                                    <Text style={styles.textoBotaoVariante}>Voltar</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '100%' }}>
                                <TouchableOpacity style={styles.botao} onPress={handleSubmit(onEditarUsuario)}>
                                    <Text style={styles.textoBotao}>Salvar Alterações</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            }
            
        </>
    )
}


const styles = StyleSheet.create({
    topo: {
       flex: 1,
       backgroundColor: '#f8fafc'
    },

    conteudo: {
        padding: 32,
        flexGrow: 1,
        paddingBottom: 100
    },

    backgroundUsuario: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#b89415',
        height: 150,
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
    },

    circulo: {
        width: 175,
        height: 175,
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 8,
        borderColor: '#ffffff',
        borderRadius: 99999,
        zIndex: 3
    },

    texto: {
        color: '#222c3a',
        fontWeight: 'bold',
        marginTop: -32,
        fontSize: 24,
        zIndex: 3
    },

    agrupamentoInput: {
        width: "100%",
        flexDirection: 'column',
        marginTop: 20,
    },

    input: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#dbdfe4',
        color: '#454d59',
        padding: 16,
        width: '100%',
        marginTop: 10,
    },

    textoInput: {
        fontWeight: 'bold',
        color: '#454d59',
    },

    error: {
        color: 'red',
        marginTop: 10,
        marginLeft: 20
    },

    botao: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        backgroundColor: '#b89415',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },

    botaoVariante: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        backgroundColor: '#e5e7eb',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },

    textoBotao: {
        fontWeight: 'bold',
        color: 'white'
    },

    textoBotaoVariante: {
        fontWeight: 'bold',
        color: '#59626f',
    }
})