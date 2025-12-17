import { baseURL } from "@/utils/api";
import { useLocalSearchParams } from "expo-router";
import { ImageBackground, StyleSheet, Text, View, Animated, TouchableOpacity, Linking } from "react-native";
import { showMessage } from "react-native-flash-message";
import Constants from 'expo-constants';
const { WHATSAPP } = Constants.expoConfig?.extra ?? {};

export default function ProdutoPagina(){
    const { descricao, nome, uri_imagem } = useLocalSearchParams();

    function enviarMensagemWhatsapp(){
        const mensagem = `
        Olá! 👋 
          Vi o ${nome} e me interessei bastante.  
          Poderia me passar mais informações sobre ele? 😊
        `
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

    return(
        <View style={styles.topo}>
            <ImageBackground 
                style={styles.fundo}
                source={{
                    uri: uri_imagem ? `${uri_imagem}` : `${baseURL}/imagens/sem_imagem.png`,
                }}
            />

            <View style={styles.conteudo}>
                <View>
                    <View style={styles.detalhe}></View>
                    <Text style={styles.titulo}> 
                        { nome }
                    </Text>
                    <Text style={styles.texto}> 
                        { descricao }
                    </Text>
                </View>

                <TouchableOpacity style={styles.botao} onPress={() => enviarMensagemWhatsapp()}>
                    <Text style={styles.textoBotao}> Enviar Mensagem </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topo: {
        flex: 1
    },

    fundo: {
        flex: 1
    },

    conteudo: {
        position: 'absolute',
        bottom: 0,
        height: 220,
        padding: 16,
        width: "100%",
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'space-between',
        gap: 10,
        backgroundColor: '#f2f0ee',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    detalhe: {
        width: 50,
        height: 10,
        alignSelf: 'center',
        backgroundColor: '#d1d5db',
        borderRadius: 50,
    },

    texto: {
        marginTop: 4,
        textAlign: 'center',
        fontSize: 16,
        color: '#8c9198'
    },

    titulo: {
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        color: '#202531'
    },

    botao: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        backgroundColor: '#b89415',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textoBotao: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16
    }
})