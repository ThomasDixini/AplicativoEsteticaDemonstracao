import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { PaperProvider, Portal, FAB } from "react-native-paper";
import { faClose, faPlus, faShoppingBasket, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function Fab(){
    const navegador = useRouter();
    const path = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return(
        <Portal>
            <FAB.Group 
                style={{ position: 'absolute', bottom: 50 }}
                open={isOpen} 
                visible 
                fabStyle={{ backgroundColor: '#b89415' }}
                icon={isOpen ? (props) => <FontAwesomeIcon {...props} icon={faClose} /> : (props) => <FontAwesomeIcon {...props} icon={faPlus} />}
                actions={[
                    { 
                        icon: (props) => <FontAwesomeIcon {...props} icon={faTag} />, 
                        label: path.includes("tipoProduto") ? 'Cadastrar Novo Produto' : '',
                        onPress: () => {
                            navegador.push('/(app)/(produtos)/cadastro_produto')
                        } ,
                        style: !path.includes("tipoProduto") ? {
                            display: "none",
                        } : {}
                    },
                    { 
                        icon: (props) => <FontAwesomeIcon {...props} icon={faShoppingBasket} />, 
                        label: path.includes("tipoProduto") ? 'Cadastrar Categoria do Produto' : '',
                        onPress: () => {
                            navegador.push('/(app)/(produtos)/cadastro_tipoProdutos')
                        } ,
                        style: !path.includes("tipoProduto") ? {
                            display: 'none'
                        } : {}
                    },
                    {
                        icon: (props) => <FontAwesomeIcon {...props} icon={faPlus} />,
                        label: path.includes("consulta") ? 'Cadastrar Nova Consulta' : '',
                        onPress: () => {
                            path.includes("consulta") && navegador.push('/(app)/(tipoConsultas)/cadastro')
                        },
                        style: !path.includes("consulta") ? {
                            display: 'none'
                        } : {}
                    },
                ]}
                onStateChange={() => setIsOpen(!isOpen)}
                onPress={() => { }}
            />
        </Portal>
    );
}