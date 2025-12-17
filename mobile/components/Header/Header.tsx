import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Image } from "react-native";
import { useDrawer } from "../Drawer/DrawerProvider";
import { useNavigation, usePathname, useSegments } from "expo-router";

export default function Header(){
    const { openDrawer } = useDrawer();
    const path = usePathname();

    const renderizaHeader = path === "/" || path === "/consultas" || path === "/tipoProdutos" || path === "/usuarios"

    return(
        <>
            {
                renderizaHeader && (
                    <View style={style.topo}>
                        <TouchableOpacity onPress={openDrawer}>
                            <FontAwesomeIcon icon={faBars} size={24} color={'#000000'}/>
                        </TouchableOpacity>
                        <Image 
                            style={{ width: 150, height: 50 }}
                            source={require('../../assets/images/sem_imagem.png')}
                        />
                    </View>
                )
            }
        </>
    );
}

const style = StyleSheet.create({
    topo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'transparent'
    },
    texto: {
        alignSelf: 'flex-start'
    }
})