import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const AdminDetailScreen = ({ route }: any) => {
  const { consulta } = route.params;

  const handleReply = () => {
    const subject = `RE: Consulta - ${consulta.tematica}`;
    const body = `Hola ${consulta.nombres},\n\nRespecto a su consulta sobre ${consulta.tematica}...`;
    const url = `mailto:${consulta.correo}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch((err) =>
      console.error("Error al abrir correo", err)
    );
  };

  const DetailRow = ({ label, value, icon }: any) => (
    <View style={styles.detailRow}>
      <View style={styles.iconBackground}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || "No especificado"}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Información del Solicitante</Text>
          <DetailRow
            label="Nombres y Apellidos"
            value={`${consulta.nombres} ${consulta.apellidos}`}
            icon="person-outline"
          />
          <DetailRow
            label="Correo Electrónico"
            value={consulta.correo}
            icon="mail-outline"
          />
          <View style={styles.gridRow}>
            <View style={{ flex: 1 }}>
              <DetailRow
                label="Género"
                value={consulta.genero}
                icon="transgender-outline"
              />
            </View>
            <View style={{ flex: 1 }}>
              <DetailRow
                label="Edad"
                value={consulta.edad}
                icon="calendar-outline"
              />
            </View>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Detalles de la Consulta</Text>
          <DetailRow
            label="Área de Destino"
            value={consulta.area}
            icon="business-outline"
          />
          <DetailRow
            label="Entidad"
            value={consulta.entidad}
            icon="briefcase-outline"
          />
          <DetailRow
            label="Tipo de Consulta"
            value={consulta.tipoConsulta}
            icon="help-circle-outline"
          />
          <DetailRow
            label="Temática"
            value={consulta.tematica}
            icon="list-outline"
          />
        </View>
        <View style={styles.messageCard}>
          <Text style={styles.sectionTitle}>Descripción / Mensaje</Text>
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>{consulta.descripcion}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.replyButton} onPress={handleReply}>
          <Ionicons name="mail-unread-outline" size={24} color={Colors.white} />
          <Text style={styles.replyButtonText}>Responder vía Correo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.tertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  label: { fontSize: 12, color: Colors.gray, fontWeight: "600" },
  value: { fontSize: 15, color: Colors.black, fontWeight: "700", marginTop: 1 },
  gridRow: { flexDirection: "row" },
  messageCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageContent: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 15,
    marginTop: 5,
  },
  messageText: {
    fontSize: 16,
    color: Colors.black,
    lineHeight: 24,
    fontStyle: "italic",
  },
  replyButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  replyButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
