import { Image, Pressable, Text, View } from "react-native";
import { CardProdutosProps } from "./types/CardProdutosProps";
import { baseURL } from "@/utils/api";
import { useMenuDropdown } from "../MenuDropdown/MenuDropdownProvider";
import MenuDropdown from "../MenuDropdown/MenuDropdown";
import { RelativePathString, usePathname, useRouter } from "expo-router";

export default function CardProdutos(props: CardProdutosProps){
    const { isAdmin } = useMenuDropdown();
    const path = usePathname();
    const pathURL = baseURL ? baseURL?.replace('/api', '') : '';
    const navegador = useRouter();

    function navegar(){
        navegador.push({
            pathname: `/produtos/${props.produto.id}` as RelativePathString,
            params: {
                descricao: props.produto.descricao,
                nome: props.produto.nome,
                uri_imagem: props.produto.uriImagem
            }
        })
    }

    return (
        <Pressable onPress={() => navegar() } style={{ opacity: props.produto.ativo ? 1 : 0.25,  elevation: 4, shadowColor: 'black', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: -2, height: 2 }, backgroundColor: '#ffffff', padding: 8, paddingBottom: 16, borderRadius: 8, maxWidth: 150, width: 150, marginHorizontal: 12, flexDirection: 'column', alignItems: 'flex-start' }}>
            <Image
                style={{ width: '100%', height: 120, borderRadius: 8 }}
                source={{ uri: props.produto.uriImagem ? `${pathURL}${props.produto.uriImagem}` : `${pathURL}/imagens/sem_imagem.png`}}
            />
            <View style={{ marginTop: 'auto' }}>
                <Text style={{ flexWrap: 'wrap', fontSize: 14, marginTop: 8, maxWidth: 100, textAlign: 'left', fontWeight: 'bold', color: '#252f3d' }}>{props.produto.nome} </Text>
                <Text style={{ flexWrap: 'wrap', textAlign: 'left', color: '#7b828c' }}>R$ {props.produto.valorDeVenda} </Text>
            </View>
            {
                isAdmin && <View style={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    zIndex: 999999,
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '2 2 5 #000000AA',
                    backgroundColor: '#FFFFFF'
                }}>
                                <MenuDropdown ativo={props.produto.ativo} itemId={props.produto.id} tipo={'produto'} recarregarItens={props.recarregarItens}/>
                            </View>
            }
        </Pressable>
    );
}