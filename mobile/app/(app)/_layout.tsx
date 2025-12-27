import 'react-native-vector-icons/MaterialCommunityIcons';
import { Tabs, usePathname, useRouter, useSegments } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendarPlus, faCartPlus, faCalendarDays, faClock, faExclamation, faCircleInfo, faUser, faImage, faCheck, faCircleCheck, faArrowLeft, faLocationDot, faDoorOpen, faPhone, faBars, faEllipsis, faArrowRight, faCalendar, faX, faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { setRouter } from "@/utils/navigationAxios";
import FlashMessage from "react-native-flash-message";
import { Provider as PaperProvider } from 'react-native-paper';
import Fab from "@/components/Fab/Fab";
import { checarUsuarioAdmin, salvarNotificacaoToken } from "@/services/usuarios/usuario-service";
import DrawerComponent from "@/components/Drawer/Drawer";
import { Alert, Dimensions, Platform, View } from "react-native";
import Header from "@/components/Header/Header";
import DrawerProvider from "@/components/Drawer/DrawerProvider";
import MenuDropdownProvider from "@/components/MenuDropdown/MenuDropdownProvider";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// Define como a notificação deve aparecer quando app está aberto
if(Platform.OS === 'android'){
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

const theme = {
    ...DefaultTheme,
    // opcional: personalize a cor do checkbox se quiser
    colors: {
      ...DefaultTheme.colors,
      primary: '#6200ee',
    },
  };


export default function RootLayout() {
  library.add(
    faCalendarPlus, 
    faCartPlus, 
    faCalendarDays, 
    faExclamation, 
    faCircleInfo, 
    faUser, 
    faImage, 
    faCheck, 
    faCircleCheck, 
    faArrowLeft, 
    faArrowRight, 
    faPhone, 
    faEllipsis, 
    faDoorOpen, 
    faBars, 
    faLocationDot,
    faInstagram,
    faFacebook,
    faCalendar,
    faX,
  )
  const router = useRouter();
  const path = usePathname() || "";
  const { width } = Dimensions.get('window')

  const naoRenderizaMenu = path.includes('cadastro')
  const renderizaFab = path === '/tipoProdutos' || path === '/consultas'

  const [isAdmin, setIsAdmin] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Solicita permissão e obtém o token do dispositivo
    if(Platform.OS === 'android' || Platform.OS === 'ios'){
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          setExpoPushToken(token);
          salvarNotificacaoToken(token)
        }
      });
  
      // Listener quando notificação chega em foreground
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        Alert.alert("Notificação Recebida!", notification.request.content.body || "");
      });

      // Listener quando usuário toca na notificação
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log("Usuário clicou na notificação:", response);
      });

      return () => {
        if (notificationListener.current)
          Notifications.removeNotificationSubscription(notificationListener.current);
        if (responseListener.current)
          Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, []);

  useEffect(() => {
    const verificarAdmin = async () => {
      var isAdmin = await checarUsuarioAdmin();
      setIsAdmin(!!isAdmin)
    };

    setRouter(router);
    verificarAdmin();
  }, [router]);

  useEffect(() => {
    if (path.startsWith('/tipoProdutos')) {
      router.replace('/tipoProdutos');
    }
  }, [path]);

  return (
    <PaperProvider theme={theme} settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}>
      <MenuDropdownProvider>
        <DrawerProvider>
          <View style={{ flex: 1 }}>
            <Header />
            <Tabs 
              screenOptions={({ route }) => ({
                tabBarActiveTintColor: "#000",
                headerShown: false,
                tabBarStyle: naoRenderizaMenu ? {
                  display: 'none'
                } : {},
                tabBarIcon: ({ color, size }) => {
                  switch(route.name){
                    case 'index':
                      return <FontAwesomeIcon icon={faCalendarDays} size={size} color={color} />;

                    case '(tipoConsultas)':
                      return <FontAwesomeIcon icon={faCalendarPlus} size={size} color={color} />;
                    
                    case '(produtos)':
                      return <FontAwesomeIcon icon={faCartPlus} size={size} color={color} />;

                    case '(tipoConsultas)/consulta':
                      break;
                  }
                  },
              })}
            >
              <Tabs.Screen name="index" options={{
                href: '/',
                tabBarLabel: width >= 490 ? 'Agendadas' : '',
              }}/>
              <Tabs.Screen name="(tipoConsultas)" options={{
                href: '/(app)/(tipoConsultas)/consultas',
                tabBarLabel: width >= 490 ? 'Marcar Consulta' : '',
              }}/>
              <Tabs.Screen name="(produtos)" options={{
                href: '/(app)/(produtos)/tipoProdutos',
                tabBarLabel: width >= 490 ? 'Produtos' : ''
              }}/>
              <Tabs.Screen name="(usuarios)" options={{
                href: null
              }}/>
            </Tabs>
            { (isAdmin && renderizaFab) && <Fab /> }
            <FlashMessage position="bottom"/>
            <DrawerComponent />
          </View>
        </DrawerProvider>
      </MenuDropdownProvider>
    </PaperProvider>
  )
}

// Função que pede permissão e retorna o token do dispositivo
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    Alert.alert("Você precisa testar em um dispositivo físico");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Permissão para notificações não concedida!");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

// Função web para solicitar permissão via clique do usuário
const handleWebPermission = async () => {
  if (!("Notification" in window)) {
    alert("Este navegador não suporta notificações.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Permissão concedida!");
  } else {
    alert("Permissão negada!");
  }
};


