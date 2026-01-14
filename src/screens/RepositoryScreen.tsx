import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const DOCS = [
  { id: '1', title: 'Manual de Usuario V1', type: 'PDF', url: 'https://google.com' },
  { id: '2', title: 'Normativa de Consultas 2025', type: 'Link', url: 'https://google.com' },
  { id: '3', title: 'Guía de Áreas Internas', type: 'PDF', url: 'https://google.com' },
  { id: '4', title: 'Preguntas Frecuentes', type: 'Link', url: 'https://google.com' },
];

const RepositoryScreen = () => {

  const handleOpenDoc = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Error al abrir URL", err));
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleOpenDoc(item.url)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={item.type === 'PDF' ? "document-text" : "link"} 
          size={28} 
          color={Colors.primary} 
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.docTitle}>{item.title}</Text>
        <Text style={styles.docSubtitle}>{item.type} • Tocar para abrir</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Documentación y enlaces de interés.</Text>
      </View>
      <FlatList
        data={DOCS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default RepositoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { padding: 10, backgroundColor: Colors.white},
  title: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  subtitle: { fontSize: 14, color: Colors.gray, marginTop: 4 },
  listContent: { padding: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiary,
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.white, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContainer: { flex: 1 },
  docTitle: { fontSize: 16, fontWeight: '700', color: Colors.black },
  docSubtitle: { fontSize: 12, color: Colors.gray, marginTop: 2 },
});