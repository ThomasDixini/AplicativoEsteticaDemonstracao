import { MessageType, showMessage } from "react-native-flash-message";

export const useMessageError = () => ({
    success: (msg: string, desc?: string) => showMessage({ message: msg, description: desc, type: "success"}),
    info: (msg: string, desc?: string) => showMessage({ message: msg, description: desc, type: "info"}),
    warning: (msg: string, desc?: string) => showMessage({ message: msg, description: desc, type: "warning"}),
    error: (msg: string, desc?: string) => showMessage({ message: msg, description: desc, type: "danger"})
})