import { StyleSheet, useWindowDimensions, View } from "react-native";
import ContentLoader, { Circle, Rect } from 'react-content-loader/native'

export default function HorariosLoader(){
    const { width } = useWindowDimensions();
    const loaderWidth = width * 0.8;
    const boxWidth = loaderWidth / 2.2;
    const boxHeight = 50;
    const spacing = 16;

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <ContentLoader
        speed={1.5}
        width={loaderWidth}
        height={boxHeight * 2 + spacing}
        viewBox={`0 0 ${loaderWidth} ${boxHeight * 2 + spacing}`}
        backgroundColor="#DDD"
        foregroundColor="#999"
      >
        {/* Linha 1 */}
        <Rect x="0" y="0" rx="8" ry="8" width={boxWidth} height={boxHeight} />
        <Rect x={boxWidth + spacing} y="0" rx="8" ry="8" width={boxWidth} height={boxHeight} />

        {/* Linha 2 */}
        <Rect x="0" y={boxHeight + spacing} rx="8" ry="8" width={boxWidth} height={boxHeight} />
        <Rect x={boxWidth + spacing} y={boxHeight + spacing} rx="8" ry="8" width={boxWidth} height={boxHeight} />
      </ContentLoader>
    </View>
  )
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