import { Dimensions, Image, Pressable, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { RelativePathString, usePathname, useRouter } from "expo-router";
import { Card } from "./types/Card";
import { baseURL } from "@/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRight, faCalendarDays, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useMenuDropdown } from "../MenuDropdown/MenuDropdownProvider";
import MenuDropdown from "../MenuDropdown/MenuDropdown";
import { Dispatch, SetStateAction, useState } from "react";

interface CardProps {
    preencher: boolean,
    card: Card;
    recarregarItens?: () => Promise<void>;
    tipo: string;
}

const { width, height } = Dimensions.get('window')

export default function CardComponente(props: CardProps) {
    const navegador = useRouter();
    const path = usePathname();
    const { openMenuDropdown, closeMenuDropdown, visible, isAdmin } = useMenuDropdown();
    
    function navegar(){
        if(path.includes("tipoProdutos")){
            navegador.push({
                pathname: `/produtos/${props.card.id}` as RelativePathString,
                params: {
                    descricao: props.card.descricao,
                    nome: props.card.nome,
                    uri_imagem: props.card.uriImagem
                }
            })
        } else if(path.includes("consulta")) {
            navegador.push({
                pathname: `/consulta/${props.card.id}` as RelativePathString,
                params: {
                    uri_imagem: props.card.uriImagem
                }
            })
        }
    }

    return (
        <>
            <View style={[
                styles.topo,
                props.card.ativo === false && styles.inativado
            ]}>
                <View style={[
                    styles.conteudo,
                ]}>
                    <Text style={styles.titulo} numberOfLines={2} ellipsizeMode="tail">{props.card.nome} </Text>
                    <Text style={styles.textoCorpo} numberOfLines={2} ellipsizeMode="tail">{props.card.descricao} </Text>
                    <Pressable hitSlop={200} onPress={() => navegar() } style={{ 
                        position: 'absolute',
                        bottom: 16,
                        marginTop: 'auto', 
                        marginHorizontal: width < 350 ? 'auto' : 0 
                    }}>
                        <View style={styles.agendamento}>
                            {
                                width > 350 && <Text style={styles.textoAgendamento}>
                                                    Agendar
                                                </Text>
                            }
                            <FontAwesomeIcon icon={faArrowRight} color="#b89415" size={ width < 350 ? 24 : 16}/>
                        </View>
                    </Pressable>
                </View>
                {
                    isAdmin && <View style={styles.botaoEdicao}>
                                    <MenuDropdown ativo={props.card.ativo} itemId={props.card.id} tipo={props.tipo} recarregarItens={props.recarregarItens}/>
                                </View>
                }
                <Image
                    style={[
                        styles.imagem,
                    ]}
                    source={{ uri: props.card.uriImagem ? `${props.card.uriImagem}` : `${baseURL}/imagens/sem_imagem.png`}}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    topo: {
        position: 'relative',
        height: 180,
        paddingLeft: 16,
        paddingVertical: 8,
        marginTop: 32,
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        backgroundColor: "#FFFFFF",
        overflow: 'visible',
        borderRadius: 8,
        elevation: 4,
        shadowOffset: { width: -1, height: 2 },
        shadowColor: '#535353ff',
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },
    conteudo: {
        flexWrap: 'wrap',
        alignSelf: 'flex-start',
        flex: 1,
        height: '100%',
        position: 'relative'
    },

    imagem: {
        width: width < 350 ? 100 : 120,
        position: 'relative',
        height: 180,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8
    },

    titulo: {
        fontWeight: "700",
        fontSize: width < 350 ? 16 : 20,
        flexWrap: 'wrap',
        width: 200,
        padding: 0,
        margin: 0,
        textAlign: 'left',
        color: '#202a38'
    },

    textoCorpo: {
        width: '100%',
        flexWrap: 'wrap',
        fontWeight: "400",
        fontSize: width < 350 ? 12 : 14,
        color: '#535c6a',
        marginTop: 8
    },

    textoAgendamento: { 
        color: '#b89415', 
        fontWeight: 'bold',
    },

    agendamento: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    }
,
    botaoContainer: {
        position: "absolute",
        right: 0,
        bottom: 0,
        width: 100,
        height: 100,
        backgroundColor: "transparent",
        borderTopLeftRadius: 10
    },

    bottaoTop: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 20,
        height: 60,
        backgroundColor: "#FFFFFF",
        borderBottomRightRadius: 10,
        zIndex: 2,
        borderTopRightRadius: 8,
    },
    botaoMeio: {
        position: "absolute",
        right: 0,
        bottom: 0,
        width: 60,
        height: 60,
        backgroundColor: "#F1F1F1",
        borderTopLeftRadius: 40,
        zIndex: 0
    },
    botaoMeioTop: {
        position: "absolute",
        right: 0,
        bottom: 0,
        width: 20,
        height: 70,
        backgroundColor: "#F1F1F1",
        borderTopLeftRadius: 10,
        zIndex: 1
    },
    botaoMeioEsquerda: {
        position: "absolute",
        right: 0,
        bottom: 0,
        width: 70,
        height: 20,
        backgroundColor: "#F1F1F1",
        borderTopLeftRadius: 10,
        zIndex: 1
    },
    botaoContainerEsquerda: {
        position: "absolute",
        bottom: 0,
        right: 60,
        width: 60,
        height: 20,
        backgroundColor: "#FFFFFF",
        borderBottomRightRadius: 10,
        zIndex: 2
    },

    botao: {
        position: "absolute",
        right: 5,
        bottom: 5,
        backgroundColor: "#DCB368",
        borderRadius: 50,
        width: 45,
        height: 45,
        color: "white",
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        overflow: 'hidden',
        elevation: 5,
        zIndex: 9999
    },

    botaoEdicao: {
        position: 'absolute',
        left: -10,
        top: -10,
        width: 30,
        height: 30,
        borderRadius: 50,
        zIndex: 999999,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '2 2 5 #000000AA',
        backgroundColor: '#FFFFFF'
    },

    inativado: {
        opacity: 0.5
    }
})