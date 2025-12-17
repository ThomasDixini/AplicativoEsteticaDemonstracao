import { Stack, usePathname } from "expo-router";

export default function TipoConsultasLayout() {
  const path = usePathname();
  var renderiza = path.includes('consulta/')

    return (
      <>
        <Stack screenOptions={{ 
          headerTransparent: !renderiza,
          headerTitle: renderiza ? "Agendar Consulta" : '',
          headerBackVisible: true,
          headerTitleAlign: 'center',
        }}>
          <Stack.Screen name="consultas" options={{
            headerShown: true
          }} />
        </Stack>
      </>
    );
  }