import { ActivityIndicator, Dimensions, Image, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, Touchable, View } from "react-native";
import { faHourglass, faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { faArrowLeft, faCalendar, faCircleXmark, faExclamation, faLocationDot, faMapPin, faXmark, faXmarkCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { CardConsultaMarcadaPropriedades } from "./types/CardConsultaMarcadaPropriedades";
import { useEffect, useRef, useState } from "react";
import { StatusConsulta } from "@/interfaces/Consultas/StatusConsulta";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { cancelarConsulta } from "@/services/consultas/consultas-service";
import { useRouter } from "expo-router";
import MenuDropdownConsultas from "../MenuDropdown/MenuDropdownConsultas";
import { useMenuDropdown } from "../MenuDropdown/MenuDropdownProvider";
import { baseURL } from "@/utils/api";
import { format, parse, parseISO } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { Button, Dialog, Portal } from "react-native-paper";
import { Consultas } from "@/interfaces/Consultas/Consultas";
import { showMessage } from "react-native-flash-message";
import Constants from 'expo-constants';
const { WHATSAPP } = Constants.expoConfig?.extra ?? {};

const { width, height } = Dimensions.get('window');

export function CardConsultaMarcada(props: CardConsultaMarcadaPropriedades){
    const [tempoRestante, setTempoRestante] = useState('');
    const [diaConsulta, setDiaConsulta] = useState('');
    const [mesConsulta, setMesConsulta] = useState('');
    const [iconeConsulta, setIconeConsulta] = useState<IconDefinition>();
    const [statusConsulta, setStatusConsulta] = useState('');
    const [corStatusConsulta, setCorStatusConsulta] = useState('');
    const [corTextoStatusConsulta, setCorTextoStatusConsulta] = useState('');
    const [nomeConsulta, setNomeConsulta] = useState(props.item.tipoConsulta?.nome)
    const [inicio, setInicio] = useState(props.item.inicio.substring(0, 5))
    const [modalVisivel, setModalVisivel] = useState(false);
    const [loading, setLoading] = useState(false);
    const { openMenuDropdown, closeMenuDropdown, visible, isAdmin } = useMenuDropdown();
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [modalCancelar, setModalCancelar] = useState(false);

    const showDialog = () => setVisibleDialog(true);
    const hideDialog = () => setVisibleDialog(false);

    function pegaStatusConsulta(){
        if(props.item.status !== undefined){
            switch(props.item.status){
                case StatusConsulta.AGUARDANDO_CONFIRMACAO:
                    setIconeConsulta(faHourglass as IconDefinition)
                    setStatusConsulta('aguardando confirmação')
                    setCorTextoStatusConsulta('#a35818')
                    setCorStatusConsulta('#fcd34f')
                    break;
                case StatusConsulta.AGENDADA:
                    setIconeConsulta(faCalendar as IconDefinition)
                    setStatusConsulta('agendada')
                    setCorTextoStatusConsulta('#52819e')
                    setCorStatusConsulta('#e0f2fe')
                    break;
                case StatusConsulta.CONCLUIDA:
                    setIconeConsulta(faCircleCheck as IconDefinition)
                    setStatusConsulta('finalizada')
                    setCorTextoStatusConsulta('#59a98f')
                    setCorStatusConsulta('#6edeb6')
                    break;
                case StatusConsulta.CANCELADA:
                    setIconeConsulta(faCircleXmark as IconDefinition)
                    setStatusConsulta('cancelada')
                    setCorTextoStatusConsulta('#FFFFFF')
                    setCorStatusConsulta('#f17a7a')
                    break;
            }
        }
    }

    function pegaDataConsulta() {
        const data = new Date(props.item.data)
        const dia = data.getDate();
        const diaConsulta = dia.toString().length === 1 ? dia.toString().padStart(2, '0') : dia.toString();
        setDiaConsulta(diaConsulta);

        const ano = data.getFullYear();
        const mes = data.getMonth();
        let mesConsulta = new Date(ano, mes, dia).toLocaleDateString('pt-BR', {
            month: 'short'
        })
        setMesConsulta(mesConsulta.toUpperCase());
    }

    function calculaTempoRestante(){
        const agora: Date = new Date();
        const dataConsulta: Date = new Date(props.item.data)
        const diferenca = dataConsulta.getTime() - agora.getTime();

        if(diferenca <= 0){

        }

        const totalMin = Math.floor(diferenca / 1000 / 60);
        const dias = Math.floor(totalMin / 60 / 24);
        const horas = Math.floor((totalMin % (60 * 24)) / 60);
        const minutos = totalMin % 60;

        if(dias > 0) setTempoRestante(`Faltam ${dias} dias`);
        else if(horas > 0 && dias <= 0) setTempoRestante(`Faltam ${horas} horas`);
        else if(minutos > 0 && horas <= 0 && dias <= 0) setTempoRestante(`Faltam ${minutos} minutos`);
        else setTempoRestante(`Já ocorreu`);
    }

    async function handleCancelarConsulta(consultaId: number){
        try {
            setLoading(true);
            await cancelarConsulta(consultaId);
            setModalVisivel(false);
            props.recarregarConsultas(true);
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

    function enviarMensagemWhatsapp(){
        const mensagem = `Olá! 👋
        Gostaria de mais informações sobre minha consulta:

        📋 Consulta: ${props.item.tipoConsulta?.nome}
        🗓 Data: ${format(new Date(props.item.data), 'dd/MM/yyyy')}
        ⏰ Horário: ${format(parse(props.item.inicio, 'HH:mm:ss', new Date()), 'HH:mm')}
        👤 Nome: ${props.item.usuario?.primeiroNome} ${props.item.usuario?.ultimoNome}

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

    useEffect(() => {
        calculaTempoRestante()
        pegaDataConsulta();
        pegaStatusConsulta();
    }, [props.item])

    return (
        <>
            {
               loading ? (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color={'gray'}/>
                    </View>
                ) : (
                    <> 
                        <TouchableOpacity 
                            delayPressIn={50}
                            onPress={() => setModalVisivel(true)}
                            style={styles.topo}>
                            {
                                (props.item.status === StatusConsulta.CONCLUIDA || props.item.status === StatusConsulta.CANCELADA) && <FontAwesomeIcon style={styles.icone} icon={iconeConsulta !== undefined ? iconeConsulta : faCircleCheck } size={24} color={corStatusConsulta}/>
                            }
                            <View style={styles.informacao}>
                                <View style={styles.informacaoConteudo}>
                                    <Text style={styles.titulo}> {nomeConsulta} </Text>
                                    <Text style={styles.texto}> Sua consulta de {nomeConsulta} está <Text style={{ fontWeight: 'bold' }}> {statusConsulta}. </Text> </Text>
                                </View>
                            </View>
                            <View style={styles.detalhes}>
                                <View style={[
                                    styles.detalhesConteudo,
                                    { backgroundColor: corStatusConsulta }
                                ]}>
                                    <Text style={{
                                        color: corTextoStatusConsulta,
                                        fontSize: width < 400 ? 10 : 12
                                    }}> {
                                        props.item.status === StatusConsulta.CANCELADA 
                                            ? 'Cancelada'
                                            : props.item.status === StatusConsulta.CONCLUIDA 
                                                ? 'Concluída'
                                                : props.item.status === StatusConsulta.AGENDADA 
                                                    ? 'Confirmada'
                                                    : props.item.status === StatusConsulta.AGUARDANDO_CONFIRMACAO 
                                                        ? 'Pendente'
                                                        : ''
                                    } </Text>
                                </View>
                                <View style={styles.data}>
                                    <Text numberOfLines={width < 400 ? 2 : 1} style={{ fontWeight: 'light', fontSize: 12, maxWidth: 100 }}> { props.item.status === StatusConsulta.CANCELADA ? "-" : props.item.status === StatusConsulta.CONCLUIDA ? "Finalizada" : `${tempoRestante}`} </Text>
                                </View>
                                <View style={{ marginLeft: 'auto', marginTop: 8 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize:  width < 400 ? 10 : 14, color: '#2a303b' }}> R$ { props.item.valor } </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {
                            (isAdmin && props.item.status !== StatusConsulta.CONCLUIDA && props.item.status !== StatusConsulta.CANCELADA) && <View style={styles.botaoEdicao}>
                                            <MenuDropdownConsultas status={props.item.status} consultaId={props.item.id} recarregarConsultas={() => props.recarregarConsultas(true)} atualizarConsultas={props.atualizarConsultas}/>
                                        </View>
                        }
                        <Modal
                            animationType="slide"
                            visible={modalVisivel}
                            onRequestClose={() => setModalVisivel(false)}>
                                <ScrollView contentContainerStyle={styles.modalContent}>
                                    <View style={styles.closeArrow}>
                                        <TouchableOpacity 
                                            onPress={() => setModalVisivel(false)}
                                            style={[
                                                styles.botaoFecharModal,
                                                { backgroundColor: 'transparent' }
                                            ]}
                                        >
                                            <FontAwesomeIcon icon={faArrowLeft} size={24} />
                                        </TouchableOpacity>
                                        <Text style={{ marginTop: 8, marginHorizontal: 'auto', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}> {props.item.tipoConsulta?.nome } </Text>
                                    </View>
                                    <Image 
                                        style={styles.fundo}
                                        source={{ uri: props.item.tipoConsulta?.uriImagem ? props.item.tipoConsulta?.uriImagem : `${baseURL}/imagens/sem_imagem.png` }}
                                    />
                                    <View style={styles.agrupamentoInformacoes}>
                                        <Text style={styles.infoTitulo}>
                                            Endereço da Consulta
                                        </Text>
                                        <Text> Rua Fulano de Tal, 111, Cidade Imaginaria. </Text>
                                    </View>
                                    <View style={styles.agrupamentoInformacoes}>
                                        <Text style={styles.infoTitulo}>
                                            Bairro
                                        </Text>
                                        <Text> John doe </Text>
                                    </View>
                                    <View style={styles.agrupamentoInformacoes}>
                                        <Text style={styles.infoTitulo}>
                                            Valor da Consulta - R$
                                        </Text>
                                        <Text> {props.item.valor} Reais </Text>
                                    </View>
                                    <View style={styles.agrupamentoInformacoes}>
                                        <Text style={styles.infoTitulo}>
                                            Data e Hora
                                        </Text>
                                        <Text> {format(props.item.data, "dd/MM/yyyy", { locale: ptBR })} Das {format(parse(props.item.inicio, "HH:mm:ss", new Date()), "HH:mm")} até {format(parse(props.item.fim, "HH:mm:ss", new Date()), "HH:mm")} </Text>
                                    </View>
                                    {
                                        isAdmin && <View style={styles.agrupamentoInformacoes}>
                                                        <Text style={styles.infoTitulo}>
                                                            Cliente
                                                        </Text>
                                                        <Text> {props.item.usuario?.primeiroNome} </Text>
                                                    </View>
                                    }
                                    {
                                        isAdmin && <View style={styles.agrupamentoInformacoes}>
                                                        <Text style={styles.infoTitulo}>
                                                            Telefone do Cliente
                                                        </Text>
                                                        <Text> {props.item.usuario?.telefone} </Text>
                                                    </View>
                                    }
                                    <View style={{ flexDirection: 'column', flex: 1, marginTop: 'auto' }}>
                                        {   
                                            (props.item.status !== StatusConsulta.CONCLUIDA) && 
                                            (
                                                <TouchableOpacity onPress={() => enviarMensagemWhatsapp()} style={[
                                                    styles.botaoModal,
                                                    { backgroundColor: '#25D366' }
                                                ]}>
                                                    <FontAwesome name="whatsapp" size={20} color="white"/>
                                                    { width > 350 && <Text style={[ styles.textoBotaoModal , { color: '#FFF'}]}> Enviar Mensagem via Whatsapp </Text>}
                                                </TouchableOpacity>
                                            )
                                        }
                                        {
                                            (props.item.status !== StatusConsulta.CONCLUIDA && props.item.status !== StatusConsulta.CANCELADA) && 
                                            (
                                                <>
                                                    <TouchableOpacity onPress={() => setModalCancelar(true)}
                                                    style={[
                                                        styles.botaoModal,
                                                        styles.botaoCancelar,
                                                        { backgroundColor: 'transparent' }
                                                    ]}>
                                                        <FontAwesome name="close" size={20} color="white"/>
                                                        { width > 350 && <Text style={[styles.textoBotaoModal, { color: '#8a909b'}]}> Cancelar Consulta </Text>}
                                                    </TouchableOpacity>
                                                    <Modal
                                                        animationType="slide"
                                                        visible={modalCancelar}
                                                        onRequestClose={() => setModalCancelar(false)}
                                                    >
                                                        {
                                                            loading ? (
                                                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                                                    <ActivityIndicator size="large" color={'#b89415'}/>
                                                                </View>
                                                            ) : (
                                                                <View style={styles.modalOverlay}>
                                                                    <View style={styles.modalContentCancelar}>
                                                                        <View style={styles.informacoesModal}>
                                                                            <View style={styles.circulo}>
                                                                                <FontAwesomeIcon icon={faExclamation} size={32} color="#b89415"/>
                                                                            </View>
                                                                            <Text style={{ fontSize: width < 400 ? 16 : 20,  fontWeight: 'bold', textAlign: 'center', marginTop: 8, color: '#212733' }}> Deseja Prosseguir com o Cancelamento? </Text>
                                                                            <Text style={{ textAlign: 'center', marginTop: 16, color: '#5c6471', fontSize: width < 400 ? 12 : 14 }}>Você está prestes a cancelar sua consulta. Deseja continuar?</Text>
                                                                        </View>
                                                                        <View style={styles.modalBotoes}>
                                                                            <View style={styles.botaoWrapper}>
                                                                                <TouchableOpacity style={{ padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#a4a9b0', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => setModalCancelar(false)}>
                                                                                    <Text style={{ color: '#1a202c', fontWeight: 'bold', fontSize: width < 400 ? 12 : 14}}> Voltar </Text>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                            <View style={styles.botaoWrapper}>
                                                                                <TouchableOpacity style={{ backgroundColor: '#b89415', padding: 8, borderRadius: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => handleCancelarConsulta(props.item.id) }>
                                                                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: width < 400 ? 12 : 14 }}> Continuar </Text>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            )
                                                        }
                                                    </Modal>
                                                </>
                                            )
                                        }
                                    </View>
                                </ScrollView>
                        </Modal>
                    </>
                )
            }
        </>
    );
}

const styles = StyleSheet.create({
    icone: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    topo: {
        // height: 120,
        padding: 16,
        backgroundColor: "#fdfdfd",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#cecfcfff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 32,
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    },

    informacao: {
        flexDirection: 'row',
        gap: 10,
    },

    informacaoConteudo: {
        width: 200,
        marginRight: 10
    },

    data: {
        marginTop: 8,
    },

    detalhes: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
        borderColor: '#e3e3e3',
        borderTopWidth: 1,
    },

    detalhesConteudo: {
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        maxWidth: width < 400 ? 80 : 100,
        borderRadius: 50,
        width: '100%',
        padding: width < 400 ? 2 : 4,
        marginTop: 8,
        overflow: 'hidden'
    },
    informacaoDetalhesConteudo: { 
        fontWeight: 'light', 
    },

    titulo: {
        fontSize: width < 400 ? 12 : 16,
        fontWeight: 'bold'
    },

    texto: {
        fontSize:  width < 400 ? 10 : 12,
        flexWrap: 'wrap'
    },

    modalContent: {
        flexGrow: 1,
        backgroundColor: 'white',
        padding: 16,
        paddingBottom: 200,
        zIndex: 1
    },

    botaoModal: {
        marginTop: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 50,
    },

    botaoCancelar: {
        borderWidth: 0.5,
        borderColor: '#8a909b'
    },

    textoBotaoModal: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
        textAlign: 'center',
        marginLeft: 4,
    },

    botaoFecharModal: {
        // marginRight: 'auto'
    },

    botaoEdicao: {
        width: 30,
        height: 30,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        boxShadow: '1 1 5 #000000AA',
        zIndex: 999999,
        position: 'absolute',
        bottom: 15,
        right: 10
    },

    fundo: {
        height: "30%",
        marginTop: 16,
        marginHorizontal: -16
    },

    infoTitulo: {
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#8f949f'
    },

    agrupamentoInformacoes: {
        marginTop: 16,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },

    cartaoUsuario: {
        backgroundColor: '#ffffff6b'
    },

    closeArrow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // fundo escuro semi-transparente
        justifyContent: 'center',
        alignItems: 'center'
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

    modalContentCancelar: {
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
})