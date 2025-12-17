import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HorarioBotaoPropriedades } from "./types/HorarioBotaoPropriedades";

export default function HorarioBotao(props: HorarioBotaoPropriedades){
    
    const horarioReservado = (props.horario.tipoConsultaHorarios !== null && props.horario.tipoConsultaHorarios.length > 0) 
                                ? props.horario.tipoConsultaHorarios[0].reservado : false;
    return(
        <TouchableOpacity style={[
            styles.topo,
            props.horario.id === props.idHorarioSelecionado && styles.horarioSelecionado,
            horarioReservado && styles.horarioReservadoEstilo,
        ]} disabled={horarioReservado} onPress={() => props.setarHorarioSelecionado(props.horario)}>
            <Text style={{ textAlign: 'center', color: props.horario.id === props.idHorarioSelecionado ? '#FFFFFF' : '#b89415' }}> {props.horario.inicio.substring(0, 5)} </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    topo: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#b89415',
        width: '100%',
    },

    horarioReservadoEstilo: {
        backgroundColor: '#b89415',
        color :'white'
    },

    horarioSelecionado: {
        backgroundColor: '#b89415',
        color: '#FFFFFF',
        elevation: 2,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    }
})