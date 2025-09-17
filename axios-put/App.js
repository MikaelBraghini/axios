import React, {useEffect, useState} from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ViewComponent } from "react-native";
import  axios from "axios";

//declarar a função do componente principal 'app'
export default function app(){
  //declarar a variavel de estado users
  const [users, setUsers] = useState([]);

  //declarar const 'api' = http://ip_local:3000/users 
  const API = "http://10.110.12.40:3000/users";

  const fetchUsers = async () => {
    // atualiza o estado de user, com os dados recebidos de response
    setUsers(Response.data);
  };

  const updateUser = async (id) => {
    try{
      //usaremos axios.put e a url será criada dinamicamente com o 'id' do usuario

      const response = await axios.put('${API/${id}',
        {name:"nome atualizado", email:"email atualizado"}
      );

      //após a atualização do usuario os dados do usuario antigo e substituido pelo novo
      setUsers(users.map((u) => (u.id === id ? response.data : u)));

    }catch(error){
      console.error("error put: ", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //o que será renderizado na tela 
return(
  <View style={style.container}>
    <Text style={Style.title}>PUT - Atualizar Usuario </Text>
    <FlatList
    data={users}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({item}) => (
      <View style={style.userItem}>
        <Text>{item.name} - {item.email}</Text>
        <Button title="atualizar" onPress={() => updateUser(item.id)} />
     </View>
    )}
    />
  </View>
);
}

//definição dos estilos 
const styles = StyleSheet.create({
  container: {flex:1, padding:20, marginTop:40},
  title: {fontSize:22, fontWeight: "bold", marginBottom:10},
  userItem: {marginVertical:10}
})
