import { Stack, usePathname } from "expo-router";

export default function ProdutosLayout(){
    const path = usePathname();
    var renderiza = path.includes('cadastro') || path.includes('cadastro_produto')

    return (
        <Stack screenOptions={{ 
            headerTransparent: renderiza ? false : true,
            headerTitle: '',
            headerBackVisible: true
        }}>
            <Stack.Screen name="tipoProdutos"/>
        </Stack>
    );
}