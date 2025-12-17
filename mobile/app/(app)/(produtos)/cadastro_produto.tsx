import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import * as DocumentPicker from 'expo-document-picker';
import { ActivityIndicator, HelperText, TextInput } from "react-native-paper";
import { Dropdown, DropdownInputProps } from 'react-native-paper-dropdown';
import { buscarProdutoPorId, buscarTipoProdutos, cadastrarProduto, cadastrarProdutoImagem, editarProduto, editarProdutoImagem } from "@/services/produtos/produtos-service";
import { isAxiosError } from "axios";
import { Produtos } from "@/interfaces/Produtos/Produtos";
import { showMessage } from "react-native-flash-message";
import { Href, Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from 'expo-file-system';
import { MaskedTextInput } from "react-native-mask-text";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronCircleDown, faImage, faX } from "@fortawesome/free-solid-svg-icons";

const schema = yup.object({
    nomeProduto: yup
        .string()
        .min(6, "O nome do produto deve conter pelo menos 6 caracteres!")
        .max(30, "O nome do produto deve conter até 30 caracteres!")
        .required("O nome do produto é obrigatório!"),
    tipoProduto: yup
        .string()
        .required("A categoria é obrigatória"),
    unidadeMedida: yup
        .string()
        .min(2, "A unidade de medida deve conter somente 2 caracteres!")
        .max(2, "A unidade de medida deve conter somente 2 caracteres!")
        .uppercase()
        .required("A unidade de medida do produto é obrigatório!"),
    valorVendaProduto: yup
        .number()
        .typeError('Digite um número válido')
        .positive('Valor deve ser maior que zero')
        .required("O valor de venda do Produto é obrigatório!"),
    valorCustoProduto: yup
        .number()
        .typeError('Digite um número válido')
        .positive('Valor deve ser maior que zero')
        .required("O valor de custo do Produto é obrigatório!"),
    estimativaEntrega: yup
        .number()
        .typeError('Digite um número válido')
        .positive('Valor deve ser maior que zero')
        .min(0)
        .required("A estimativa de entrega é obrigatória!"),
    descricaoProduto: yup
        .string()
        .min(10, "A descrição deve conter pelo menos 10 caracteres!")
        .max(80, "A descrição deve conter até 80 caracteres!")
        .required("A descrição do Produto é obrigatório"),
    imagem: yup
        .mixed()
        .required("Imagem é obrigatório")
        .test("is-blob", "Arquivo Inválido", value => {
            return value instanceof FormData
        })
})

const CustomDropdownInput = ({
  placeholder,
  selectedLabel,
  rightIcon,
}: DropdownInputProps) => (
  <TextInput
    editable={false}
    mode="outlined"
    placeholder={placeholder}
    placeholderTextColor="#4e5661"
    value={selectedLabel}
    style={{ 
        backgroundColor: '#ffffff',
        color: 'red'
    }}
    outlineColor="#d5d9de"
    textColor="black"
    right={<FontAwesomeIcon icon={faChevronCircleDown} size={12} color="gray"/>}
  />
);

