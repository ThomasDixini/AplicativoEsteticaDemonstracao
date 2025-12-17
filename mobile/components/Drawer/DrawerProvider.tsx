import { createContext, useContext, useState } from "react";
import { Animated, Dimensions } from "react-native";
import { ReactNode } from "react";

const SCREEN_WIDTH = Dimensions.get('window').width;

type DrawerContextInterface = {
    openDrawer: () => void;
    closeDrawer: () => void;
    visible: boolean;
    translateX: Animated.Value;
}
const DrawerContext = createContext({} as DrawerContextInterface);
export const useDrawer = () => useContext(DrawerContext);

type DrawerProviderProps = {
  children: ReactNode;
};

export default function DrawerProvider({ children }: DrawerProviderProps){
    const [visible, setVisible] = useState(false);
    const [translateX] = useState(new Animated.Value(-SCREEN_WIDTH));

    const openDrawer = () => {
        setVisible(true);
        Animated.timing(translateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeDrawer = () => {
        Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setVisible(false));
    };

    return(
        <DrawerContext.Provider value={{ openDrawer, closeDrawer, visible, translateX }}>
            {children}
        </DrawerContext.Provider>
    )
}