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
import { useAppointments } from "../hooks/useAppointments";
import { Appointment } from "../services/appointmentService";

const InputField = ({
  label,
  icon,
  name,
  formData,
  handleChange,
  placeholder,
  multiline = false,
  keyboardType = "default",
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
        keyboardType={keyboardType}
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

const initialFormState = {
  entidad: "",
  nombreCompleto: "",
  cargo: "",
  correo: "",
  celular: "",
  genero: "",
  edad: "",
  cui: "",
  area: "",
  tipoConsulta: "",
  tematica: "",
  descripcion: "",
};

const UserFormScreen = () => {
  const { role, isLoggedIn } = useSelector(
    (state: RootState) => state.auth || { role: null, isLoggedIn: false },
  );
  const { createNewAppointment, loading: apiLoading } = useAppointments();
  const [formData, setFormData] = useState({
    entidad: "",
    nombreCompleto: "",
    cargo: "",
    correo: "",
    celular: "",
    genero: "",
    edad: "",
    cui: "",
    area: "",
    tipoConsulta: "",
    tematica: "",
    descripcion: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<keyof typeof formData | null>(
    null,
  );

  const options = {
    genero: ["Masculino", "Femenino"],
    area: ["Contrataciones", "Invierte", "Ejecución", "Presupuesto"],
    entidad: [
      "Municipalidad distrital de Progreso",
      "Municipalidad distrital de Challhuahuacho",
      "Municipalidad distrital de Colquemarca",
      "Municipalidad distrital de Velille",
      "Municipalidad distrital de Coporaque",
      "Municipalidad distrital de Condoroma",
      "Municipalidad distrital de Mara",
      "Municipalidad distrital de Capacmarca",
      "Municipalidad provincial de Tambobamba",
      "Municipalidad distrital de Coyllurqui",
      "Municipalidad distrital de Haquira",
      "Municipalidad distrital de Cotabambas",
    ],
    tipoConsulta: [
      "Asistencia técnica",
      "Consulta",
      "Capacitación",
      "Reunión de coordinación",
    ],
    tematica: [
      "Procedimiento de selección",
      "Liquidación de obra",
      "Ejecución física de obra",
      "Requerimiento",
    ],
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleChange = (name: string, value: string) => {
    if (name === "edad") {
      const cleanValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: cleanValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      Alert.alert("Campos Incompletos", "Por favor, rellene todos los campos.");
      return;
    }

    const nameParts = formData.nombreCompleto.trim().split(/\s+/);
    let nombres = "";
    let apellidos = "";

    if (nameParts.length >= 4) {
      nombres = nameParts.slice(0, 2).join(" ");
      apellidos = nameParts.slice(2).join(" ");
    } else if (nameParts.length === 3) {
      nombres = nameParts[0];
      apellidos = nameParts.slice(1).join(" "); 
    } else {
      nombres = nameParts[0] || "";
      apellidos = nameParts.slice(1).join(" ") || "---";
    }

    const descripcionEnriquecida = `
  [Cargo: ${formData.cargo}] 
  [CUI: ${formData.cui}] 
  [Celular: ${formData.celular}]
  ---------------------------
  ${formData.descripcion}`;
    const apiPayload: Appointment = {
      nombres: nombres,
      apellidos: apellidos,
      correo: formData.correo,
      edad: parseInt(formData.edad, 10),
      genero: formData.genero,
      area: formData.area,
      entidad: formData.entidad,
      tipoConsulta: formData.tipoConsulta,
      tematica: formData.tematica,
      descripcion: descripcionEnriquecida,
    };

    const result = await createNewAppointment(apiPayload);

    if (result.success) {
      Alert.alert("¡Envío Exitoso!", "Su solicitud ha sido procesada.");
      resetForm();
    } else {
      Alert.alert("Error", result.message);
    }
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
          <SelectField
            label="Entidad"
            icon="briefcase-outline"
            name="entidad"
            value={formData.entidad}
            openSelector={openSelector}
          />
          <InputField
            label="Nombres y apellidos"
            icon="person-outline"
            name="nombreCompleto"
            placeholder="Nombres y apellidos"
            formData={formData}
            handleChange={handleChange}
          />
          <InputField
            label="Cargo"
            icon="person-outline"
            name="cargo"
            placeholder="Escriba su cargo"
            formData={formData}
            handleChange={handleChange}
          />
          <InputField
            label="Correo electrónico"
            icon="mail-outline"
            name="correo"
            placeholder="correo@ejemplo.com"
            formData={formData}
            handleChange={handleChange}
          />
          <InputField
            label="Número de celular"
            icon="call-outline"
            name="celular"
            placeholder="000"
            formData={formData}
            handleChange={handleChange}
            keyboardType="numeric"
          />
          <SelectField
            label="Género"
            icon="transgender-outline"
            name="genero"
            value={formData.genero}
            openSelector={openSelector}
          />
          <InputField
            label="Edad"
            icon="calendar-outline"
            name="edad"
            placeholder="Ej. 25"
            formData={formData}
            handleChange={handleChange}
            keyboardType="numeric"
          />
          <InputField
            label="Codigo Único de Inversión (CUI)"
            icon="keypad-outline"
            name="cui"
            placeholder="CUI"
            formData={formData}
            handleChange={handleChange}
            keyboardType="numeric"
          />
          <SelectField
            label="Temática"
            icon="business-outline"
            name="area"
            value={formData.area}
            openSelector={openSelector}
          />
          <SelectField
            label="Tipo de actividad"
            icon="help-circle-outline"
            name="tipoConsulta"
            value={formData.tipoConsulta}
            openSelector={openSelector}
          />
          <SelectField
            label="Tema específico"
            icon="list-outline"
            name="tematica"
            value={formData.tematica}
            openSelector={openSelector}
          />
          <InputField
            label="Descripción solicitud"
            icon="document-text-outline"
            name="descripcion"
            placeholder="Detalle su solicitud aquí..."
            multiline={true}
            formData={formData}
            handleChange={handleChange}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!validate() || apiLoading) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={apiLoading}
          >
            {apiLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitText}>Enviar solicitud</Text>
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
