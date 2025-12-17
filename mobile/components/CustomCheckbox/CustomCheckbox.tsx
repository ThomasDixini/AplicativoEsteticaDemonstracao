import { Pressable, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export function CustomCheckbox({ checked, onPress }: { checked: boolean, onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#6200ee",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: checked ? "#6200ee" : "transparent",
      }}
    >
      {checked && <FontAwesomeIcon icon={faCheck} color="white" size={14} />}
    </Pressable>
  );
}
