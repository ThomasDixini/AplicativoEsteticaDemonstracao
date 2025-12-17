import { CardConsultaMarcada } from "@/components/CardConsultaMarcada/CardConsultaMarcada";
import { Consultas } from "@/interfaces/Consultas/Consultas";
import { buscarConsultasAgendadas } from "@/services/consultas/consultas-service";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Text } from "react-native";
import { Secoes } from "@/components/MenuSecoes/types/MenuSecoes";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";

export default function InicialPagina() {
  const [consultas, setConsultas] = useState<Consultas[]>([]);
  const [secoes, setSecoes] = useState<Secoes[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [temMais, setTemMais] = useState(false);
  const [atualizarConsultas, setAtualizarConsultas] = useState(true);

  async function buscaConsultasAgendadas(reseta = false, tipoConsultaFiltro: any = null) {
    try{
      setCarregando(true);
      if(reseta){
        setPagina(1)
        setConsultas([]);

        const consultasResponse: Consultas[] = await buscarConsultasAgendadas(1, itensPorPagina, tipoConsultaFiltro);
        if(!consultasResponse || consultasResponse.length === 0) {
          setCarregando(false);
          return;
        };

        setTemMais(consultasResponse.length === itensPorPagina);
        setConsultas(prev => {
          const atualizados = prev.map(prevItem => {
            const atualizado = consultasResponse.find(consulta => consulta.id === prevItem.id);
            return atualizado ? {...prevItem, ...atualizado} : prevItem;
          })

          const novosItens = consultasResponse.filter(
            c => !prev.some(prevItem => prevItem.id === c.id)
          );
          return [...atualizados, ...novosItens];
        });

        const tipoConsultas = consultas.map(c => c.tipoConsulta);
        const tipoConsultasDistinct = Array.from(
          new Map(tipoConsultas.map(obj => [obj!.id, obj])).values()
        );
        
        const secoesAux = tipoConsultasDistinct.map(tipoConsulta => {
          return {
            id: tipoConsulta?.id || 0,
            secao: tipoConsulta?.nome || ''
          }
        })

        const secoesDistintas = Array.from(
          new Map([...secoes, ...secoesAux].map(obj => [obj.id, obj])).values()
        )

        setSecoes(secoesDistintas)
        setCarregando(false)

      } else {
        const consultasResponse: Consultas[] = await buscarConsultasAgendadas(pagina, itensPorPagina, tipoConsultaFiltro);
        if(!consultasResponse || consultasResponse.length === 0){
          setCarregando(false);
          return;
        };
      
        setTemMais(consultasResponse.length === itensPorPagina);
        setConsultas(prev => {
          const atualizados = prev.map(prevItem => {
            const atualizado = consultasResponse.find(consulta => consulta.id === prevItem.id);
            return atualizado ? {...prevItem, ...atualizado} : prevItem;
          })

          const novosItens = consultasResponse.filter(
            c => !prev.some(prevItem => prevItem.id === c.id)
          );
          return [...atualizados, ...novosItens];
        });
        
        const tipoConsultas = consultasResponse.map(c => c.tipoConsulta);
        const tipoConsultasDistinct = Array.from(
          new Map(tipoConsultas.map(obj => [obj!.id, obj])).values()
        );
        
        const secoesAux = tipoConsultasDistinct.map(tipoConsulta => {
          return {
            id: tipoConsulta?.id || 0,
            secao: tipoConsulta?.nome || ''
          }
        })

        const secoesDistintas = Array.from(
          new Map([...secoes, ...secoesAux].map(obj => [obj.id, obj])).values()
        )

        setSecoes(secoesDistintas)
        setCarregando(false)
      }
    } catch(error){
      if (isAxiosError(error)) {
          console.error("⚠️ Axios error.code:", error.code);
          console.error("⚠️ Axios error.message:", error.message);
          console.error("⚠️ Axios error.request:", error.request);
          console.error("⚠️ Axios error.response:", error.response);
      } else {
          console.error("❌ Erro desconhecido:", error);
      }

      setCarregando(false);
      throw error;
    }
  }

  function carregarMaisConsultas(){
    if(carregando) return;

    if(!carregando && temMais){
      setPagina(prev => prev + 1)
    }
  }

  // useFocusEffect(
  //   useCallback(() => {
  //     buscaConsultasAgendadas()
  //   }, [])
  // )

  useEffect(() => {
    if(pagina > 1){
      buscaConsultasAgendadas()
    }
  }, [pagina])

  useEffect(() => {
    if(atualizarConsultas)
    {
      buscaConsultasAgendadas(true)
      setAtualizarConsultas(false);
    }
  }, [atualizarConsultas])

useFocusEffect(
  useCallback(() => {
      buscaConsultasAgendadas(true)

    return () => {};
  }, [])
);

  return (
    <>
      
      {
        consultas.length > 0 ? (
          <View style={[styles.topo, { flex: 1 }]}>
            <FlatList 
              style={{ marginTop: 16 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ minHeight: '100%' }}
              data={consultas}
              onEndReached={carregarMaisConsultas}
              onEndReachedThreshold={0.1} // 0.1 = 10% do final da lista
              onScrollEndDrag={carregarMaisConsultas}
              ListFooterComponent={
                carregando ? <ActivityIndicator style={{ margin: 20 }} /> : null
              }
              keyExtractor={(item) => item?.id?.toString()}
              renderItem={({item, index}) => <CardConsultaMarcada item={item} atualizarConsultas={() => setAtualizarConsultas(true)} recarregarConsultas={(reseta: boolean) => buscaConsultasAgendadas(reseta)}/>}
              refreshControl={
                <RefreshControl refreshing={carregando} onRefresh={() => !carregando ? buscaConsultasAgendadas(true) : null}/>
              }
            />
          </View>
        ) : (
          <ScrollView 
            contentContainerStyle={[
            styles.topo,
            { alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '100%' }
          ]}
            refreshControl={
              <RefreshControl refreshing={carregando} onRefresh={buscaConsultasAgendadas}/>
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} size={64} />
            <Text style={{ fontSize: 18, textAlign: 'center' }}> Você não possui consultas agendadas! </Text>
          </ScrollView>
        )
      }
    </>
  )
}

const styles = StyleSheet.create({
  topo: {
    padding: 32,
    paddingBottom: 48,
    backgroundColor: '#f8fafc',
    overflow: 'visible',
  }
})