export default function CadastroProdutos(){
    const { control, handleSubmit, setValue, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    })
    const navegador = useRouter();
    const { produtoId } = useLocalSearchParams()

    const [arquivo, setArquivo] = useState<FormData>();
    const [nomeArquivo, setNomeArquivo] = useState('');
    const [tipoProdutos, setTipoProdutos] = useState<any[]>([]);
    const [produtosEditar, setProdutosEditar] = useState<Produtos>();
    const [tipoProdutoSelecionado, setTipoProdutoSelecionado] = useState<string>();
    const [loading, setLoading] = useState(false);
    
    const selecionarArquivo = async () => {
        const resultado = await DocumentPicker.getDocumentAsync({
            type: ['image/*'],
            copyToCacheDirectory: true,
        });

        if (resultado.assets && resultado.assets.length > 0) {
            const imagem = resultado.assets[0];
            const nomeLimpo = imagem.name.replace(/[^\w.-]/g, '_') || 'imagem.jpg';
            const formData: FormData = new FormData();

            if(Platform.OS === 'android')
            {
                formData.append('imagem', {
                    uri: imagem.uri,
                    name: nomeLimpo,
                    type: imagem.mimeType || "image/jpeg"
                } as any, nomeLimpo)
            }
            else {
                const resultado = (await fetch(imagem.uri))
                const blob = await resultado.blob()

                formData.append('imagem', blob, nomeLimpo)
            }

            setArquivo(formData);
            setNomeArquivo(nomeLimpo)
            setValue("imagem", formData)
        }
    };

    async function carregarProduto(produtoId: number){
        try {
            setLoading(true);
            const produto: Produtos = await buscarProdutoPorId(produtoId).then(res => res.data);
            setProdutosEditar(produto);
            setValue("descricaoProduto", produto.descricao)
            setValue("estimativaEntrega", produto.estimativaEntrega)
            setValue("nomeProduto", produto.nome)
            setValue("unidadeMedida", produto.unidadeMedida)
            setValue("valorCustoProduto", produto.valorDeCusto)
            setValue("valorVendaProduto", produto.valorDeVenda)
            setValue("tipoProduto", produto.tipoProdutosId as any)

            if(produto.uriImagem){
                var nomeArquivo = produto.uriImagem.substring(produto.uriImagem.lastIndexOf("/") + 1, produto.uriImagem.length);
                const localUri = FileSystem.documentDirectory + nomeArquivo;
                const formData: FormData = new FormData();

                if(Platform.OS === 'android')
                {
                    const file = await FileSystem.downloadAsync(produto.uriImagem, localUri)
                    formData.append("imagem", {
                        uri: localUri,
                        name: nomeArquivo,
                        type: file.mimeType,
                    } as any, nomeArquivo)
                }
                else
                {
                    const blob = await fetch(produto.uriImagem).then(async res => await res.blob())
                    formData.append("imagem",blob, nomeArquivo)
                }
                
                setArquivo(formData);
                setNomeArquivo(nomeArquivo)
                setValue("imagem", formData);
            }
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

    const onSubmitCadastrar = async (formularioDados: any) => {
        setLoading(true);
        const dados: Produtos = {
            id: 0,
            ativo: true,
            descricao: formularioDados.descricaoProduto,
            nome: formularioDados.nomeProduto,
            estimativaEntrega: formularioDados.estimativaEntrega,
            unidadeMedida: formularioDados.unidadeMedida,
            valorDeCusto: formularioDados.valorCustoProduto / 100,
            valorDeVenda: formularioDados.valorVendaProduto / 100,
            tipoProdutosId: Number(formularioDados.tipoProduto),
        }
        try {
           const produto = await cadastrarProduto(dados);
           if(produto){
               await cadastrarProdutoImagem(formularioDados.imagem, produto.id);
               navegador.back()
               showMessage({
                   message: "Produto cadastrado com sucesso",
                   type: "success"
                })
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
        if(produtoId && produtosEditar){
            const dados: Produtos = {
                id: Number(produtoId),
                ativo: produtosEditar.ativo,
                descricao: formularioDados.descricaoProduto,
                nome: formularioDados.nomeProduto,
                estimativaEntrega: formularioDados.estimativaEntrega,
                unidadeMedida: formularioDados.unidadeMedida,
                valorDeCusto: formularioDados.valorCustoProduto / 100,
                valorDeVenda: formularioDados.valorVendaProduto / 100,
                tipoProdutosId: Number(formularioDados.tipoProduto),
                uriImagem: produtosEditar.uriImagem
            }

            try {
                const produtoEditado: Produtos = await editarProduto(dados).then(res => res.data);
                if(produtoEditado){
                    var nomeImagemNoDB = produtosEditar.uriImagem?.substring(produtosEditar.uriImagem.lastIndexOf("/") + 1, produtosEditar.uriImagem.length)
                    if(!(nomeArquivo === nomeImagemNoDB)){
                        await editarProdutoImagem(formularioDados.imagem, produtoEditado.id);
                    }
                    navegador.back()
                    showMessage({
                        message: "Produto editado com sucesso",
                        type: "success"
                    })
                }
                setLoading(false);
            } catch (error) {
                if (isAxiosError(error)) {
                    console.error("⚠️ Axios error.code:", error.code);
                    console.error("⚠️ Axios error.message:", error.message);
                    console.error("⚠️ Axios error.status:", error.status);
                    console.error("⚠️ Axios error.cause:", error.cause);
                    console.error("⚠️ Axios error.json:", error.toJSON());
                } else {
                    console.error("❌ Erro desconhecido:", error);
                }

                setLoading(false);
                throw error;
            }
        }
    }

    function navegar(rota: Href){
        navegador.back();
    }

    useEffect(() => {
        const carregar = async () => {
            try {
                setLoading(true);
                const tipoProdutos = await buscarTipoProdutos();
                const options: any[] = tipoProdutos.map(tipoProduto => {
                    return {
                        label: tipoProduto.nome,
                        value: tipoProduto.id
                    }
                })
                setTipoProdutos(options);
                setLoading(false);
            } catch(error) {
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

        carregar();
    }, [])

    useEffect(() => {
        if(produtoId){
            carregarProduto(Number(produtoId));
        }
    }, [produtoId])

    return (
        <>
        <Stack.Screen options={{ headerTitle: "Cadastro de Produto", headerTitleAlign: 'center', headerBackVisible: true }} />
            {
                loading ? (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color={'gray'}/>
                    </View>
                ) : (
                    <SafeAreaView style={{ flex: 1 }}>
                        <ScrollView style={styles.topo} contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 150 }} showsVerticalScrollIndicator={false} >
                            <View style={styles.agrupamentoInput}>
                                <HelperText type="info" style={{ color: '#646d79', marginBottom: -8, padding: 0 }}>
                                    Nome do Produto
                                </HelperText>
                                <Controller 
                                    control={control}
                                    name="nomeProduto"
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
                                                    text: '#565e6a',
                                                },
                                                
                                            }}
                                            placeholder="Digite o nome do Produto" 
                                            placeholderTextColor={'#bfc3cb'}/>
                                    )}/>
                                    {errors.nomeProduto && <Text style={styles.error}>{errors.nomeProduto.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <HelperText type="info" style={{ color: '#646d79', marginBottom: -8, padding: 0 }}>
                                    Descrição do Produto
                                </HelperText>
                                <Controller 
                                    control={control}
                                    name="descricaoProduto"
                                    render={({ field: {onChange, value}}) => (
                                        <TextInput 
                                            mode="outlined" 
                                            multiline
                                            onChangeText={onChange} 
                                            value={value} 
                                            numberOfLines={4}
                                            style={styles.input}
                                            activeOutlineColor="#b89415" 
                                            contentStyle={{ 
                                                color: '#565e6a', 
                                                height: 180, 
                                                textAlignVertical: "top", // garante que o texto começa no topo no Android
                                             }}
                                            theme={{
                                                colors: {
                                                    outline: '#d5d9de',
                                                    placeholder: '#d5d9de60',
                                                    text: '#565e6a'
                                                },
                                                
                                            }}
                                            placeholder="Digite a descrição do Produto..." 
                                            placeholderTextColor={'#bfc3cb'}
                                            />
                                    )}/>
                                    {errors.descricaoProduto && <Text style={styles.error}>{errors.descricaoProduto.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <HelperText type="info" style={{ color: '#646d79',  padding: 0 }}>
                                    Categoria
                                </HelperText>
                                <Controller 
                                    control={control}
                                    name="tipoProduto"
                                    render={({field: {onChange, value}}) => (
                                        <Dropdown
                                            label="Categoria"
                                            placeholder="Selecione a Categoria"
                                            hideMenuHeader={true}
                                            options={tipoProdutos}
                                            value={value}
                                            onSelect={onChange}
                                            mode="outlined"
                                            CustomDropdownInput={CustomDropdownInput}
                                            
                                        />
                                    )}
                                />
                                {errors.tipoProduto && <Text style={styles.error}>{errors.tipoProduto.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <HelperText type="info" style={{ color: '#646d79', marginBottom: -8, padding: 0 }}>
                                    Unidade de Medida
                                </HelperText>
                                <Controller 
                                    control={control}
                                    name="unidadeMedida"
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
                                            placeholder="Digite a Unidade Medida" 
                                            placeholderTextColor={'#bfc3cb'} 
                                            maxLength={2}/>
                                    )}/>
                                    {errors.unidadeMedida && <Text style={styles.error}>{errors.unidadeMedida.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <HelperText type="info" style={{ color: '#646d79', marginBottom: -8, padding: 0 }}>
                                    Valor de Venda
                                </HelperText>
                                <Controller 
                                    control={control}
                                    name="valorVendaProduto"
                                    render={({ field: {onChange, value}}) => (
                                        <MaskedTextInput
                                            keyboardType="numeric"
                                            placeholder="Digite o valor de venda"
                                            style={[
                                                styles.input,
                                                {
                                                    borderWidth: 1,
                                                    borderColor: '#d5d9de',  // cor da borda do Paper
                                                    borderRadius: 4,
                                                    paddingVertical: 16,
                                                    paddingHorizontal: 14,
                                                    fontSize: 16,
                                                    color: '#565e6a',
                                                }
                                            ]}
                                            type="currency"
                                            options={{
                                                prefix: "R$ ",
                                                decimalSeparator: ",",
                                                groupSeparator: ".",
                                                precision: 2,
                                            }}  
                                            value={produtosEditar != null ? Number((produtosEditar.valorDeVenda * 100)).toString() : ''}
                                            onChangeText={(masked, unmasked) => { onChange(parseFloat(unmasked)) } }
                                        />
                                    )}/>
                                    {errors.valorVendaProduto && <Text style={styles.error}>{errors.valorVendaProduto.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <HelperText type="info" style={{ color: '#646d79', marginBottom: -8, padding: 0 }}>
                                    Valor de Custo
                                </HelperText>
                                <Controller 
                                    control={control}
                                    name="valorCustoProduto"
                                    render={({ field: {onChange, value}}) => (
                                        <MaskedTextInput
                                            keyboardType="numeric"
                                            placeholder="Digite o valor de custo"
                                            style={[
                                                styles.input,
                                                {
                                                    borderWidth: 1,
                                                    borderColor: '#d5d9de',  // cor da borda do Paper
                                                    borderRadius: 4,
                                                    paddingVertical: 16,
                                                    paddingHorizontal: 14,
                                                    fontSize: 16,
                                                    color: '#565e6a',
                                                }
                                            ]}
                                            type="currency"
                                            options={{
                                                prefix: "R$ ",
                                                decimalSeparator: ",",
                                                groupSeparator: ".",
                                                precision: 2,
                                            }}  
                                            value={produtosEditar != null ? Number((produtosEditar.valorDeCusto * 100)).toString() : ''}
                                            onChangeText={(masked, unmasked) => { onChange(parseFloat(unmasked)) } }
                                        />
                                    )}/>
                                    {errors.valorCustoProduto && <Text style={styles.error}>{errors.valorCustoProduto.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <HelperText type="info" style={{ color: '#646d79', marginBottom: -8, padding: 0 }}>
                                    Estimativa de Entrega
                                </HelperText>
                                <Controller 
                                    control={control}
                                    name="estimativaEntrega"
                                    render={({ field: {onChange, value}}) => (
                                        <TextInput 
                                            mode="outlined" 
                                            keyboardType="numeric" 
                                            onChangeText={onChange} 
                                            value={value != null ? value.toString() : ''} 
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
                                            placeholder="Digite a estimativa de entrega" 
                                            placeholderTextColor={'#bfc3cb'}/>
                                    )}/>
                                    {errors.estimativaEntrega && <Text style={styles.error}>{errors.estimativaEntrega.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInputUpload}>
                                <HelperText type="info" style={{ color: '#646d79', marginBottom: 4, padding: 0 }}>
                                    Imagem do Produto
                                </HelperText>
                                <Controller
                                    control={control}
                                    name="imagem"
                                    render={({field: {value, onChange}, fieldState: {error}}) => (
                                        <>
                                            <TouchableOpacity
                                                style={styles.buttonUpload}
                                                hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
                                                onPress={selecionarArquivo}
                                            >
                                                <FontAwesomeIcon icon={faImage} size={32} color="#d1d5db"/>
                                                {
                                                    nomeArquivo && nomeArquivo !== '' ? (
                                                        <Text>
                                                            {nomeArquivo.substring(0, 10) + nomeArquivo.substring(nomeArquivo.length - 4, nomeArquivo.length)}
                                                        </Text>
                                                    ) : (
                                                        <>
                                                            <Text style={{ fontWeight: 'bold', color: '#13a4ec', textAlign: 'center'}}>
                                                                Carregue um arquivo
                                                            </Text>
                                                            <Text numberOfLines={2} style={{ color: '#656e7a', textAlign: 'center'}}>
                                                                ou Arraste e solte PNG, JPG até 10MB.
                                                            </Text>
                                                        </>
                                                    )
                                                }
                                            </TouchableOpacity>
                                            {error && (
                                                <Text style={[styles.error, { alignSelf: 'center' }]}>{error.message}</Text>
                                            )}
                                        </>
                                    )}
                                />
                            </View>
                        </ScrollView>
                        <View style={{ flexDirection: 'column', gap: 10, marginTop: 'auto', paddingHorizontal: 32, paddingVertical: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#d5d9de'}}>
                            <View>
                                <TouchableOpacity  onPress={handleSubmit(!produtoId ? onSubmitCadastrar : onSubmitEditar)} style={{ backgroundColor: '#b89415', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{!produtoId ? "Cadastrar" : "Editar"}</Text>
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

    agrupamentoInputUpload: {
        marginTop: 30,
        height: '15%',
    },

    buttonUpload: {
        width: '100%',
        height: '100%',
        padding: 0,
        flexDirection: 'column',
        paddingHorizontal: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dotted',
        borderWidth: 2,
        borderRadius: 8,
        borderColor: '#d5d9de',
        backgroundColor: '#ffffff'
    }
})