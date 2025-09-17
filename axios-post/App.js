import React, {useState} from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import  axios from "axios";

//declarar a função do componente principal 'app'
export default function app(){
  //declarar a variavel de estado users
  const [users, setUsers] = useState([]);
  //declarar duas variaveis de estados utilizadas na entrada de dados
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");


  //declarar const 'api' = http://ip_local:3000/users 
  const API = "http://10.110.12.40:3000/users";

  //declarar uma funçao assincrona para fazer chamada post
  //para inserção de um novo usuario
  const addUser = async () =>{
    try{
      //fazer uma requisição de post para a url api  com o objetivo de enviar os dados do novo usuario
      const response = await axios.post(API,
        {name:newName, email:newEmail }
      );
      //se nao houver erro o comando abaixo sera executado
      setUsers([...users, response.data]);
      //limpa os campos que armazenava os dados
      setNewName("");
      setNewEmail("");
    }catch(error){
      console.error("Error POST: ", error.message);

    }
  };
  
  //define o return do APP
  return(
    <View style={Styles.container}>
      <Text style={Styles.title}> post adicionar usuario</Text>
      <TextInput
        style={Styles.input}
        placeholder="nome"
        value={newName}
        onChangeText={setNewName}
        />
        <TextInput
        style={Styles.input}
        placeholder="email"
        value={newEmail}
        onChangeText={setNewEmail}
        />
      <Button title="Adicionar Usuario" onPress={addUser}/>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item})=> (
          <Text>{item.name} - {item.email}</Text>
        )}
      />
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {flex:1, padding:20, marginTop:40},
  title: {fontSize:22, fontWeight:"bold", marginBottom:10},
  input: {borderWidth:1, borderColor:"#ccc", padding:8, marginBottom:8}
})
