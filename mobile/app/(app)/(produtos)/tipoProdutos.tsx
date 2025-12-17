import BarraPesquisa from "@/components/BarraPesquisa/BarraPesquisa";
import CardProdutos from "@/components/CardProdutos/CardProdutos";
import CardLoaderProdutos from "@/components/Loaders/CardLoaderProdutos/CardLoaderProdutos";
import FonteLoader from "@/components/Loaders/FonteLoader/FonteLoader";
import MenuDropdown from "@/components/MenuDropdown/MenuDropdown";
import { useMenuDropdown } from "@/components/MenuDropdown/MenuDropdownProvider";
import MenuSecoes from "@/components/MenuSecoes/MenuSecoes";
import { Secoes } from "@/components/MenuSecoes/types/MenuSecoes";
import Card from "@/components/TipoConsultas/Card";
import { TipoProdutos } from "@/interfaces/Produtos/TipoProdutos";
import { buscarTipoProdutos } from "@/services/produtos/produtos-service";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text,  View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";



export default function ProdutosPagina() {
    const [tipoProdutos, setTipoProdutos] = useState<TipoProdutos[]>([]);
    const [tipoProdutosBackup, setTipoProdutosBackup] = useState<TipoProdutos[]>([]);
    const [nomeProduto, setNomeProduto] = useState('');
    const [secoes, setSecoes] = useState<Secoes[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useMenuDropdown();

    const receberSecoesFiltradas = (tipoProdutoId: number | null, reseta: boolean = false) => {
        if(reseta){
            setTipoProdutos(tipoProdutosBackup);
        } else {
            var tipoProdutosFiltrados = tipoProdutosBackup.filter(c => c.id === tipoProdutoId);
            setTipoProdutos([...tipoProdutosFiltrados]);
        }
    }

    const receberProdutosFiltrados = (nomeProduto: string) => {
        setNomeProduto(nomeProduto);
        var produtos = tipoProdutosBackup.flatMap(c => c.produtos);
        var produtosFiltrados = produtos.filter(c => c.nome.toLowerCase().includes(nomeProduto.toLowerCase()));
        if(produtosFiltrados && produtosFiltrados.length > 0){
            var produtosIds = produtosFiltrados.map(c => c.id);
            
            var tipoProdutosFiltrados = tipoProdutosBackup.reduce<TipoProdutos[]>((acc, tipo) => {
                const produtosFiltrados = tipo.produtos.filter(produto => produtosIds.includes(produto.id));
                
                if(produtosFiltrados.length > 0){
                    acc.push({ ...tipo, produtos: produtosFiltrados });
                }
                
                return acc;
            }, [])
            
            setTipoProdutos([...tipoProdutosFiltrados])
        } else {
            setTimeout(() => {
                showMessage({
                    message: 'Não existe este produto!',
                    type: 'warning'
                })
            }, 500)
        }
    }

    const recarregarProdutos = async () => {
        setLoading(true);
        await carregarTipoProdutos();
        setLoading(false)
    }

    const recarregarTipoProdutos = async () => {
        setLoading(true);
        await carregarTipoProdutos();
        setLoading(false)
    }

    useEffect(() => {
        carregarTipoProdutos();
    }, [])

    const carregarTipoProdutos = async () => {
        try {
            setLoading(true)
            let tipoProdutosResponse = await buscarTipoProdutos();
            if(!tipoProdutosResponse || tipoProdutosResponse.length === 0){
                showMessage({
                    message: "Ainda não existem produtos para compra.",
                    type: "info"
                })
                setLoading(false);
                return;
            }
            tipoProdutosResponse = tipoProdutosResponse.filter(tipoProduto => tipoProduto.produtos && tipoProduto.produtos.length > 0);
            setTipoProdutos(tipoProdutosResponse);
            setTipoProdutosBackup(tipoProdutosResponse)

            const secoesAux: Secoes[] = tipoProdutosResponse.map(c => {
                return {
                    id: c.id,
                    secao: c.nome
                }
            })
            setSecoes(secoesAux)
            setLoading(false)
        } catch (error) {
            if (isAxiosError(error)) {
                console.error("⚠️ Axios error.code:", error.code);
                console.error("⚠️ Axios error.message:", error.message);
                console.error("⚠️ Axios error.status:", error.status);
                console.error("⚠️ Axios error.cause:", error.cause);
                console.error("⚠️ Axios error.json:", error.toJSON());
            } else {
                console.error("❌ Erro desconhecido:", error);
            }

            setLoading(false);
            throw error;
        }
    }

    return (
        <>
            {
               loading ? (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc'}}>
                        <ActivityIndicator size="large" color={'gray'}/>
                    </View>
                ) : (
                    tipoProdutos.length > 0 ? 
                        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
                            <View style={{ marginTop: 16,  padding: 16, backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: '#e7e9ec' }}>
                                <BarraPesquisa placeholder="Pesquisar produtos" textoPesquisa={nomeProduto} enviarItensFiltrados={receberProdutosFiltrados}/>
                                { nomeProduto === '' && <MenuSecoes enviarSecoesFiltradas={receberSecoesFiltradas} secoes={secoes}/> }
                            </View>
                            <ScrollView
                                style={styles.topo} 
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ padding: 16 }}
                                refreshControl={
                                    <RefreshControl refreshing={loading} onRefresh={carregarTipoProdutos}/>
                                }>
                                {
                                    loading ? (
                                        Array.from({ length: 3}).map((_, index) => {
                                            return (
                                                <View key={index} style={{ marginTop: 32 }}>
                                                    <FonteLoader />
                                                    <View style={{ flexDirection: 'row', gap: 16 }}>
                                                        <CardLoaderProdutos />
                                                        <CardLoaderProdutos />
                                                    </View>
                                                </View>
                                            )
                                        })
                                    ) : (
                                        tipoProdutos && tipoProdutos.map((item: TipoProdutos, index) => {
                                            return(
                                                <View key={index} style={{ marginTop: 32 }}>
                                                    { 
                                                        item.produtos.length > 0 && <Text style={styles.titulo}> 
                                                                                        <Text style={[
                                                                                            item.ativo === false && {
                                                                                                opacity: 0.1,
                                                                                                color: '#00000020'
                                                                                            },
                                                                                            { marginRight: 10}
                                                                                        ]}>{item.nome + "  "}</Text>
                                                                                        {
                                                                                            isAdmin && <View style={styles.botaoEdicao}>
                                                                                                        <MenuDropdown ativo={item.ativo} itemId={item.id} tipo="tipoProduto" recarregarItens={recarregarTipoProdutos}/>
                                                                                                    </View>
                                                                                        }
                                                                                    </Text> 
                                                        }
                                                    <ScrollView style={{ paddingVertical: 20 }} horizontal={true} nestedScrollEnabled={true} showsHorizontalScrollIndicator={false}>
                                                        {item.produtos.map((produto, index) => {
                                                            return <CardProdutos key={index} produto={produto} recarregarItens={recarregarProdutos}/>
                                                        })}
                                                    </ScrollView>
                                                </View>
                                            )
                                        })
                                    )
                                }
                            </ScrollView>
                        </SafeAreaView> 
                    : 
                    <ScrollView 
                        contentContainerStyle={{ padding: 32, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginVertical: 'auto', backgroundColor: '#f8fafc', flex: 1 }}
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={carregarTipoProdutos}/>
                        }
                        >
                        <FontAwesomeIcon icon={faCircleInfo} size={64} />
                        <Text style={{ fontSize: 18, textAlign: 'center' }}> Não há produtos cadastrados! </Text>
                    </ScrollView>
                )
            }
        </>
    );
}

const styles = StyleSheet.create({
    topo: {
        backgroundColor: '#f8fafc',
    },

    titulo: {
        marginLeft: 16,
        fontSize: 32,
        color: '#1f2937',
        fontWeight: 'bold',
    },
    botaoEdicao: {
        position: 'absolute',
        width: 30,
        height: 30,
        backgroundColor: '#FFFFFFCC',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        boxShadow: '1 1 5 #000000AA',
        zIndex: 999999,
    },

    inativado: {
        opacity: 0.8
    }
})