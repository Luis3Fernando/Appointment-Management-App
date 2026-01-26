import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../constants/Colors";
import { useAppointments } from "../hooks/useAppointments";

const AREAS = ["Todos", "Sistemas", "Electronica", "Arquitectura", "Recursos Humanos"];

const AdminListScreen = () => {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState("Todos");
  const { data, loading, error, fetchAppointments } = useAppointments();

  useEffect(() => {
    fetchAppointments(filter);
  }, [filter]);

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <View style={styles.row}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.nombres} {item.apellidos}
          </Text>
          <View style={styles.areaBadge}>
            <Text style={styles.areaBadgeText}>{item.area}</Text>
          </View>
        </View>
        <Text style={styles.userMail}>{item.correo}</Text>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={Colors.gray} />
          <Text style={styles.dateText}>{formatDate(item.fechaCreacion)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => navigation.navigate("DetalleConsulta", { consulta: item })}
      >
        <Ionicons name="chevron-forward-circle" size={35} color={Colors.secondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filtrar por Área:</Text>
        <FlatList
          horizontal
          data={AREAS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterPill, filter === item && styles.filterPillActive]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterPillText, filter === item && styles.filterPillTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {loading && data.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Sincronizando consultas...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cloud-offline-outline" size={50} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchAppointments(filter)}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data}
         keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => fetchAppointments(filter)} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="documents-outline" size={50} color={Colors.border} />
              <Text style={styles.emptyText}>No hay consultas registradas.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default AdminListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: Colors.primary, fontWeight: '600' },
  errorText: { color: Colors.error, textAlign: 'center', marginTop: 10, fontSize: 16 },
  retryButton: { marginTop: 20, backgroundColor: Colors.primary, paddingHorizontal: 25, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: Colors.white, fontWeight: '700' },
  filterSection: {
    backgroundColor: Colors.white,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
    marginLeft: 20,
    marginBottom: 10,
  },
  filterList: { paddingHorizontal: 15 },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: { color: Colors.gray, fontWeight: "600", fontSize: 13 },
  filterPillTextActive: { color: Colors.white },
  listContainer: { padding: 20, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  cardInfo: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  userName: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.black,
    marginRight: 10,
  },
  areaBadge: {
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  areaBadgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: Colors.primary,
    textTransform: "uppercase",
  },
  userMail: { fontSize: 14, color: Colors.gray, marginBottom: 8 },
  dateRow: { flexDirection: "row", alignItems: "center" },
  dateText: { fontSize: 12, color: Colors.gray, marginLeft: 4 },
  detailButton: { marginLeft: 10 },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { color: Colors.gray, marginTop: 10, fontSize: 16 },
});
