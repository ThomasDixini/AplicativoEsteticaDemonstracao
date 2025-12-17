import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DataBotaoPropriedades } from "./types/DataBotaoPropriedades";

export default function DataBotao(props: DataBotaoPropriedades){
    return(
        <TouchableOpacity onPress={() => props.setarDiaSelecionado({
            id: props.id,
            data: props.data
        })} style={[
            styles.dataBotao,
            props.id === props.diaSelecionado.id && styles.dataBotaoSelecionado
        ]}>
            <Text style={styles.textoNumero}>{props.numeroDia}</Text>
            <Text style={styles.textoDia}>{props.dia}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    dataBotao: {
        backgroundColor: '#FFB48B40',
        paddingVertical: 16,
        paddingHorizontal: 32,
        marginLeft: 16,
        maxWidth: 140,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#C5886740'
    },

    dataBotaoSelecionado: {
        backgroundColor: '#FFB48B',
        borderColor: '#C58867'
    },

    textoNumero: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFFF1'
    },

    textoDia: {
        fontSize: 18,  
        color: '#FFFFFF'
    }
})