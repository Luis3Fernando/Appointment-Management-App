import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useAuth } from "../hooks/useAuth";

type RootStackParamList = {
  Login: undefined;
};
type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

const { width } = Dimensions.get("window");

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { loginAsUser } = useAuth();

  const handlePressUsuario = () => {
    loginAsUser();
  };

  const handlePressAdmin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.logoOuterRing}>
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../assets/logo-company.jpg")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Sistema de gestión y consultas</Text>
        </View>
        <View style={styles.bottomSection}>
          <Text style={styles.helperText}>Seleccione su método de acceso:</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handlePressUsuario}
              activeOpacity={0.85}
            >
              <View style={styles.buttonContentWrapper}>
                <Ionicons
                  name="person-circle-outline"
                  size={32}
                  color={Colors.white}
                  style={styles.iconSpacing}
                />
                <View>
                  <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
                    Portal de Usuario
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={handlePressAdmin}
              activeOpacity={0.7}
            >
              <View style={styles.buttonContentWrapperCentered}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={24}
                  color={Colors.primary}
                  style={styles.iconSpacingSmall}
                />
                <Text style={[styles.buttonText, styles.buttonTextOutline]}>
                  Acceso Administrativo
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 24,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  logoOuterRing: {
    padding: 4,
    backgroundColor: Colors.border,
    borderRadius: 28,
    marginBottom: 35,
  },
  logoWrapper: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.gray,
    textAlign: "center",
    fontWeight: "500",
  },
  bottomSection: {
    marginBottom: 40,
  },
  helperText: {
    textAlign: "center",
    color: Colors.gray,
    marginBottom: 25,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  buttonContainer: {
    gap: 18,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 50,
  },
  buttonContentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContentWrapperCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconSpacing: {
    marginRight: 16,
  },
  iconSpacingSmall: {
    marginRight: 10,
  },
  buttonPrimary: {
    backgroundColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  buttonTextPrimary: {
    color: Colors.white,
  },
  buttonSubtext: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 2,
    fontWeight: "400",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonTextOutline: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
