import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Chip, HelperText, TextInput } from 'react-native-paper';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import * as DocumentPicker from 'expo-document-picker';
import { Button } from "react-native-paper";
import Botao from "@/components/Botao/Botao";
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { MaskedTextInput, unMask } from "react-native-mask-text";
import axios, { isAxiosError } from "axios";
import { TipoConsultas } from "@/interfaces/Consultas/TipoConsultas";
import { buscarTipoConsultaPorId, cadastrarHorarios, cadastrarTipoConsulta, cadastrarTipoConsultaImagem, editarHorarios, editarTipoConsulta, editarTipoConsultaImagem } from "@/services/consultas/consultas-service";
import { showMessage } from "react-native-flash-message";
import { Href, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { HorarioConsultas } from "@/interfaces/Consultas/HorarioConsultas";
import * as FileSystem from 'expo-file-system';
import { faCalendar, faClock, faImage, faL, faX } from "@fortawesome/free-solid-svg-icons";
import { baseURL } from "@/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const schema = yup.object({
    nomeConsulta: yup
        .string()
        .min(6, "O minímo de caracteres é 6")
        .max(30, "O máximo de caracteres é 30")
        .required("O nome da Consulta é obrigatória!"),
    valorConsulta: yup
        .number()
        .typeError('Digite um número válido')
        .positive('Valor deve ser maior que zero')
        .required("O valor da Consulta é obrigatório!"),
    descricaoConsulta: yup
        .string()
        .min(10, "O minímo de caracteres é 10")
        .max(80, "O máximo de caracteres é 80")
        .required("A descrição da Consulta é obrigatória"),
    start: yup.string().matches(timeRegex, {
        message:  "Formato inválido, correto: HH:mm",
        excludeEmptyString: true,
    }).notRequired(),
    end: yup.string().matches(timeRegex, {
        message: "Formato inválido, correto: HH:mm",
        excludeEmptyString: true
    }).notRequired(),
    horarios: yup
        .array()
        .of(
            yup.object().shape({
                id: yup.number().required(),
                start: yup.string().required(),
                end: yup.string().required(),
            })
        )
        .min(1, "Necessário ao menos 1 horário"),
    imagem: yup
        .mixed()
        .required("Imagem é obrigatório")
        .test("is-blob", "Arquivo Inválido", value => {
            return value instanceof FormData
        })
})


