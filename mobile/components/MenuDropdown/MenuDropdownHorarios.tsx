import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { View } from "react-native";
import { Button, Divider, Menu } from "react-native-paper";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";

interface MenuDropdownHorariosProps {
    tipoConsultaId: string | string[];
    data: string;
    setModalHorariosIndisponiveisVisivel: (param: boolean) => void;
}

export default function MenuDropdownHorarios({ setModalHorariosIndisponiveisVisivel, tipoConsultaId, data }: MenuDropdownHorariosProps){
    const [visible, setVisible] = useState(false);
    const navegador = useRouter();

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    function navegarParaCancelarHorariosIndisponiveis(){
        navegador.push({
            pathname: '/(app)/(tipoConsultas)/consulta/horariosIndisponiveis',
            params: {
                tipoConsultaId: tipoConsultaId,
                data: data
            }
        })
    }

    return(
        <View>
            <Menu 
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Button style={{ justifyContent: 'center', alignItems: 'center' }} onPress={openMenu}> <FontAwesomeIcon icon={faEllipsis} size={16} color={'#000000'} /> </Button>}>
                    <Menu.Item onPress={() => { setModalHorariosIndisponiveisVisivel(true); closeMenu() } } title="Definir Horários Indisponiveis" />
                    <Divider />
                    <Menu.Item onPress={() => { navegarParaCancelarHorariosIndisponiveis(); closeMenu() } } title="Editar"/>
            </Menu>
        </View>
    )
} 