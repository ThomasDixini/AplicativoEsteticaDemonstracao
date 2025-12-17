import { Stack } from "expo-router";
import FlashMessage from "react-native-flash-message";

export default function LoginLayout(){
    return (
        <>
            <Stack screenOptions={{ 
                headerTransparent: true,
                headerTitle: ""
            }}>
                <Stack.Screen name="auth"/>
                <Stack.Screen name="login"/>
                <Stack.Screen name="registrar"/>
            </Stack>
            <FlashMessage position="bottom"/>
        </>
    );
}