export default function CadastroTipoConsultas() {
    const { control, handleSubmit, getValues, trigger, resetField, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            start: "",
            end: "",
            horarios: []
        }
    })
    const navegador = useRouter();
    const { tipoConsultaId } = useLocalSearchParams()

    const [arquivo, setArquivo] = useState<FormData>();
    const [nomeArquivo, setNomeArquivo] = useState('');
    const [aberto, setAberto] = useState(false);
    const [inputAtivo, setInputAtivo] = useState('');
    const [horarios, setHorarios] = useState<any[]>([]);
    const [tipoConsultaEditar, setTipoConsultaEditar] = useState<TipoConsultas>();
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
            else
            {
                const blob = await fetch(imagem.uri).then(async res => await res.blob())
                formData.append('imagem', blob, nomeLimpo)
            }

            setArquivo(formData);
            setNomeArquivo(nomeLimpo)
            setValue("imagem", formData)
        }
    };

    const onSubmitCadastrar = async (formularioDados: any) => {
        setLoading(true);
        const dados: TipoConsultas = {
            id: 0,
            nome: formularioDados.nomeConsulta,
            valorAtual: formularioDados.valorConsulta,
            descricao: formularioDados.descricaoConsulta,
            tipoConsultaHorarios: [],
            imagem: "",
            ativo: true
        }
        
        const horariosDados: HorarioConsultas[] = horarios.map(horario => {
            return {
                ...horario,
                inicio: horario.start,
                fim: horario.end,
                ativo: true,
                tipoConsultaHorarios: [{
                    id: 0,
                    reservado: false,
                    dataReserva: new Date(),
                }]
            }
        })
        
        try {
            const tipoConsultaCadastrada: TipoConsultas = await cadastrarTipoConsulta(dados);
            if(tipoConsultaCadastrada){
                
                await cadastrarTipoConsultaImagem(formularioDados.imagem, tipoConsultaCadastrada.id);
                await cadastrarHorarios(horariosDados, tipoConsultaCadastrada.id);

                showMessage({
                    message: "Consulta cadastrada com sucesso",
                    type: "success"
                })

                navegador.back()
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

    const onSubmitEditar = async (formularioDados: any) => {
        setLoading(true);
        if(tipoConsultaId && tipoConsultaEditar){
            const dados: TipoConsultas = {
                id: Number(tipoConsultaId),
                nome: formularioDados.nomeConsulta,
                valorAtual: formularioDados.valorConsulta / 100,
                descricao: formularioDados.descricaoConsulta,
                tipoConsultaHorarios: tipoConsultaEditar.tipoConsultaHorarios,
                imagem: "",
                uriImagem: tipoConsultaEditar.uriImagem,
                ativo: tipoConsultaEditar.ativo
            }

            const horariosDados: HorarioConsultas[] = horarios.map(horario => {
                if(horario.id === 0){
                    return {
                        ...horario,
                        inicio: horario.start,
                        fim: horario.end,
                        tipoConsultaHorarios: [{
                            id: 0,
                            reservado: false,
                            dataReserva: new Date(),
                        }]
                    }
                } else {
                    return {
                        ...horario,
                        inicio: horario.start,
                        fim: horario.end,
                        tipoConsultaHorarios: [...tipoConsultaEditar.tipoConsultaHorarios.filter(c => c.horarioId === horario.id)]
                    }
                }
                
            })

            try {
                const tipoConsultaEditada: TipoConsultas = await editarTipoConsulta(dados.id, dados).then(res => res.data);
                if(tipoConsultaEditada){
                    var nomeImagemNoDB = tipoConsultaEditar.uriImagem?.substring(tipoConsultaEditar.uriImagem?.lastIndexOf("/") + 1, tipoConsultaEditar.uriImagem?.length)
                    if(!(nomeArquivo === nomeImagemNoDB)){
                        await editarTipoConsultaImagem(formularioDados.imagem, tipoConsultaEditada.id);
                    }
                    
                    await editarHorarios(horariosDados, tipoConsultaEditada.id);

                    showMessage({
                        message: "Consulta editada com sucesso",
                        type: "success"
                    })

                    navegador.back();
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

    async function adicionarHorario(){
        const isValid = await trigger(["start", "end"]);
        if (!isValid) return;

        const { start, end } = getValues()
        const novosHorarios = [...horarios, {id: 0, start, end}]
        setHorarios(novosHorarios)

        setValue("horarios", novosHorarios)
        resetField("start")
        resetField("end")
    }

    function removerHorario(index: number){
        if(tipoConsultaId)
        {
            const horariosEditado = horarios.map((item, idx) => {
                if (idx === index) 
                {
                    item.ativo = false;
                }

                return item;
            })
            setHorarios(horariosEditado)
        } else {
            setHorarios(prev => prev.filter((_, idx) => idx !== index))
        }
    }

    function abrirDatePicker(inputAtivo: string) {
        setInputAtivo(inputAtivo)
        setAberto(true);
    }

    async function carregarTipoConsulta(tipoConsultaId: number){
        try {
            setLoading(true);
            const tipoConsulta: TipoConsultas = await buscarTipoConsultaPorId(tipoConsultaId).then(res => res.data);
            setTipoConsultaEditar(tipoConsulta)
            setValue("nomeConsulta", tipoConsulta.nome)
            setValue("valorConsulta", tipoConsulta.valorAtual * 100)
            setValue("descricaoConsulta", tipoConsulta.descricao)
            var horariosFormatados = tipoConsulta.tipoConsultaHorarios.map(tipoConsultaHorario => {
                var horaInicio = tipoConsultaHorario.horario.inicio.split(':').slice(0, 2).join(':');
                var horaFim = tipoConsultaHorario.horario.fim.split(':').slice(0, 2).join(':');

                return {
                    id: tipoConsultaHorario.horario.id,
                    start: horaInicio,
                    end: horaFim,
                    ativo: tipoConsultaHorario.horario.ativo
                }
            })
            setValue("horarios", horariosFormatados);
            setHorarios(horariosFormatados);

            if(tipoConsulta.uriImagem){
                var nomeArquivo = tipoConsulta.uriImagem.substring(tipoConsulta.uriImagem.lastIndexOf("/") + 1, tipoConsulta.uriImagem.length);
                const localUri = FileSystem.documentDirectory + nomeArquivo;
                const formData: FormData = new FormData();

                if(Platform.OS === 'android')
                {
                    const file = await FileSystem.downloadAsync(tipoConsulta.uriImagem, localUri);
                    formData.append("imagem", {
                        uri: localUri,
                        name: nomeArquivo,
                        type: file.mimeType,
                    } as any, nomeArquivo)
                }
                else
                {
                    const resultado = await fetch(tipoConsulta.uriImagem)
                    const blob = await resultado.blob()
                    formData.append("imagem", blob, nomeArquivo)
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
            
            setLoading(false)
            throw error;
        }
    }

    function navegar(rota: Href){
        navegador.back();
    }

    useEffect(() => {
        if(tipoConsultaId){
            carregarTipoConsulta(Number(tipoConsultaId));
        }
    }, [tipoConsultaId])

    return (
        <>
            <Stack.Screen options={{ headerTitle: "Cadastro de Consultas", headerTransparent: false, headerTitleAlign: 'center', headerBackVisible: true }} />
            {
                loading ? (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color={'gray'}/>
                    </View>
                ) : (
                    <SafeAreaView style={{ flex: 1 }}>
                        <ScrollView style={styles.topo} contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                            <View style={styles.agrupamentoInput}>
                                <HelperText type="info" style={{ color: '#646d79', marginBottom: -8, padding: 0 }}>
                                    Nome da Consulta
                                </HelperText>
                                <Controller
                                    control={control}
                                    name="nomeConsulta"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput 
                                            mode="outlined" 
                                            onChangeText={onChange} 
                                            value={value ?? ''} 
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
                                            placeholder="Digite o nome da Consulta" 
                                            placeholderTextColor={'#bfc3cb'}
                                            />
                                    )} />
                                {errors.nomeConsulta && <Text style={styles.error}>{errors.nomeConsulta.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <HelperText type="info" style={{ color: '#646d79', marginBottom: -8, padding: 0 }}>
                                    Descrição da Consulta
                                </HelperText>
                                <Controller
                                    control={control}
                                    name="descricaoConsulta"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput 
                                            mode="outlined" 
                                            multiline
                                            onChangeText={onChange} 
                                            value={value ?? ''} 
                                            style={styles.input} 
                                            activeOutlineColor="#b89415"
                                            numberOfLines={4}
                                            contentStyle={{ 
                                                color: '#565e6a',
                                                height: 180, 
                                                textAlignVertical: "top", // garante que o texto começa no topo no Android
                                             }}
                                            theme={{
                                                colors: {
                                                    outline: '#d5d9de',
                                                    placeholder: '#d5d9de60',
                                                    text: '#565e6a',
                                                },
                                                
                                            }}
                                            placeholder="Digite a descrição da Consulta" 
                                            placeholderTextColor={'#bfc3cb'}
                                            />
                                    )} />
                                {errors.descricaoConsulta && <Text style={styles.error}>{errors.descricaoConsulta.message}</Text>}
                            </View>
                            <View style={styles.agrupamentoInput}>
                                <HelperText type="info" style={{ color: '#646d79', marginBottom: -8, padding: 0 }}>
                                    Valor da Consulta
                                </HelperText>
                                <Controller
                                    control={control}
                                    name="valorConsulta"
                                    render={({ field: { onChange, value } }) => (
                                        <MaskedTextInput
                                            placeholder="Digite o valor da consulta"
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
                                            value={tipoConsultaEditar != null ? Number((tipoConsultaEditar.valorAtual * 100)).toString() : ''}
                                            onChangeText={(masked, unmasked) => { onChange(parseFloat(unmasked)) } }
                                        />
                                    )} />
                                {errors.valorConsulta && <Text style={styles.error}>{errors.valorConsulta.message}</Text>}
                            </View>
                            <View>
                                <View style={styles.agrupamentoInput}>
                                    <HelperText type="info" style={{ color: '#646d79', marginBottom: -8, padding: 0 }}>
                                        Início do Horário
                                    </HelperText>
                                    <Controller
                                        control={control}
                                        name="start"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                keyboardType="numeric"
                                                mode="outlined"
                                                style={styles.input}
                                                activeOutlineColor="#b89415"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value != null ? value.toString() : ''}
                                                contentStyle={{ color: '#565e6a' }}
                                                theme={{
                                                    colors: {
                                                        outline: '#d5d9de',
                                                        placeholder: '#d5d9de60',
                                                        text: '#565e6a',
                                                    },
                                                    
                                                }}
                                                placeholder="Digite o início do horário"
                                                placeholderTextColor={'#bfc3cb'}
                                                render={props => (
                                                    <MaskedTextInput
                                                        {...props}
                                                        mask="99:99" // HH:mm
                                                        onChangeText={onChange}
                                                    />
                                                )}
                                                right={<TextInput.Icon icon={() => (
                                                    <FontAwesomeIcon icon={faCalendar} size={15} color="gray"/>
                                                )} onPress={() => abrirDatePicker("inicio")}/>}
                                            />
                                        )}
                                    />
                                    {errors?.start && (
                                        <Text style={styles.error}>{errors.start.message}</Text>
                                    )}

                                    <HelperText type="info" style={{ color: '#646d79', marginBottom: -8, marginTop: 16, padding: 0 }}>
                                        Fim do Horário
                                    </HelperText>
                                    <Controller
                                        control={control}
                                        name="end"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                keyboardType="numeric"
                                                mode="outlined"
                                                style={styles.input}
                                                activeOutlineColor="#b89415"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value != null ? value.toString() : ''}
                                                contentStyle={{ color: '#565e6a' }}
                                                theme={{
                                                    colors: {
                                                        outline: '#d5d9de',
                                                        placeholder: '#d5d9de60',
                                                        text: '#565e6a',
                                                    },
                                                    
                                                }}
                                                placeholder="Digite o fim do horário"
                                                placeholderTextColor={'#bfc3cb'}
                                                render={props => (
                                                    <MaskedTextInput
                                                        {...props}
                                                        mask="99:99" // HH:mm
                                                        onChangeText={onChange}
                                                    />
                                                )}      
                                                right={<TextInput.Icon icon={() => (
                                                    <FontAwesomeIcon icon={faCalendar} size={15} color="gray"/>
                                                )} onPress={() => abrirDatePicker("fim")}/>}
                                            />
                                        )}
                                    />
                                    {errors?.end && (
                                        <Text style={styles.error}>{errors.end.message}</Text>
                                    )}
                                </View>
                                <Button mode="contained" textColor="white" style={{ marginTop: 16, backgroundColor: '#b89415' }} onPress={adicionarHorario}> 
                                    Adicionar Horário
                                </Button>
                            </View>
                            <View style={{ alignItems :'center', justifyContent: 'center', flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 32 }}>
                                {
                                    horarios.filter(c => c.ativo !== false).map((horario, index) => {
                                        return (
                                            <Chip 
                                                key={`${index}.${horario.start}-${horario.end}`} 
                                                onClose={() => {
                                                    removerHorario(index)
                                                }}
                                                icon={() => (
                                                        <FontAwesomeIcon icon={faClock} size={12} color="white"/>
                                                    )
                                                }
                                                closeIcon={() => (
                                                    <FontAwesomeIcon icon={faX} size={12} color="white"/>
                                                )}
                                                style={{ height: 35 }}>
                                                { horario.start } - { horario.end }
                                            </Chip>
                                        )
                                    })
                                }
                                {errors?.horarios && (
                                    <Text style={styles.error}>{errors?.horarios?.message}</Text>
                                )}
                            </View>
                            <View>
                                <TimePickerModal
                                    visible={aberto}
                                    onDismiss={() => setAberto(false)}
                                    hours={12}
                                    minutes={14}
                                    onConfirm={({ hours, minutes}) => {
                                        setAberto(false);

                                        const horario = `${hours}:${minutes}`;
                                        if(inputAtivo === "inicio"){
                                            setValue("start", horario)
                                        } else if(inputAtivo === "fim"){
                                            setValue("end", horario)
                                        }
                                    }}
                                />
                            </View>
                            <View style={styles.agrupamentoInputUpload}>
                                <HelperText type="info" style={{ color: '#646d79', marginBottom: 4, padding: 0 }}>
                                    Imagem da Consulta
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
                        <View style={{ flexDirection: 'column', gap: 10, marginTop: 'auto', padding: 32, borderTopColor: '#d5d9de', borderTopWidth: 1, backgroundColor: 'white' }}>
                            <View>
                                <TouchableOpacity  onPress={handleSubmit(!tipoConsultaId ? onSubmitCadastrar : onSubmitEditar)} style={{ backgroundColor: '#b89415', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{!tipoConsultaId ? "Cadastrar" : "Editar"}</Text>
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
        height: 200,
        marginTop: 30
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