import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ActivityIndicator, Animated, Button, Dimensions, FlatList, Image, ImageBackground, Linking, Modal, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { faCalendar, faCircleInfo, faExclamation, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import DataBotao from "@/components/DataBotao/DataBotao";
import HorarioBotao from "@/components/HorarioBotao/HorarioBotao";
import { useEffect, useRef, useState } from "react";
import { Dia } from "@/interfaces/Consultas/Dia";
import { HorarioConsultas } from "@/interfaces/Consultas/HorarioConsultas";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { buscarHorariosPorTipoConsulta, buscarTipoConsultaPorId, definirHorariosIndisponiveis, marcarConsulta } from "@/services/consultas/consultas-service";
import { DiaSelecionado } from "@/interfaces/Consultas/DiaSelecionado";
import { showMessage } from "react-native-flash-message";
import HorariosLoader from "@/components/Loaders/HorariosLoader/HorariosLoader";
import { Consultas } from "@/interfaces/Consultas/Consultas";
import { AxiosError, isAxiosError } from "axios";
import * as SecureStore from 'expo-secure-store';
import { baseURL } from "@/utils/api";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { Controller, useForm } from "react-hook-form";
import { HelperText, TextInput } from "react-native-paper";
import { MaskedTextInput } from "react-native-mask-text";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import Botao from "@/components/Botao/Botao";
import { HorariosIndisponiveis } from "@/interfaces/Consultas/HorariosIndisponiveis";
import MenuDropdownHorarios from "@/components/MenuDropdown/MenuDropdownHorarios";
import { TipoConsultas } from "@/interfaces/Consultas/TipoConsultas";
import { useMenuDropdown } from "@/components/MenuDropdown/MenuDropdownProvider";
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { format, parse } from "date-fns";
import Constants from 'expo-constants';
const { WHATSAPP } = Constants.expoConfig?.extra ?? {};

// Configurando português
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};

LocaleConfig.defaultLocale = 'pt-br';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const schema = yup.object({
    start: yup.string().required("O Inicio é obrigatório").matches(timeRegex, {
        message:  "Formato inválido, correto: HH:mm",
        excludeEmptyString: true,
    }),
    end: yup.string().required("O Fim é obrigatório").matches(timeRegex, {
        message: "Formato inválido, correto: HH:mm",
        excludeEmptyString: true
    }),
})

const { width, height } = Dimensions.get("window");


