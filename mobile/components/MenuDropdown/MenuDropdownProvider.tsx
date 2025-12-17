import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { checarUsuarioAdmin } from "@/services/usuarios/usuario-service";

type MenuDropdownContextInterface = {
    openMenuDropdown: () => void;
    closeMenuDropdown: () => void;
    visible: boolean;
    isAdmin: boolean;
}
const MenuDropdownContext = createContext({} as MenuDropdownContextInterface);
export const useMenuDropdown = () => useContext(MenuDropdownContext);

type MenuDropdownProviderProps = {
  children: ReactNode;
};

export default function MenuDropdownProvider({ children }: MenuDropdownProviderProps){
    const [visible, setVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const openMenuDropdown = () => {
        setVisible(true);
    };

    const closeMenuDropdown = () => {
        setVisible(false)
    };

    useEffect(() => {
        const verificarAdmin = async () => {
          var isAdmin = await checarUsuarioAdmin();
          if(isAdmin){
            setIsAdmin(isAdmin)
          }
        };
    
        verificarAdmin();
      }, []);

    return(
        <MenuDropdownContext.Provider value={{ openMenuDropdown, closeMenuDropdown, visible, isAdmin }}>
            {children}
        </MenuDropdownContext.Provider>
    )
}