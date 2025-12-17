import Botao from "@/components/Botao/Botao";
import { CustomCheckbox } from "@/components/CustomCheckbox/CustomCheckbox";
import { HorariosIndisponiveis } from "@/interfaces/Consultas/HorariosIndisponiveis";
import { buscarHorariosIndisponiveis, editarHorariosIndisponiveis } from "@/services/consultas/consultas-service";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { isAxiosError } from "axios";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import { showMessage } from "react-native-flash-message";
import { MaskedTextInput } from "react-native-mask-text";
import { Checkbox, HelperText, TextInput } from "react-native-paper";

export default function HorariosIndisponiveisPagina(){
    const navegador = useRouter();
    const { tipoConsultaId, data } = useLocalSearchParams();
    const [horariosIndisponiveis, setHorariosIndisponiveis] = useState<HorariosIndisponiveis[]>([]);
    const [loading, setLoading] = useState(false);

    function voltarPagina(){
        navegador.back();
    }

    async function carregarHorariosIndisponivies() {
        try {
            setLoading(true)
            const response = await buscarHorariosIndisponiveis(Number(tipoConsultaId), data as string).then(res => res.data);
            setHorariosIndisponiveis(response);
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

    async function onSubmitEditarHorariosIndisponiveis(){
        try {
            setLoading(true)
            const response = await editarHorariosIndisponiveis(horariosIndisponiveis).then(res => res.data);
            if(response){
                showMessage({
                    message: "Horários Indisponíveis editados com sucesso!",
                    type: "success"
                })
            }
            navegador.back();
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
    
    function alterarEstadoHorario(horarioIndisponivel: HorariosIndisponiveis){
        const novosHorarios: HorariosIndisponiveis[] = horariosIndisponiveis.map(item => {
            return item.id === horarioIndisponivel.id ? {...horarioIndisponivel, ativo: !horarioIndisponivel.ativo } : item
        })

        setHorariosIndisponiveis(novosHorarios);
    }

    useEffect(() => {
        carregarHorariosIndisponivies();
    }, [])

    return (
        <>
            <Stack.Screen options={{ headerTitle: "Horários Indisponíveis", headerTransparent: false, headerTitleAlign: 'center', headerBackVisible: true }} />
            {
                loading ? (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color={'gray'}/>
                    </View>
                ) : (
                    <View style={styles.topo}>
                        {
                            horariosIndisponiveis && horariosIndisponiveis.map(horarioIndisponivel => {
                                return (
                                    <View key={horarioIndisponivel.id} style={styles.agrupamentoInput}>
                                        <TextInput
                                            keyboardType="numeric"
                                            readOnly={true}
                                            mode="outlined"
                                            style={styles.input}
                                            activeOutlineColor="#b89415"
                                            value={horarioIndisponivel.inicio}
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
                                                    mask="99:99" // DD/MM/YYYY
                                                    onChangeText={() => {}}
                                                />
                                            )}
                                            right={<TextInput.Icon icon={() => (
                                                <FontAwesomeIcon icon={faCalendar} size={14} color="gray"/>
                                            )}/>}
                                        />

                                        <TextInput
                                            keyboardType="numeric"
                                            readOnly={true}
                                            mode="outlined"
                                            style={styles.input}
                                            activeOutlineColor="#b89415"
                                            value={horarioIndisponivel.fim}
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
                                                    mask="99:99" // DD/MM/YYYY
                                                    onChangeText={() => {}}
                                                />
                                            )}
                                            right={<TextInput.Icon icon={() => (
                                                <FontAwesomeIcon icon={faCalendar} size={14} color="gray"/>
                                            )}/>}
                                        />
                                        <CustomCheckbox checked={horarioIndisponivel.ativo === true ? true : false} onPress={() => alterarEstadoHorario(horarioIndisponivel) }/>
                                    </View>
                                )
                            })
                        }
                        <View style={{ flexDirection: 'column', gap: 10, marginTop: 'auto', paddingTop: 32 }}>
                            <View>
                                <TouchableOpacity  onPress={() => onSubmitEditarHorariosIndisponiveis()} style={{ backgroundColor: '#b89415', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{!tipoConsultaId ? "Cadastrar" : "Editar"}</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => voltarPagina()} style={{ backgroundColor: '#e5e7eb', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#56606d', fontWeight: 'bold' }}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            }
        </>
    );
}

const styles = StyleSheet.create({
    topo: {
        paddingTop: 16,
        paddingHorizontal: 32,
        backgroundColor: '#f8fafc'
    },

    titulo: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center'
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
    },

    agrupamentoInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 30,
    },

    input: {
        flexGrow: 0.85,
        flexShrink: 1,
        backgroundColor: 'transparent',
        marginTop: 10,
    },
});