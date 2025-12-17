import Header from "@/components/Header/Header";
import { Stack, useFocusEffect, useNavigation, usePathname, useRouter } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

export default function UsuarioLayout(){
    const path = usePathname();
    var naoRenderizaSeta = path.includes('cadastro')

    return (
        <Stack screenOptions={{ 
            headerTransparent: true,
            headerTitle: "",
            headerBackVisible: naoRenderizaSeta ? false : true
        }}>
            <Stack.Screen name="usuarios"/>
        </Stack>
    );
}