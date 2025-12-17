import { StyleSheet, useWindowDimensions, View } from "react-native";
import ContentLoader, { Circle, Rect } from 'react-content-loader/native'

export default function CardLoaderProdutos(){
    const { width, height } = useWindowDimensions();

    if (!width || !height) return null;

    return(
        <View style={styles.topo}>
            <ContentLoader 
                rtl
                speed={1.5}
                viewBox={`0 0 ${width} 200`} 
                width={width/2}
                height={150}
                backgroundColor="#DDD" 
                foregroundColor="#999"
            >
                <Rect x="160" y="21" rx="4" ry="4" width="150" height="15" />
                <Rect x="160" y="51" rx="3" ry="3" width="200" height="15" />
                <Rect x="160" y="81" rx="3" ry="3" width="180" height="15" />
                <Rect x="160" y="111" rx="3" ry="3" width="150" height="15" />
                <Circle cx="78" cy="78" r="70" />
            </ContentLoader>
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
        marginTop: 16,
        maxWidth: 200,
    }
})