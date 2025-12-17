import Botao from "@/components/Botao/Botao";
import { Image, StyleSheet, View } from "react-native";

export default function InicialPagina() {
    return (
        <View style={styles.topo}>
            <Image 
                style={styles.imagem}
                source={require('../../assets/images/sem_imagem.png')}
                resizeMode="contain"
            />
            <Botao texto="Login" rota={"/(auth)/login"}/>
            <Botao variante={true} texto="Registrar" rota={"/(auth)/registrar"}/>
        </View>
    );
}


const styles = StyleSheet.create({
    topo: {
        flex: 1,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc'
    },

    imagem: {
        width: '100%',
        height: 200,
        padding: 16,
        marginBottom: 100
    }
})