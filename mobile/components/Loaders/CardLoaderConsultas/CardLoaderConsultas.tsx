import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import MobileContentLoader , { Circle , Rect } from 'react-content-loader/native';
import WebContentLoader from 'react-content-loader'


export default function CardLoaderConsultas(){
    const { width, height } = useWindowDimensions();

    if (!width || !height) return null;

    return(
        <View style={styles.topo}>
            {
                Platform.OS === 'web' ? (
                    <WebContentLoader
                        speed={1.5}
                        viewBox={`0 0 ${width} 120`} 
                        width={300}
                        height={120}
                        backgroundColor="#DDD" 
                        foregroundColor="#999"
                    >
                        <rect x="110" y="21" rx="4" ry="4" width="100" height="10" />
                        <rect x="111" y="41" rx="3" ry="3" width="250" height="10" />
                        <rect x="111" y="61" rx="3" ry="3" width="220" height="10" />
                        <circle cx="48" cy="48" r="48" />
                    </WebContentLoader>
                ) : (
                    <MobileContentLoader 
                        speed={1.5}
                        viewBox={`0 0 ${width} 120`} 
                        width={300}
                        height={120}
                        backgroundColor="#DDD" 
                        foregroundColor="#999"
                    >
                        <Rect x="110" y="21" rx="4" ry="4" width="100" height="10" />
                        <Rect x="111" y="41" rx="3" ry="3" width="250" height="10" />
                        <Rect x="111" y="61" rx="3" ry="3" width="220" height="10" />
                        <Circle cx="48" cy="48" r="48" />
                    </MobileContentLoader>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    topo: {
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 16
    }
})