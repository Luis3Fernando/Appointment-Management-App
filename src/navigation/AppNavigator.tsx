import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import Colors from "../constants/Colors";
import WelcomeScreen from "../screens/WelcomeScreen";
import UserFormScreen from "../screens/UserFormScreen";
import RepositoryScreen from "../screens/RepositoryScreen";
import LoginScreen from "../screens/LoginScreen";
import AdminListScreen from "../screens/AdminListScreen";
import AdminDetailScreen from "../screens/AdminDetailScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const UserTabs = () => {
  const { logout } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
          height: 100,
        },
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 22,
          color: Colors.primary,
        },
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity onPress={logout} style={{ marginLeft: 20 }}>
            <Ionicons name="chevron-back" size={30} color={Colors.primary} />
          </TouchableOpacity>
        ),
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 10,
        },
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
          height: 80,
          paddingTop: 10,
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: "#94A3B8",

        tabBarIcon: ({ focused, color }) => {
          let iconName: any;

          if (route.name === "Principal") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Repositorio") {
            iconName = focused ? "folder" : "folder-outline";
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Principal"
        component={UserFormScreen}
        options={{
          title: "Registro de Datos",
          tabBarLabel: "Principal",
        }}
      />
      <Tab.Screen
        name="Repositorio"
        component={RepositoryScreen}
        options={{
          title: "Repositorio",
          tabBarLabel: "Repositorio",
        }}
      />
    </Tab.Navigator>
  );
};

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ListaConsultas"
      component={AdminListScreen}
      options={{ title: "Panel Admin" }}
    />
    <Stack.Screen
      name="DetalleConsulta"
      component={AdminDetailScreen}
      options={{ title: "Detalle de Mensaje" }}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { role, isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {role === null ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : role === "admin" && isLoggedIn ? (
          <Stack.Screen name="AdminHome" component={AdminStack} />
        ) : (
          <Stack.Screen name="UserHome" component={UserTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
