import { StyleSheet } from "react-native";
import { BarraPesquisaProps } from "./types/BarraPesquisaProps";
import { TextInput } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function BarraPesquisa(props: BarraPesquisaProps){
    return(
        <TextInput 
            mode="outlined"
            keyboardType="default"
            value={props.textoPesquisa}
            onChangeText={props.enviarItensFiltrados}
            placeholder={props.placeholder}
            left={<TextInput.Icon icon={() => (
                <FontAwesomeIcon icon={faMagnifyingGlass} size={12} color="gray"/>
            )} color="#767e89" />}
            style={{
                backgroundColor: "#f9fafb", // 👈 precisa forçar no Android
            }}
            theme={{
                colors: {
                    primary: "#b89415",     // cor da borda quando focado
                    outline: "#e9ebee",     // cor da borda quando não focado
                    text: "#222",           // cor do texto (Android lê daqui)
                    placeholder: "#767e8960", // cor do placeholder (Paper ignora placeholderTextColor)
                },
                roundness: 12,
            }}
            contentStyle={{ height: 56 }}
            />
    )
}