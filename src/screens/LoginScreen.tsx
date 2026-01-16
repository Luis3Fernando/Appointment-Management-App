import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useAuth } from "../hooks/useAuth";
import { ADMIN_CREDENTIALS } from "../constants/Config";

const LoginScreen = () => {
  const { loginAsAdmin } = useAuth();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ visible: false, message: "" });

  const handleLogin = () => {
    const cleanUser = user.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorModal({
        visible: true,
        message: "Por favor, complete todos los campos.",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (cleanUser === ADMIN_CREDENTIALS.user && cleanPass === ADMIN_CREDENTIALS.password) {
        loginAsAdmin();
      } else {
        setErrorModal({
          visible: true,
          message:
            "Las credenciales ingresadas no son válidas. Intente nuevamente.",
        });
        setPassword("");
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../assets/logo-company.jpg")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Acceso Admin</Text>
            <Text style={styles.subtitle}>
              Ingrese sus credenciales de consultoría
            </Text>
          </View>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Usuario</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={Colors.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de usuario"
                  value={user}
                  onChangeText={setUser}
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.gray}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={Colors.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.8 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Modal visible={errorModal.visible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Ionicons name="alert-circle" size={60} color={Colors.error} />
              <Text style={styles.modalTitle}>Error de Acceso</Text>
              <Text style={styles.modalText}>{errorModal.message}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setErrorModal({ ...errorModal, visible: false })}
              >
                <Text style={styles.modalButtonText}>Intentar de nuevo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { flex: 1, padding: 30, justifyContent: "center" },
  headerContainer: { alignItems: "center", marginBottom: 40 },
  logoWrapper: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 22,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  logo: { width: 100, height: 100 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 5,
  },
  subtitle: { fontSize: 15, color: Colors.gray, textAlign: "center" },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: Colors.black },
  loginButton: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
  },
  loginButtonText: { color: Colors.white, fontSize: 18, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  modalCard: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.black,
    marginTop: 15,
  },
  modalText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
    marginVertical: 15,
  },
  modalButton: {
    backgroundColor: Colors.error,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  modalButtonText: { color: Colors.white, fontWeight: "700" },
});
