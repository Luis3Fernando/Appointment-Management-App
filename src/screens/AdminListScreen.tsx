import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../constants/Colors";
const DATA_MOCK = [
  {
    id: "1",
    nombres: "Juan",
    apellidos: "Pérez",
    correo: "juan@mail.com",
    area: "Sistemas",
    fecha: "12/01/2026",
    tematica: "Falla de Red",
  },
  {
    id: "2",
    nombres: "Maria",
    apellidos: "Lopez",
    correo: "m.lopez@mail.com",
    area: "Recursos Humanos",
    fecha: "13/01/2026",
    tematica: "Duda Planilla",
  },
  {
    id: "3",
    nombres: "Carlos",
    apellidos: "Ruiz",
    correo: "cruiz@mail.com",
    area: "Administración",
    fecha: "13/01/2026",
    tematica: "Pedido de Insumos",
  },
  {
    id: "4",
    nombres: "Ana",
    apellidos: "Soto",
    correo: "asoto@mail.com",
    area: "Sistemas",
    fecha: "10/01/2026",
    tematica: "Acceso ERP",
  },
  {
    id: "5",
    nombres: "Luis",
    apellidos: "Gomez",
    correo: "lgomez@mail.com",
    area: "Ventas",
    fecha: "09/01/2026",
    tematica: "Comisiones",
  },
];

const AREAS = [
  "Todos",
  "Sistemas",
  "Recursos Humanos",
  "Administración",
  "Ventas",
];

const AdminListScreen = () => {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState("Todos");

  const filteredData = useMemo(() => {
    if (filter === "Todos") return DATA_MOCK;
    return DATA_MOCK.filter((item) => item.area === filter);
  }, [filter]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <View style={styles.row}>
          <Text style={styles.userName}>
            {item.nombres} {item.apellidos}
          </Text>
          <View style={styles.areaBadge}>
            <Text style={styles.areaBadgeText}>{item.area}</Text>
          </View>
        </View>

        <Text style={styles.userMail}>{item.correo}</Text>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={Colors.gray} />
          <Text style={styles.dateText}>{item.fecha}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.detailButton}
        onPress={() =>
          navigation.navigate("DetalleConsulta", { consulta: item })
        }
      >
        <Ionicons
          name="chevron-forward-circle"
          size={35}
          color={Colors.secondary}
        />
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
              style={[
                styles.filterPill,
                filter === item && styles.filterPillActive,
              ]}
              onPress={() => setFilter(item)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filter === item && styles.filterPillTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={50} color={Colors.border} />
            <Text style={styles.emptyText}>No hay consultas en esta área.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default AdminListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
    fontSize: 10,
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
