import { StyleSheet, useWindowDimensions, View } from "react-native";
import ContentLoader, { Circle, Rect } from 'react-content-loader/native'

export default function FonteLoader(){
    const { width, height } = useWindowDimensions();

    if (!width || !height) return null;

    return(
        <ContentLoader 
            speed={1.5}
            viewBox={`0 0 ${width} 30`} 
            width={width/1.5}
            height={30}
            backgroundColor="#DDD" 
            foregroundColor="#999"
        >
            <Rect x="0" y="21" rx="4" ry="4" width={width} height="50" />
        </ContentLoader>
    );
}