import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import * as DocumentPicker from 'expo-document-picker';
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import Botao from "@/components/Botao/Botao";
import { TipoProdutos } from "@/interfaces/Produtos/TipoProdutos";
import { buscarTipoProdutoPorId, buscarTipoProdutos, cadastrarTipoProduto, editarTipoProduto } from "@/services/produtos/produtos-service";
import { isAxiosError } from "axios";
import { showMessage } from "react-native-flash-message";
import { Href, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const schema = yup.object({
    nomeTipoProduto: yup
        .string()
        .min(6, "O nome deve conter pelo menos 6 caracteres.")
        .max(30, "O nome deve conter somente até 30 caracteres.")
        .required("O nome da categoria do produto é obrigatório!"),
    descricaoTipoProduto: yup
        .string()
        .required("A descrição da categoria é obrigatória!"),
})

export default function CadastroProdutos(){
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    })
    const navegador = useRouter();
    const { tipoProdutoId } = useLocalSearchParams();
    const [tipoProdutoEditar, setTipoProdutoEditar] = useState<TipoProdutos>();
    const [loading, setLoading] = useState(false);

    function navegar(rota: Href){
        navegador.back();
    }

    const onSubmitCadastrar = async (formularioDados: any) => {
        setLoading(true);
        const dados: TipoProdutos = {
            id: 0,
            nome: formularioDados.nomeTipoProduto,
            descricao: formularioDados.descricaoTipoProduto,
            produtos: [],
            ativo: true,
        }

        try {
            const tipoProduto = await cadastrarTipoProduto(dados);
            if(tipoProduto){
                showMessage({
                    message: "Categoria cadastrada com sucesso",
                    type: "success"
                });

                navegador.back()
            }
            setLoading(false);
        } catch (error) {
            if(isAxiosError(error)){
                console.error(error.code)
                console.error(error.response?.data)
                console.error(error.message)
            } else {
                console.error("Erro desconhecido")
                console.error(error)
            }

            setLoading(false);
        }
    }

    const onSubmitEditar = async (formularioDados: any) => {
        setLoading(true);
        const dados: TipoProdutos = {
            id: Number(tipoProdutoId),
            nome: formularioDados.nomeTipoProduto,
            descricao: formularioDados.descricaoTipoProduto,
            produtos: tipoProdutoEditar!.produtos,
            ativo: tipoProdutoEditar!.ativo,
        }

        try {
            const tipoProduto = await editarTipoProduto(dados);
            if(tipoProduto){
                showMessage({
                    message: "Categoria editada com sucesso",
                    type: "success"
                });

                navegador.back()
            }
            setLoading(false);
        } catch (error) {
            if(isAxiosError(error)){
                console.error(error.code)
                console.error(error.response?.data)
                console.error(error.message)
            } else {
                console.error("Erro desconhecido")
                console.error(error)
            }

            setLoading(false);
        }
    }

    async function carregarTipoProduto(tipoProdutoId: number){
        try {
            setLoading(true);
            const tipoProduto: TipoProdutos = await buscarTipoProdutoPorId(tipoProdutoId).then(res => res.data);
            setTipoProdutoEditar(tipoProduto);
            setValue("descricaoTipoProduto", tipoProduto.descricao)
            setValue("nomeTipoProduto", tipoProduto.nome)
            setLoading(false);
        } catch (error) {
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

    useEffect(() => {
        if(tipoProdutoId){
            carregarTipoProduto(Number(tipoProdutoId));
        }
    }, [tipoProdutoId])

    return (
        <>
        <Stack.Screen options={{ headerTitle: "Cadastro de Categoria", headerTransparent: false, headerTitleAlign: 'center', headerBackVisible: true }} />
        {
            loading ? (
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color={'gray'}/>
                </View>
            ) : (
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={styles.topo} contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                        <View style={styles.agrupamentoInput}>
                            <Controller 
                                control={control}
                                name="nomeTipoProduto"
                                render={({ field: {onChange, value}}) => (
                                    <TextInput 
                                        mode="outlined" 
                                        onChangeText={onChange} 
                                        value={value} 
                                        style={styles.input} 
                                        activeOutlineColor="#b89415"
                                        contentStyle={{ color: '#565e6a' }}
                                        theme={{
                                            colors: {
                                                outline: '#d5d9de',
                                                placeholder: '#d5d9de60',
                                                text: '#565e6a'
                                            },
                                            
                                        }} 
                                        placeholderTextColor={'#bfc3cb'}
                                        placeholder="Digite o nome da Categoria do Produto" 
                                        />
                                )}/>
                                {errors.nomeTipoProduto && <Text style={styles.error}>{errors.nomeTipoProduto.message}</Text>}
                        </View>
                        <View style={styles.agrupamentoInput}>
                            <Controller 
                                control={control}
                                name="descricaoTipoProduto"
                                render={({ field: {onChange, value}}) => (
                                    <TextInput 
                                        mode="outlined" 
                                        onChangeText={onChange} 
                                        value={value} 
                                        style={styles.input} 
                                        activeOutlineColor="#b89415"
                                        contentStyle={{ color: '#565e6a' }}
                                        theme={{
                                            colors: {
                                                outline: '#d5d9de',
                                                placeholder: '#d5d9de60',
                                                text: '#565e6a'
                                            },
                                            
                                        }} 
                                        placeholder="Digite a descricao da Categoria" 
                                        placeholderTextColor={'#bfc3cb'}/>
                                )}/>
                                {errors.descricaoTipoProduto && <Text style={styles.error}>{errors.descricaoTipoProduto.message}</Text>}
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'column', gap: 10, marginTop: 'auto', padding: 32, borderTopColor: '#d5d9de', borderTopWidth: 1, backgroundColor: 'white' }}>
                        <View>
                            <TouchableOpacity  onPress={handleSubmit(!tipoProdutoId ? onSubmitCadastrar : onSubmitEditar)} style={{ backgroundColor: '#b89415', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{!tipoProdutoId ? "Cadastrar" : "Editar"}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => navegar("/")} style={{ backgroundColor: '#e5e7eb', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#56606d', fontWeight: 'bold' }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            )
        }
        </>
    );
}

const styles = StyleSheet.create({
    topo: {
        flex: 1,
        backgroundColor: '#f8fafc'
    },
    agrupamentoInput: {
        flexDirection: 'column',
        marginTop: 30,
    },

    input: {
        backgroundColor: '#ffffff',
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
    },
})