import { TipoConsultas } from "@/interfaces/Consultas/TipoConsultas";
import { Produtos } from "@/interfaces/Produtos/Produtos";
import { alterarTipoConsulta } from "@/services/consultas/consultas-service";
import { alterarProduto, alterarTipoProduto } from "@/services/produtos/produtos-service";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import { Dispatch, SetStateAction, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Button, Divider, Menu } from "react-native-paper";
import { useMenuDropdown } from "./MenuDropdownProvider";
import { TipoProdutos } from "@/interfaces/Produtos/TipoProdutos";

interface MenuDropdown {
    ativo: boolean;
    itemId: number;
    tipo: string;
    recarregarItens?: () => Promise<void>;
}

export default function MenuDropdown({ ativo, itemId, tipo, recarregarItens }: MenuDropdown){
    const [visible, setVisible] = useState(false);
    const [estadoTipoConsulta, setEstadoTipoConsulta] = useState(ativo);
    const [estadoProduto, setEstadoProduto] = useState(ativo);
    const [estadoTipoProduto, setEstadoTipoProduto] = useState(ativo);
    const [loading, setLoading] = useState(false);
    const navegador = useRouter();

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    async function alterarTipoConsultaEstado(estadoAtivo: boolean){
        try {
            setLoading(true);
            const tipoConsultaAlterado: TipoConsultas = await alterarTipoConsulta(itemId, estadoAtivo).then(res => res.data)
            setEstadoTipoConsulta(tipoConsultaAlterado.ativo)
            await recarregarItens!();
            setLoading(false);
        } catch (error) {
            if (isAxiosError(error)) {
                console.error("⚠️ Axios error.code:", error.code);
                console.error("⚠️ Axios error.message:", error.message);
                console.error("⚠️ Axios error.request:", error.request);
                console.error("⚠️ Axios error.response:", error.response);
            } else {
                console.error("❌ Erro desconhecido:", error);
            }

            setLoading(false);
            throw error;
        }
    }

    async function alterarProdutoEstado(estadoAtivo: boolean) {
        try {
            setLoading(true);
            const produtoAlterado: Produtos = await alterarProduto(itemId, estadoAtivo).then(res => res.data)
            setEstadoProduto(produtoAlterado.ativo)
            await recarregarItens!();
            setLoading(false);
        } catch (error) {
            if (isAxiosError(error)) {
                console.error("⚠️ Axios error.code:", error.code);
                console.error("⚠️ Axios error.message:", error.message);
                console.error("⚠️ Axios error.request:", error.request);
                console.error("⚠️ Axios error.response:", error.response);
            } else {
                console.error("❌ Erro desconhecido:", error);
            }
            
            setLoading(false);
            throw error;
        }
    }

    async function alterarTipoProdutoEstado(estadoAtivo: boolean) {
        try {
            setLoading(true);
            const tipoProdutoAlterado: TipoProdutos = await alterarTipoProduto(itemId, estadoAtivo).then(res => res.data)
            setEstadoTipoProduto(tipoProdutoAlterado.ativo)
            await recarregarItens!();
            setLoading(false);
        } catch (error) {
            if (isAxiosError(error)) {
                console.error("⚠️ Axios error.code:", error.code);
                console.error("⚠️ Axios error.message:", error.message);
                console.error("⚠️ Axios error.request:", error.request);
                console.error("⚠️ Axios error.response:", error.response);
            } else {
                console.error("❌ Erro desconhecido:", error);
            }

            setLoading(false);
            throw error;
        }
    }

    function navegarParaCadastroConsulta(){
        navegador.push({
            pathname: '/(app)/(tipoConsultas)/cadastro',
            params: {
                tipoConsultaId: itemId
            }
        })
    }

    function navegarParaCadastroProduto(){
        navegador.push({
            pathname: '/(app)/(produtos)/cadastro_produto',
            params: {
                produtoId: itemId
            }
        })
    }

    function navegarParaCadastroTipoProduto(){
        navegador.push({
            pathname: '/(app)/(produtos)/cadastro_tipoProdutos',
            params: {
                tipoProdutoId: itemId
            }
        })
    }

    return (
        <>
            {
                loading ? (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color={'gray'}/>
                    </View>
                ) : (
                    <View>
                        <Menu 
                            visible={visible}
                            onDismiss={closeMenu}
                            anchor={<Button style={{ justifyContent: 'center', alignItems: 'center' }} onPress={openMenu}> <FontAwesomeIcon icon={faEllipsis} size={20} color={'#000000'} /> </Button>}>
                                <Menu.Item onPress={() => {tipo === 'tipoConsulta' ? navegarParaCadastroConsulta() : tipo === 'produto' ? navegarParaCadastroProduto() : navegarParaCadastroTipoProduto(); closeMenu()} } title="Editar" />
                                <Divider />
                                <Menu.Item onPress={() => {tipo === 'tipoConsulta' ? alterarTipoConsultaEstado(!ativo) : tipo === 'produto' ? alterarProdutoEstado(!ativo) : alterarTipoProdutoEstado(!ativo); closeMenu() }} title={ativo ? "Inativar" : "Ativar"}/>
                        </Menu>
                    </View>
                )
            }
        </>
    )
}