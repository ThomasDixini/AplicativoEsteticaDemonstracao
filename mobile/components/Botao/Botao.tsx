import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { BotaoPropriedades } from "./types/BotaoPropriedades";
import { Href, useRouter } from "expo-router";

export default function Botao({ variante = false, texto, redirect, rota, login, registrar }: BotaoPropriedades) {
    const navegador = useRouter();

    function navegar(rota: Href){
        if(rota){
            navegador.push(rota);
        } else {
            navegador.back();
        }
    }
    return(
        <TouchableOpacity onPress={() => {
            (rota !== null && rota !== undefined && redirect !== true) ? navegar(rota) : (rota !== null && rota !== undefined && redirect === true) ? navegar(rota) : null;
            login !== null && login !== undefined ? login() : null
            registrar !== null && registrar !== undefined ? registrar() : null
        }} style={[
            styles.botao,
            variante && {
                backgroundColor: '#f0f3f4',
            }
        ]}>
            <Text style={[
                styles.texto,
                variante && {
                    color: '#383d3f'
                }
            ]}>
                {texto}
            </Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    botao: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        backgroundColor: '#b89415',
        elevation: 4,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },

    texto: {
        fontWeight: 'bold',
        color: 'white'
    }
})