import CardLoaderConsultas from "@/components/Loaders/CardLoaderConsultas/CardLoaderConsultas";
import Card from "@/components/TipoConsultas/Card";
import { TipoConsultas } from "@/interfaces/Consultas/TipoConsultas";
import { buscarTipoConsultas } from "@/services/consultas/consultas-service";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";

export default function TipoConsultasPagina() {
  const [tipoConsultas, setTipoConsultas] = useState<TipoConsultas[]>([]);
  const [tipoConsultasBackup, setTipoConsultasBackup] = useState<TipoConsultas[]>([]);
  const [nomeTipoConsultas, setNomeTipoConsultas] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const receberConsultasFiltradas = (nomeConsulta: string) => {
    setNomeTipoConsultas(nomeConsulta)
    var tipoConsultasFiltradas = tipoConsultasBackup.filter(c => c.nome.toLowerCase().includes(nomeConsulta.toLowerCase()));
    setTipoConsultas(tipoConsultasFiltradas);
  }

  const carregarTipoConsultas = async () => {
    setLoading(true);
    try {
      const tipoConsultasResponse = await buscarTipoConsultas();
      if(!tipoConsultasResponse || tipoConsultasResponse.length === 0){
        showMessage({
            message: "Ainda não existem procedimentos para consulta.",
            type: "info" 
        })

        setLoading(false);
        return;
      }
      setTipoConsultas(tipoConsultasResponse);
      setTipoConsultasBackup(tipoConsultasResponse);
      setLoading(false)
    } catch(error){
      if (isAxiosError(error)) {
          console.error("⚠️ Axios error.code:", error.code);
          console.error("⚠️ Axios error.message:", error.message);
          console.error("⚠️ Axios error.request:", error.request);
          console.error("⚠️ Axios error.response:", error.response);
      } else {
          console.error("❌ Erro desconhecido:", error);
      }
      
      setLoading(false);
      throw error;
    }
  }

  const recarregarConsultas = async () => {
    setLoading(true);
    await carregarTipoConsultas();
    setLoading(false)
  }

  useEffect(() => {
    carregarTipoConsultas();
  }, [])

  return (
    <>
      {
        tipoConsultas.length > 0 ? (
          <ScrollView
            contentContainerStyle={styles.listaConsultas}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={carregarTipoConsultas}/>
            }
            showsVerticalScrollIndicator={false}>
            { loading ? (
              Array.from({ length: 5}).map((_, index) => {
                return <CardLoaderConsultas key={index}/>
              })
            ) : (
              tipoConsultas && tipoConsultas.map((tipoConsulta, index) => {
                return <Card key={index} tipo="tipoConsulta" preencher={false} card={tipoConsulta} recarregarItens={recarregarConsultas} />
              })
            )}
          </ScrollView>
        ) : (
          <ScrollView 
            contentContainerStyle={{ padding: 32, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginVertical: 'auto', backgroundColor: '#f8fafc', flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={carregarTipoConsultas}/>
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} size={64} />
            <Text style={{ fontSize: 18, textAlign: 'center' }}> Não há procedimentos cadastrados! </Text>
          </ScrollView>
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
  topo: {
    padding: 32,
    paddingBottom: 0,
    backgroundColor: '#f8fafc',
    overflow: 'visible',
  },

  listaConsultas: {
    paddingTop: 32,
    padding: 32,
    paddingBottom: 400,
    backgroundColor: '#f8fafc'
  }
})