export default function ConsultaPagina(){
    const { tipoConsultaId, uri_imagem } = useLocalSearchParams();
    const navegador = useRouter();
    const path = usePathname();
    const { isAdmin } = useMenuDropdown();       


    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const [mesAtual, setMesAtual] = useState<string>(meses[new Date().getMonth()]);
    const [diasDoMes, setDiasDoMes] = useState<Dia[]>([]);
    const [diaSelecionado, setDiaSelecionado] = useState<DiaSelecionado>({
        id: 0,
        data: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toLocaleDateString('pt-BR')
    });
    const [horarios, setHorarios] = useState<HorarioConsultas[]>([]);
    const [horarioSelecionado, setHorarioSelecionado] = useState<HorarioConsultas>({
        id: 0,
        inicio: '',
        fim: '',
        tipoConsultaHorarios: [],
        ativo: true
    });
    const [tipoConsulta, setTipoConsulta] = useState<TipoConsultas>();
    const [loading, setLoading] = useState(true);
    const [confirmando, setConfirmando] = useState(false);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [modalHorariosIndisponiveisVisivel, setModalHorariosIndisponiveisVisivel] = useState(false);
    const { control, setValue, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            start: "",
            end: "",
        }
    })
    const [aberto, setAberto] = useState(false);
    const [inputAtivo, setInputAtivo] = useState('');

    function setarDiaSelecionado(dia: DiaSelecionado){
        setDiaSelecionado(dia);
        buscarHorarios(dia.data);
    }

    function setarHorarioSelecionado(horario: HorarioConsultas){
        setHorarioSelecionado(horario)
    }

    function pegarProximoMes(){
        const indexMesAtual = meses.findIndex(c => c === mesAtual);
        const proximoMes = (indexMesAtual + 1) % meses.length;
        if(proximoMes >= new Date().getMonth()){
            setMesAtual(meses[proximoMes]);
            setDiaSelecionado({
                id: 0,
                data: new Date(new Date().getFullYear(), proximoMes, 1).toLocaleDateString('pt-BR')
            });
        }
    }

    function pegarMesAnterior(){
        const indexMesAtual = meses.findIndex(c => c === mesAtual);
        const mesAnterior = (indexMesAtual - 1 + meses.length) % meses.length;
        if(mesAnterior >= new Date().getMonth()){
            setMesAtual(meses[mesAnterior]);
            setDiaSelecionado({
                id: 0,
                data: mesAnterior !== new Date().getMonth() ? new Date(new Date().getFullYear(), mesAnterior, 1).toLocaleDateString('pt-BR') : new Date(Date.now()).toLocaleDateString('pt-BR')
            });
        }
    }

    function pegarDiasDoMes(){
        const ano = new Date().getFullYear();
        const indexMesAtual = meses.findIndex(c => c === mesAtual);
        const todosDias = indexMesAtual !== new Date().getMonth() ? true : false;
        const primeiroDia = todosDias ? new Date(ano, indexMesAtual, 1).getDate() : new Date(Date.now()).getDate();
        const ultimoDia = new Date(ano, indexMesAtual + 1, 0).getDate();
        let dias: Dia[] = [];
        for(let dia = primeiroDia; dia <= ultimoDia; dia++){
            let textoDia = new Date(ano, indexMesAtual, dia).toLocaleDateString('pt-BR', {
                weekday: 'short'
            })
            let data = new Date(ano, indexMesAtual, dia).toLocaleDateString('pt-BR');
            dias.push({
                numeroDia: dia.toString().length === 1 ? dia.toString().padStart(2, '0') : dia.toString(),
                dia: textoDia.replace('.', ''),
                data: data
            })
        }
        return dias;
    }

    async function buscarHorarios(diaSelecionado: string){
        try {
            setLoading(true);
           const horariosResponse = await buscarHorariosPorTipoConsulta(Number(tipoConsultaId), diaSelecionado);
           if(horariosResponse.length === 0){
                showMessage({
                    message: "Sem horários disponiveis",
                    type: "info"
                })
            } 
           setHorarios(horariosResponse);
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

    async function buscarTipoConsulta(){
        try {
            setLoading(true)
            const tipoConsulta = await buscarTipoConsultaPorId(Number(tipoConsultaId)).then(res => res.data);
            setTipoConsulta(tipoConsulta);
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

    async function handleMarcarConsulta(){
        try {
            setConfirmando(true);
            const [dia, mes, ano] = diaSelecionado.data.split("/").map(Number);
            var data = new Date(Date.UTC(ano, mes - 1, dia))
            var usuarioId = Platform.OS === 'android' 
                ? await SecureStore.getItemAsync('usuarioId')
                : localStorage.getItem('usuarioId');
            
            const consulta: Consultas = {
                id: 0,
                inicio: horarioSelecionado.inicio,
                fim: horarioSelecionado.fim,
                data: data,
                status: 0,
                tipoConsultaId: Number(tipoConsultaId),
                usuarioId: Number(usuarioId)
            }
            
            EnviarMensagemWhatsapp(consulta);
            await marcarConsulta(consulta);

            setConfirmando(false);
            navegador.replace(`/consulta/marcada`)
        } catch(error){
            if (isAxiosError(error)) {
                console.error("⚠️ Axios error.code:", error.code);
                console.error("⚠️ Axios error.message:", error.message);
                console.error("⚠️ Axios error.request:", error.request);
                console.error("⚠️ Axios error.response:", error.response);
            } else {
                console.error("❌ Erro desconhecido:", error);
            }
            
            setConfirmando(false)
            throw error;
        }
    }

    function EnviarMensagemWhatsapp(consulta: Consultas){
        const mensagem = `Olá! 👋

            Gostaria de agendar:

            📋 Consulta: ${tipoConsulta?.nome}
            🗓 Data: ${format(new Date(consulta.data), 'dd/MM/yyyy')}
            ⏰ Horário: ${format(parse(consulta.inicio, 'HH:mm:ss', new Date()), 'HH:mm')}

            Atenciosamente,  `
        const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

        Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
              showMessage({
                type: 'danger',
                message: 'Erro! Whatsapp não está instalado'
              })
            } else {
            return Linking.openURL(url);
            }
        })
        .catch((err) => {
            showMessage({
                type: 'danger',
                message: `Erro: ${err.message}`
            })
        });
    }

    function abrirDateTimePicker(inputAtivo: string) {
        setInputAtivo(inputAtivo)
        setAberto(true);
    }

    async function onsubmitDefinirHorariosIndisponiveis(formularioDados: any) {
        try {
            setLoading(true)
            const dados: HorariosIndisponiveis = {
                id: 0,
                data: format(parse(diaSelecionado.data, "dd/MM/yyyy", new Date()), 'yyyy-MM-dd'),
                inicio: formularioDados.start,
                fim: formularioDados.end,
                ativo: true
            }
            const response = await definirHorariosIndisponiveis(dados);
            await buscarHorarios(diaSelecionado.data);
            if(response){
                showMessage({
                    message: "Horários Definidos com sucesso",
                    type: 'success'
                })
                setModalHorariosIndisponiveisVisivel(false);
            }
            setLoading(false)
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
            
            setLoading(false)
            throw error;
        }
    }

    useEffect(() => {
        const diasDoMes = pegarDiasDoMes();
        setDiasDoMes(diasDoMes);
        
        buscarTipoConsulta();
        buscarHorarios(diaSelecionado.data); 
    }, [mesAtual])

    const HEIGHT_MAX = 220;
    const HEIGHT_MIN = 100;
    const SCROLL_DISTANCE = HEIGHT_MAX - HEIGHT_MIN;

    const scrollOffsetY = useRef(new Animated.Value(0)).current;
    const imageScrollHeight = scrollOffsetY.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [HEIGHT_MAX, HEIGHT_MIN],
        extrapolate: 'clamp'
    })

    return (
        <View style={styles.topo}>
            <Animated.View style={{ 
                height: imageScrollHeight,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
            }}>
                <Image 
                    style={styles.fundo}
                    source={{ uri: uri_imagem ? `${uri_imagem}` : `${baseURL}/imagens/sem_imagem.png` }}
                />
                <View style={styles.bordaBranca}></View>
            </Animated.View>
            <ScrollView style={[styles.conteudo, { paddingTop: 250 }]} 
                onScroll={Animated.event([
                    { 
                        nativeEvent: { 
                            contentOffset: { 
                                y: scrollOffsetY 
                            }
                        }
                    },
                ], { useNativeDriver: false })}
                scrollEventThrottle={16}
                scrollEnabled
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: HEIGHT_MAX + 50 }}
            >
                <View style={[
                    styles.cabecalho,
                ]}>
                    <View style={styles.informacoes}>
                        <Text style={[
                            styles.titulo,
                        ]}>{tipoConsulta?.nome} </Text>
                        <Text style={{ marginTop: 8, fontSize: 18, color: '#767e8c' }}>R$ {tipoConsulta?.valorAtual} </Text>
                        <Text style={{ marginTop: 4, fontSize: 18, color: '#767e8c' }}>Rua Fulano de Tal, 111, Bairro Qualquer Um</Text>
                    </View>

                    
                </View>
                <View style={styles.secaoData}>
                    <Text style={{ 
                        fontSize: 20,
                        lineHeight: 24,
                        fontWeight: 'bold',
                        padding: 0,
                        marginVertical: 16,
                        color: '#242a36',
                    }}> Selecione o Mês </Text>
                    <Calendar 
                        minDate={new Date().toISOString().split('T')[0]}
                        markedDates={{
                            [format(parse(diaSelecionado.data, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')]: { selected: true, selectedColor: '#00adf5' },
                        }}
                        onDayPress={(dia: any) => {
                            const date = new Date(dia.year, dia.month - 1, dia.day)
                            const diaSelecionado: DiaSelecionado = {
                                id: 0,
                                data: date.toLocaleDateString('pt-BR')
                            }

                            setarDiaSelecionado(diaSelecionado);
                        }}
                        monthFormat={'MMMM yyyy'}
                        hideExtraDays={true}
                        firstDay={0}
                        enableSwipeMonths={true} // navegação por swipe
                        style={{ 
                            borderRadius: 8, 
                            elevation: 2,
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            shadowOffset: { width: 0, height: 2 },
                        }}
                        
                    />
                </View>
                <View style={styles.secaoHorario}>
                    <View style={styles.grupoTitulo}> 
                        <Text style={{ 
                            fontSize: 20,
                            lineHeight: 24,
                            fontWeight: 'bold',
                            padding: 0,
                            marginVertical: 16,
                            color: '#242a36'
                        }}> Horários Disponíveis </Text> 
                        {
                            isAdmin && <View style={styles.botaoEdicao}>
                                            <View style={styles.botaoEdicao}>
                                                <MenuDropdownHorarios tipoConsultaId={tipoConsultaId} data={diaSelecionado.data} setModalHorariosIndisponiveisVisivel={setModalHorariosIndisponiveisVisivel}/>
                                            </View>

                                            <Modal
                                                animationType="slide"
                                                visible={modalHorariosIndisponiveisVisivel}
                                                onRequestClose={() => setModalHorariosIndisponiveisVisivel(false)}
                                            >
                                                {
                                                    loading ? (
                                                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                                            <ActivityIndicator size="large" color={'gray'}/>
                                                        </View>
                                                    ) : (
                                                        <View style={styles.modalHorariosIndisponiveis}>
                                                            <View style={styles.modalHorariosIndisponiveisConteudo}>
                                                                <Text style={[
                                                                    styles.titulo,
                                                                    { textAlign: 'center' }
                                                                ]}> Definir Horários Indisponíveis </Text>
                                                                <View style={styles.agrupamentoInput}>
                                                                    <TextInput
                                                                        keyboardType="numeric"
                                                                        readOnly={true}
                                                                        mode="outlined"
                                                                        style={styles.input}
                                                                        activeOutlineColor="#b89415"
                                                                        value={diaSelecionado.data}
                                                                        contentStyle={{ color: '#565e6a' }}
                                                                        theme={{
                                                                            colors: {
                                                                                outline: '#d5d9de',
                                                                                placeholder: '#d5d9de60',
                                                                                text: '#565e6a'
                                                                            },
                                                                            
                                                                        }} 
                                                                        placeholderTextColor={'#bfc3cb'}
                                                                        placeholder="Digite a Data"
                                                                        render={props => (
                                                                            <MaskedTextInput
                                                                                {...props}
                                                                                mask="99/99/9999" // DD/MM/YYYY
                                                                                onChangeText={() => {}}
                                                                            />
                                                                        )}
                                                                        right={<TextInput.Icon icon={() => (
                                                                            <FontAwesomeIcon icon={faCalendar} size={14} color="gray" />
                                                                        )}/>}
                                                                    />
                                                                </View>
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
                                                                                        text: '#565e6a'
                                                                                    },
                                                                                    
                                                                                }} 
                                                                                placeholderTextColor={'#bfc3cb'}
                                                                                placeholder="HH:mm"
                                                                                render={props => (
                                                                                    <MaskedTextInput
                                                                                        {...props}
                                                                                        mask="99:99" // HH:mm
                                                                                        onChangeText={onChange}
                                                                                    />
                                                                                )}
                                                                                right={<TextInput.Icon icon={() => (
                                                                                    <FontAwesomeIcon icon={faCalendar} size={14} color="gray" />
                                                                                )} onPress={() => abrirDateTimePicker("inicio")}/>}
                                                                            />
                                                                        )}
                                                                    />
                                                                    {errors?.start && (
                                                                        <Text style={styles.error}>{errors.start.message}</Text>
                                                                    )}

                                                                    <HelperText type="info" style={{ color: '#646d79', marginTop: 8, marginBottom: -8, padding: 0 }}>
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
                                                                                        text: '#565e6a'
                                                                                    },
                                                                                    
                                                                                }} 
                                                                                placeholderTextColor={'#bfc3cb'}
                                                                                placeholder="HH:mm"
                                                                                render={props => (
                                                                                    <MaskedTextInput
                                                                                        {...props}
                                                                                        mask="99:99" // HH:mm
                                                                                        onChangeText={onChange}
                                                                                    />
                                                                                )}      
                                                                                right={<TextInput.Icon icon={() => (
                                                                                    <FontAwesomeIcon icon={faCalendar} size={14} color="gray" />
                                                                                )} onPress={() => abrirDateTimePicker("fim")}/>}
                                                                            />
                                                                        )}
                                                                    />
                                                                    {errors?.end && (
                                                                        <Text style={styles.error}>{errors.end.message}</Text>
                                                                    )}

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
                                                                <View style={{ flexDirection: 'column', gap: 10, marginTop: 'auto', padding: 32, borderTopColor: '#d5d9de', borderTopWidth: 1, backgroundColor: 'white' }}>
                                                                    <View>
                                                                        <TouchableOpacity  onPress={handleSubmit(onsubmitDefinirHorariosIndisponiveis)} style={{ backgroundColor: '#b89415', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{!tipoConsultaId ? "Cadastrar" : "Editar"}</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    <View>
                                                                        <TouchableOpacity onPress={() => setModalHorariosIndisponiveisVisivel(false)} style={{ backgroundColor: '#e5e7eb', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Text style={{ color: '#56606d', fontWeight: 'bold' }}>Fechar</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                }
                                            </Modal> 
                                        </View>
                        }
                    </View>
                    {
                        loading ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
                                <HorariosLoader />
                            </View>
                        ) : (
                            horarios.length > 0 ? 
                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 10
                            }}> 
                                { 
                                    horarios.sort((a, b) => a.inicio.localeCompare(b.inicio)).map((horario, index) => {
                                        return (
                                            <View key={index} style={{ 
                                                width: width < 250 ? '32%' : '48%', // cada item ocupa cerca de 1/3 da linha
                                                marginBottom: 5 // espaço entre linhas
                                            }}>
                                                <HorarioBotao 
                                                    horario={horario} 
                                                    setarHorarioSelecionado={setarHorarioSelecionado}
                                                    idHorarioSelecionado={horarioSelecionado.id}
                                                />
                                            </View>
                                        )
                                    })
                                }
                            </View> :
                            <View style={[
                                { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 32, gap: 10, opacity: 0.5 }
                            ]}>
                                <FontAwesomeIcon icon={faCircleInfo} size={64} />
                                <Text style={{ fontSize: 18 }}> Não há horários disponiveis! </Text>
                            </View>
                        )
                    }
                </View>
            </ScrollView>
            <View style={{ marginTop: 'auto', padding: 16, backgroundColor: '#ffffff', borderTopWidth: 1, borderColor: '#e7e9ec' }}>
                <TouchableOpacity disabled={horarioSelecionado.inicio === "" || horarioSelecionado.fim === ""} onPress={() => setModalVisivel(true)} style={[
                    styles.botaoMarcarConsulta,
                    (horarioSelecionado.inicio === "" || horarioSelecionado.fim === "") && { opacity: 0.5 }
                ]}>
                    <Text style={styles.textoMarcarConsulta}> MARCAR CONSULTA </Text>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    visible={modalVisivel}
                    onRequestClose={() => setModalVisivel(false)}
                >
                    {
                        confirmando ? (
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <ActivityIndicator size="large" color={'#b89415'}/>
                            </View>
                        ) : (
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <View style={styles.informacoesModal}>
                                        <View style={styles.circulo}>
                                            <FontAwesomeIcon icon={faExclamation} size={32} color="#b89415"/>
                                        </View>
                                        <Text style={{ fontSize: width < 400 ? 16 : 20,  fontWeight: 'bold', textAlign: 'center', marginTop: 8, color: '#212733' }}> Deseja Prosseguir com o Agendamento? </Text>
                                        <Text style={{ textAlign: 'center', marginTop: 16, color: '#5c6471', fontSize: width < 400 ? 12 : 14 }}>Ao prosseguir com o agendamento, notificaremos o profissional responsável por meio do WhatsApp, confirmando sua consulta. Deseja continuar?</Text>
                                    </View>
                                    <View style={styles.modalBotoes}>
                                        <View style={styles.botaoWrapper}>
                                            <TouchableOpacity style={{ padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#a4a9b0', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => setModalVisivel(false)}>
                                                <Text style={{ color: '#1a202c', fontWeight: 'bold', fontSize: width < 400 ? 12 : 14}}> Voltar </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.botaoWrapper}>
                                            <TouchableOpacity style={{ backgroundColor: '#b89415', padding: 8, borderRadius: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => handleMarcarConsulta() }>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: width < 400 ? 12 : 14 }}> Continuar </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                </Modal>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    topo: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#000'
    },
    fundo: {
        flex: 1,
        zIndex: 9999
    },

    conteudo: {
        backgroundColor: '#f8fafc',
        padding: 16,
        zIndex: 0,
        marginTop: -16,
    },

    bordaBranca: {
        backgroundColor: '#f1f1f1',
        width: "100%",
        padding: 0,
        bottom: -5,
        zIndex: 999999,
        position: 'absolute'
    },

    cabecalho: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        marginLeft: -16,
        marginRight: -16,
        marginTop: -16,
        borderBottomWidth: 1,
        borderBottomColor: '#e7e9ec'
    },

    informacoes: {
        flexDirection: 'column',
        padding: 16
    },

    informacoesModal: {
        flexDirection: 'column',
        alignItems: 'center'
    },

    circulo: {
        backgroundColor: '#fdf5d6ff',
        width: 80,
        height: 80,
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    endereco: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 8
    },

    detalhesEndereco: {
        flexDirection: 'column',
        marginLeft: 4
    },

    grupoTitulo: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    titulo: {
        fontSize: 24,
        lineHeight: 24,
        fontWeight: 'bold',
        padding: 0,
        margin: 0,
        color: '#242a36',
    },

    secaoData: {
        marginTop: 16
    },

    data: {
        marginTop: 32
    },

    secaoHorario: {
        marginVertical: 32,
    },

    botoes: {
        marginTop: 16, 
        flex: 1, 
        backgroundColor: 'transparent', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#C58867'
    },

    botao: {
        width: 30, 
        height: 30, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    botaoMarcarConsulta: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        backgroundColor: '#b89415',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },

    textoMarcarConsulta: {
        fontWeight: 'bold',
        color: 'white'
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // fundo escuro semi-transparente
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        elevation: 5, // sombra no Android
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        width: '80%',
        height:  width < 400 ? '50%' : '45%',
        flexDirection: 'column',
        alignItems: 'center',
    },

    modalBotoes: {
        width: '100%',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        marginTop: 'auto',
    },

    botaoWrapper: {
        flex: 1
    },

    botaoEdicao: {
        width: 30,
        height: 30,
        backgroundColor: '#FFFFFFCC',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        zIndex: 999999,
    },

    modalHorariosIndisponiveis: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 32,
        marginHorizontal: 32,
    },

    modalHorariosIndisponiveisConteudo: {
        width: '100%',
        height: '70%',
    },

    agrupamentoInput: {
        flexDirection: 'column',
        marginTop: 30,
    },

    input: {
        backgroundColor: 'transparent',
        marginTop: 10,
    },

    error: {
        color: 'red',
        marginTop: 10,
        marginLeft: 20
    },

    botaoVariante: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FFB48B',
        width: "100%",
        height: 50,
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    }
})