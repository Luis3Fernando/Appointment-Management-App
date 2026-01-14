import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const InputField = ({
  label,
  icon,
  name,
  formData,
  handleChange,
  placeholder,
  multiline = false,
}: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View
      style={[styles.inputContainer, multiline && styles.textAreaContainer]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={Colors.primary}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder}
        value={formData ? formData[name] : ""}
        onChangeText={(text) => handleChange(name, text)}
        multiline={multiline}
        placeholderTextColor="#94A3B8"
      />
    </View>
  </View>
);
const SelectField = ({ label, icon, name, value, openSelector }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity
      style={styles.inputContainer}
      onPress={() => openSelector(name)}
    >
      <Ionicons
        name={icon}
        size={20}
        color={Colors.primary}
        style={styles.icon}
      />
      <Text style={[styles.selectText, !value && { color: "#94A3B8" }]}>
        {value || `Seleccione ${label.toLowerCase()}`}
      </Text>
      <Ionicons name="chevron-down" size={20} color={Colors.primary} />
    </TouchableOpacity>
  </View>
);

const UserFormScreen = () => {
  const { role, isLoggedIn } = useSelector(
    (state: RootState) => state.auth || { role: null, isLoggedIn: false }
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    edad: "",
    genero: "",
    area: "",
    entidad: "",
    tipoConsulta: "",
    tematica: "",
    descripcion: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<keyof typeof formData | null>(
    null
  );

  const options = {
    genero: ["Masculino", "Femenino", "Otro", "Prefiero no decirlo"],
    edad: ["18-25", "26-35", "36-45", "46-60", "60+"],
    area: ["Sistemas", "Recursos Humanos", "Administración", "Ventas"],
    entidad: ["Entidad Pública", "Empresa Privada", "ONG", "Particular"],
    tipoConsulta: ["Reclamo", "Sugerencia", "Información", "Otros"],
    tematica: ["Tecnología", "Laboral", "Legal", "Salud"],
  };

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectOption = (option: string) => {
    if (activeField) handleChange(activeField, option);
    setModalVisible(false);
  };

  const openSelector = (field: keyof typeof formData) => {
    setActiveField(field);
    setModalVisible(true);
  };

  const validate = () => {
    if (!formData) return false;

    return Object.values(formData).every((val) => {
      return val !== null && val !== undefined && val.trim() !== "";
    });
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert("Error", "Por favor, rellene todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Éxito", "Su consulta ha sido enviada correctamente.", [
        {
          text: "OK",
          onPress: () =>
            setFormData({
              nombres: "",
              apellidos: "",
              correo: "",
              edad: "",
              genero: "",
              area: "",
              entidad: "",
              tipoConsulta: "",
              tematica: "",
              descripcion: "",
            }),
        },
      ]);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerSubtitle}>
          Complete la información para procesar su solicitud.
        </Text>
        <View style={styles.formCard}>
          <InputField
            label="Nombres"
            icon="person-outline"
            name="nombres"
            placeholder="Nombres"
            formData={formData}
            handleChange={handleChange}
          />
          <InputField
            label="Apellidos"
            icon="person-outline"
            name="apellidos"
            placeholder="Apellidos"
            formData={formData}
            handleChange={handleChange}
          />
          <InputField
            label="Correo Electrónico"
            icon="mail-outline"
            name="correo"
            placeholder="correo@ejemplo.com"
            formData={formData}
            handleChange={handleChange}
          />
          <SelectField
            label="Género"
            icon="transgender-outline"
            name="genero"
            value={formData.genero}
            openSelector={openSelector}
          />
          <SelectField
            label="Edad"
            icon="calendar-outline"
            name="edad"
            value={formData.edad}
            openSelector={openSelector}
          />
          <SelectField
            label="Área"
            icon="business-outline"
            name="area"
            value={formData.area}
            openSelector={openSelector}
          />
          <SelectField
            label="Entidad"
            icon="briefcase-outline"
            name="entidad"
            value={formData.entidad}
            openSelector={openSelector}
          />
          <SelectField
            label="Tipo de Consulta"
            icon="help-circle-outline"
            name="tipoConsulta"
            value={formData.tipoConsulta}
            openSelector={openSelector}
          />
          <SelectField
            label="Temática"
            icon="list-outline"
            name="tematica"
            value={formData.tematica}
            openSelector={openSelector}
          />
          <InputField
            label="Descripción de la Consulta"
            icon="document-text-outline"
            name="descripcion"
            placeholder="Detalle su consulta aquí..."
            multiline={true}
            formData={formData}
            handleChange={handleChange}
          />

          <TouchableOpacity
            style={[styles.submitButton, !validate() && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitText}>Enviar Formulario</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            <View style={styles.modalHeader}>
              <Ionicons
                name="list-circle-outline"
                size={28}
                color={Colors.primary}
              />
              <Text style={styles.modalTitle}>Seleccione una opción</Text>
            </View>
            <View style={styles.separator} />
            <FlatList
              data={activeField ? (options as any)[activeField] || [] : []}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    formData[activeField as keyof typeof formData] === item &&
                      styles.selectedOptionItem,
                  ]}
                  onPress={() => handleSelectOption(item)}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData[activeField as keyof typeof formData] === item &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                  {formData[activeField as keyof typeof formData] === item && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={Colors.secondary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default UserFormScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 5,
  },
  headerSubtitle: { fontSize: 14, color: Colors.gray, marginBottom: 25 },
  formCard: {},
  inputGroup: { marginBottom: 18 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 55,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: Colors.black, fontSize: 16 },
  selectText: { flex: 1, fontSize: 16, color: Colors.black },
  textAreaContainer: { height: 120, alignItems: "flex-start", paddingTop: 12 },
  textArea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row" },
  submitButton: {
    backgroundColor: Colors.secondary,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: { backgroundColor: Colors.gray },
  submitText: { color: Colors.white, fontSize: 18, fontWeight: "700" },
  closeButton: { marginTop: 15, padding: 10 },
  closeButtonText: {
    color: Colors.error,
    textAlign: "center",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: Platform.OS === "ios" ? 40 : 25,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 15,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 10,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 4,
  },
  selectedOptionItem: {
    backgroundColor: Colors.background,
  },
  optionText: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: "500",
  },
  selectedOptionText: {
    color: Colors.secondary,
    fontWeight: "700",
  },
  modalCloseButton: {
    marginTop: 15,
    backgroundColor: Colors.background,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalCloseButtonText: {
    color: Colors.gray,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
