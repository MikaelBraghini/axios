import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, StyleSheet, Button } from "react-native"
import api from './src/device/api';

//declaração do componente principal da aplicação 'app'
export default function app() {
  //'users' e 'setUser' são a variável e a função de atualização repectivamente 
  const [users, setUsers] = useState([]);

  const API = "http://10.110.12.93:3000/user";

  // função assicrona para buscar os usuarios da api
  // 'async/await - simplifica acesso ao serviço de API
  async function fetchUsers() {
    try {
      //faz uma requisição get ára a url da api
      const response = await api.get(API)
      //se bem- sucedida
      setUsers(response.data);
    } catch (error) {
      //se ocorrer erro (ex:falha na conexão), exibe uma mensagem de erro 
      console.error("Error get:", error.mensagem);
    }
  };

  useEffect(() => {
  fetchUsers();
  }, [])

  const _render = () => {

    const vet = [];

    users.map((item, index) => {
      vet.push(
        <View key={index}>
          <Text style={styles.item}>ID:{item.id} Nome:{item.nome} Emai: {item.email},</Text>
        </View>
      )
    })
    return vet;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>get - listar usuarios</Text>
      <Button title="recarregar lista" onPress={fetchUsers} />
      <ScrollView>  
        {_render()}
      </ScrollView>
    </View>
  );

}

//styles utilizados no projeto 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  item: { fontSize: 20, marginTop: 10 }
});