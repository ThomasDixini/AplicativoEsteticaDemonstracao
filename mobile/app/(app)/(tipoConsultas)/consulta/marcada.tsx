import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { usePathname, useRouter } from "expo-router";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import { useNavigationState } from "@react-navigation/native";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get('window')

export default function ConsultaMarcadaPagina(){
    const navegador = useRouter();

    const navegar = () => {
        navegador.dismissAll();
        navegador.replace("/");
    }

    return (
        <View style={styles.topo}>
            <View style={styles.conteudo}>
                <View style={{ marginTop: 16, width: width < 400 ? 60 : 80, height: width < 400 ? 60 : 80, backgroundColor: '#fdf5d6ff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                    <FontAwesomeIcon icon={faCheck} size={ width < 400 ? 24 : 32} color={'#b89415'} />
                </View>
                <Text style={{ fontSize: width < 400 ? 16 : 20, fontWeight: 'bold', textAlign: 'center', marginTop: 8, color: '#212733' }}> Consulta Agendada com Sucesso! </Text>
                <Text style={styles.texto}>O agendamento da sua consulta foi realizado com sucesso. Em breve, você será notificado quanto à confirmação. Agradeço pela confiança.</Text>
                <View style={styles.botao}>
                    <Button color={'#b89415'} title="OK!" onPress={() => navegar() } /> 
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    topo: {
        flex: 1,
        backgroundColor: '#848993',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32
    },

    conteudo: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        height: width < 400 ? '70%' : '60%'
    },

    texto: {
        textAlign: 'center',
        color: '#58616e',
        marginTop: 8,
        fontSize: width < 400 ? 12 : 16
    },

    botao: {
        marginTop: 32,
        width: '80%'
    }
})