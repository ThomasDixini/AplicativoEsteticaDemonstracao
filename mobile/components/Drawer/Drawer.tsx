import { useEffect, useState } from "react";
import { Animated, Dimensions, Linking, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Drawer, MD3LightTheme, Portal, Text } from "react-native-paper";
import { useDrawer } from "./DrawerProvider";
import * as SecureStore from 'expo-secure-store'
import { usePathname, useRouter } from "expo-router";
import { buscarUsuarioLogado } from "@/services/usuarios/usuario-service";
import { isAxiosError } from "axios";
import { Usuarios } from "@/interfaces/Usuarios/Usuarios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDoorOpen, faLocation, faLocationDot, faLocationPin, faLocationPinLock, faLongArrowAltUp, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { showMessage } from "react-native-flash-message";
import Constants from 'expo-constants';
import { FontAwesome } from "@expo/vector-icons";
const { INSTAGRAM_URL, FACEBOOK_URL } = Constants.expoConfig?.extra ?? {};


export default function DrawerComponent() {
    const [active, setActive] = useState('home');
    const { visible, translateX, closeDrawer, openDrawer } = useDrawer();
    const navegador = useRouter();
    const path = usePathname();
    const [usuario, setUsuario] = useState<Usuarios>();

    async function logout(){
        Platform.OS === 'android' 
            ? await SecureStore.deleteItemAsync("token")
            : localStorage.removeItem("token");

        Platform.OS === 'android'
            ? await SecureStore.deleteItemAsync("usuarioId")
            : localStorage.removeItem("usuarioId");

        navegador.replace("/(auth)/auth");
    }

    async function buscarUsuario(){
        try {
            var usuarioIdString = Platform.OS === 'android' 
                ? await SecureStore.getItemAsync('usuarioId')
                : localStorage.getItem('usuarioId');

            var usuarioId = Number(usuarioIdString);
            if(usuarioId){
                var usuario = await buscarUsuarioLogado().then(res => res.data);
                setUsuario(usuario);
            }
        } catch(error){
            if (isAxiosError(error)) {
                console.error("⚠️ Axios error.code:", error.code);
                console.error("⚠️ Axios error.message:", error.message);
                console.error("⚠️ Axios error.request:", error.request);
                console.error("⚠️ Axios error.response:", error.response);
            } else {
                console.error("❌ Erro desconhecido:", error);
            }

            throw error;
        }
    }

    function navegarParaDadosUsuario(){
        if(!path.includes('usuarios'))
        {
            navegador.push('/usuarios')
        }
    }
    function navegarParaInicio(){
        if(!(path === "/"))
        {
            navegador.back();
        }
    }

    useEffect(() => {
        buscarUsuario()
    }, [])

    return (
        <View style={style.topo}>
            <Portal>
                {
                    visible && (
                        <TouchableOpacity style={style.overlay} activeOpacity={1} onPress={closeDrawer}>
                            <Animated.View style={[style.drawer, { transform: [{ translateX }] }]}>
                                <View style={style.drawerContent}>
                                    <Drawer.Section title={usuario ? usuario?.primeiroNome : 'Bem vindo!'} theme={{ fonts: { headlineMedium: { fontWeight: 'bold', fontSize: 14 } }}} showDivider={false} >
                                        <Drawer.Item
                                            style={{ borderTopWidth: 1, borderTopColor: '#ebecef', borderRadius: 0 }}
                                            icon={({ size, color }) => (
                                                <FontAwesomeIcon icon={faUser} size={18} color={color} />
                                            )}
                                            label="Meu Perfil"
                                            theme={{ colors: { onSurfaceVariant: '#4a4e58' }}}
                                            active={false}
                                            onPress={() => {
                                                navegarParaDadosUsuario();
                                                closeDrawer();
                                            }}
                                        />
                                    </Drawer.Section>
                                    
                                    <Drawer.Section style={style.bottomSection} showDivider={false}>
                                        <Drawer.Item
                                            style={style.drawerItemContato}
                                            label="Fulano de tal, 111"
                                            theme={{ 
                                                colors: { 
                                                    onSurfaceVariant: '#4a4e58' 
                                                }, 
                                            }}
                                            icon={({ size, color }) => (
                                                <FontAwesomeIcon icon={faLocationDot} size={size} color={color} />
                                            )}
                                            active={false}
                                            onPress={() => {
                                                // setActive('/consultas');
                                                // closeDrawer();
                                            }}
                                        />
                                        <Drawer.Item
                                            style={style.drawerItemContato}
                                            label="(35) 99246-8053"
                                            theme={{ colors: { onSurfaceVariant: '#4a4e58' }}}
                                            icon={({ size, color }) => (
                                                <FontAwesomeIcon icon={faPhone} size={20} color={color} />
                                            )}
                                            active={false}
                                            onPress={() => {
                                                // setActive('/consultas');
                                                // closeDrawer();
                                            }}
                                        />
                                        <Drawer.Item
                                            style={style.drawerItemContato}
                                            label="Instagram"
                                            theme={{ colors: { onSurfaceVariant: '#4a4e58' }}}
                                            icon={({ size, color}) => (
                                                <FontAwesomeIcon icon={faInstagram} size={20} color={color}/>
                                            )}
                                            active={false}
                                            onPress={() => {
                                                const url = INSTAGRAM_URL!;
                                                Linking.canOpenURL(url).then((suported) => {
                                                    if(suported){
                                                        return Linking.openURL(url);
                                                    } else {
                                                        showMessage({
                                                            message: 'Não foi possível acessar o Instagram.',
                                                            type: 'warning'
                                                        })
                                                    }
                                                })
                                                closeDrawer();
                                            }}
                                        />
                                        <Drawer.Item
                                            style={style.drawerItemContato}
                                            label="Facebook"
                                            theme={{ colors: { onSurfaceVariant: '#4a4e58' }}}
                                            icon={({ size, color }) => (
                                                <FontAwesomeIcon icon={faFacebook} size={20} color={color}/>
                                            )}
                                            active={false}
                                            onPress={() => {
                                                const url = FACEBOOK_URL!;
                                                Linking.canOpenURL(url).then((suported) => {
                                                    if(suported){
                                                        return Linking.openURL(url);
                                                    } else {
                                                        showMessage({
                                                            message: 'Não foi possível acessar o Instagram.',
                                                            type: 'warning'
                                                        })
                                                    }
                                                })
                                                closeDrawer();
                                                closeDrawer();
                                            }}
                                        />
                                        <Drawer.Item
                                            style={style.botaoLogout}
                                            label="Logout"
                                            theme={{ colors: { onSurfaceVariant: "white" } }}
                                            icon={() => (
                                                    <FontAwesomeIcon icon={faDoorOpen} size={18} color="white"/>
                                                )
                                            }
                                            onPress={() => {
                                                logout();
                                                closeDrawer();
                                            }}
                                        />
                                    </Drawer.Section>
                                </View>
                            </Animated.View>
                        </TouchableOpacity>
                    )
                }
            </Portal>
        </View>
    )
}

const style = StyleSheet.create({
    topo: {
        
    },
    button: { 
        backgroundColor: '#6200ee', 
        padding: 10, 
        borderRadius: 5 
    },
    buttonText: { 
        color: 'white', 
        textAlign: 'center' 
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 250,
        backgroundColor: '#fff',
        paddingTop: 40,
        elevation: 5,
    },
    drawerContent: {
        flex: 1,
    },
    bottomSection: {
        borderTopWidth: 1,
        borderTopColor: "#ebecef",
        marginTop: 'auto',
    },
    drawerItemContato: {
        fontSize: 8,
        height: 50,
        paddingVertical: 8,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left',
        marginTop: 4,
    },

    botaoLogout: {
        backgroundColor: '#b89415',
        marginVertical: 32,
        marginHorizontal: 'auto',
        borderRadius: 8,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
    }
});