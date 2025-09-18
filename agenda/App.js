import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform, // Import Platform API
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:3000/compromissos';

export default function App() {
  const [compromissos, setCompromissos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [anotacoes, setAnotacoes] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    fetchCompromissos();
  }, []);

  const fetchCompromissos = async () => {
    try {
      const response = await axios.get(API_URL);
      setCompromissos(response.data);
    } catch (error) {
      console.error('Erro ao buscar compromissos:', error);
      Alert.alert('Erro', 'Não foi possível buscar os compromissos.');
    }
  };

  const handleSaveCompromisso = async () => {
    if (!titulo || !data || !hora) {
      Alert.alert('Erro', 'Título, data e hora são obrigatórios.');
      return;
    }
    const compromissoData = {
      titulo,
      anotacoes,
      data,
      hora,
      status: editingId ? compromissos.find(c => c.id === editingId).status : 'pendente',
    };
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, compromissoData);
      } else {
        await axios.post(API_URL, compromissoData);
      }
      clearForm();
      fetchCompromissos();
    } catch (error) {
      console.error('Erro ao salvar compromisso:', error);
      Alert.alert('Erro', 'Não foi possível salvar o compromisso.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitulo(item.titulo);
    setAnotacoes(item.anotacoes);
    setData(item.data);
    setHora(item.hora);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCompromissos();
    } catch (error) {
      console.error('Erro ao deletar compromisso:', error);
      Alert.alert('Erro', 'Não foi possível remover o compromisso.');
    }
  };

  const handleStatusChange = async (item) => {
    const statuses = ['pendente', 'agendado', 'concluido'];
    const currentStatusIndex = statuses.indexOf(item.status);
    const nextStatus = statuses[(currentStatusIndex + 1) % statuses.length];
    try {
      await axios.patch(`${API_URL}/${item.id}`, { status: nextStatus });
      fetchCompromissos();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      Alert.alert('Erro', 'Não foi possível alterar o status.');
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setTitulo('');
    setAnotacoes('');
    setData('');
    setHora('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.titulo}</Text>
        {item.anotacoes ? <Text style={styles.itemSubtitle}>{item.anotacoes}</Text> : null}
        <Text style={styles.itemDate}>{item.data} às {item.hora}</Text>
        <TouchableOpacity onPress={() => handleStatusChange(item)} style={styles.statusTouchable}>
          <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
            <Text style={[styles.statusText, styles[`statusText_${item.status}`]]}>{item.status}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Agenda</Text>

        {/* FORMULÁRIO */}
        <View style={[styles.card, styles.formCard]}>
          <TextInput style={styles.input} placeholder="Título do compromisso" value={titulo} onChangeText={setTitulo} placeholderTextColor="#94a3b8" />
          <TextInput style={styles.input} placeholder="Anotações adicionais" value={anotacoes} onChangeText={setAnotacoes} placeholderTextColor="#94a3b8" />
          <TextInput style={styles.input} placeholder="Data (AAAA-MM-DD)" value={data} onChangeText={setData} placeholderTextColor="#94a3b8" />
          <TextInput style={styles.input} placeholder="Hora (HH:MM)" value={hora} onChangeText={setHora} placeholderTextColor="#94a3b8" />
          <View style={styles.formButtons}>
            {editingId && (
              <TouchableOpacity style={styles.secondaryButton} onPress={clearForm}>
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.primaryButton} onPress={handleSaveCompromisso}>
              <Text style={styles.buttonText}>{editingId ? 'Atualizar' : 'Salvar'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={compromissos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListHeaderComponent={<Text style={styles.listHeader}>Meus Compromissos</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const colors = {
  background: '#f8fafc', 
  card: '#ffffff', 
  textPrimary: '#0f172a', 
  textSecondary: '#64748b', 
  border: '#e2e8f0', 
  primary: '#3b82f6', 
  destructive: '#ef4444', 

  status_pendente_bg: '#fef9c3',
  status_pendente_text: '#854d0e',
  status_agendado_bg: '#dbeafe',
  status_agendado_text: '#1e40af',
  status_concluido_bg: '#dcfce7',
  status_concluido_text: '#166534',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'center',
    maxWidth: 800, 
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginVertical: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formCard: {
    gap: 12, 
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    marginTop: 16,
  },
  list: {
    width: '100%',
  },
  // Estilos do Item da Lista
  itemContent: {
    flex: 1,
    gap: 6,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  itemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemDate: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  statusTouchable: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999, // Pill shape
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  // Cores das Badges de Status
  status_pendente: { backgroundColor: colors.status_pendente_bg },
  statusText_pendente: { color: colors.status_pendente_text },
  status_agendado: { backgroundColor: colors.status_agendado_bg },
  statusText_agendado: { color: colors.status_agendado_text },
  status_concluido: { backgroundColor: colors.status_concluido_bg },
  statusText_concluido: { color: colors.status_concluido_text },

  // Ações do Item
  itemActions: {
    justifyContent: 'center',
    gap: 10,
  },
  editButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: colors.destructive,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});