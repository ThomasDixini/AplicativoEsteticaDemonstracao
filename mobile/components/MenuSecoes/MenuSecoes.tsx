import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MenuSecoesTipo, Secoes } from "./types/MenuSecoes";

export default function MenuSecoes(props: MenuSecoesTipo) {
    const [selecionado, setSelecionado] = useState<number | null>(0)

    return (
        <ScrollView
            style={styles.secoes}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
        >
            {
                props.secoes.map((item, index) => {
                    return (
                        <TouchableOpacity 
                            key={index} 
                            style={[
                                styles.secoesBotao,
                                selecionado === item.id && styles.secoesBotaoSelecionado,
                                index === 0 && { marginLeft: 42 },
                                index === props.secoes.length - 1 && { marginRight: 172 }
                            ]}
                            onPress={() => {
                                if(selecionado !== item.id) {
                                    setSelecionado(item.id)
                                    props.enviarSecoesFiltradas(item.id);

                                } else {
                                    props.enviarSecoesFiltradas(null, true);
                                    setSelecionado(null)
                                }; 
                            }}
                        >
                            <View style={styles.content}>
                                <Text style={[
                                    styles.secoesBotaoTexto,
                                    selecionado === item.id && { color: '#b89415' }
                                ]}>{item.secao}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'column',
        alignItems: 'center',
    },

    circulo: {
        width: 8,
        height: 8,
        backgroundColor: 'orange',
        borderRadius: 50
    },

    secoes: {
        marginLeft: -32,
        marginRight: -32,
        marginTop: 8,
        paddingRight: 60,
        paddingVertical: 10,
        flexShrink: 1
    },

    secoesBotaoTexto: {
        color: 'gray',
    },

    secoesBotao: {
        height: 40,
        marginLeft: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e8eaee',
        borderRadius: 50,
    },

    secoesBotaoSelecionado: {
        backgroundColor: '#fdf5d6ff',
        borderColor: 'transparent'
    }
})