import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { View } from "react-native";
import { Button, Divider, Menu } from "react-native-paper";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import { StatusConsulta } from "@/interfaces/Consultas/StatusConsulta";
import { atualizarStatusConsulta } from "@/services/consultas/consultas-service";

interface MenuDropdownConsultasProps {
    consultaId: number;
    status: StatusConsulta;
    atualizarConsultas: () => void;
    recarregarConsultas: () => void;
}

export default function MenuDropdownConsultas({ status, consultaId, recarregarConsultas, atualizarConsultas }: MenuDropdownConsultasProps){
    const [visible, setVisible] = useState(false);
    const navegador = useRouter();

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    async function atualizarStatus(statusId: StatusConsulta){
        await atualizarStatusConsulta(consultaId, statusId)
        atualizarConsultas();
    }

    return(
        <View>
            <Menu 
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Button style={{ justifyContent: 'center', alignItems: 'center' }} onPress={openMenu}> <FontAwesomeIcon icon={faEllipsis} size={16} color={'#000000'} /> </Button>}>
                    { status === StatusConsulta.AGUARDANDO_CONFIRMACAO && <Menu.Item title="Confirmar" onPress={() => { atualizarStatus(StatusConsulta.AGENDADA); (recarregarConsultas()); closeMenu()}}/>}
                    <Divider />
                    { status === StatusConsulta.AGUARDANDO_CONFIRMACAO && <Menu.Item title="Cancelar" onPress={() => { atualizarStatus(StatusConsulta.CANCELADA); (recarregarConsultas()); closeMenu()}}/>}
                    <Divider />
                    { status === StatusConsulta.AGENDADA && <Menu.Item title="Concluir" onPress={() => { atualizarStatus(StatusConsulta.CONCLUIDA); (recarregarConsultas()); closeMenu()}}/>}
                    <Divider />
                    { status === StatusConsulta.AGENDADA && <Menu.Item title="Cancelar Confirmação" onPress={() => { atualizarStatus(StatusConsulta.AGUARDANDO_CONFIRMACAO); (recarregarConsultas()); closeMenu()}}/>}
            </Menu>
        </View>
    )
} 