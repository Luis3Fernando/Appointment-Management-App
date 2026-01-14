import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';

import WelcomeScreen from '../screens/WelcomeScreen';
import UserFormScreen from '../screens/UserFormScreen';
import RepositoryScreen from '../screens/RepositoryScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminListScreen from '../screens/AdminListScreen';
import AdminDetailScreen from '../screens/AdminDetailScreen';
import { TouchableOpacity, Text } from 'react-native';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const UserTabs = () => {
  const { logout } = useAuth(); 

  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity 
            onPress={logout} 
            style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            <Text style={{ color: Colors.primary, marginLeft: 5, fontWeight: '600' }}>Volver</Text>
          </TouchableOpacity>
        )
      }}
    >
      <Tab.Screen name="Formulario" component={UserFormScreen} options={{ title: 'Enviar Datos' }} />
      <Tab.Screen name="Repositorio" component={RepositoryScreen} options={{ title: 'Documentos' }} />
    </Tab.Navigator>
  );
};

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ListaConsultas" component={AdminListScreen} options={{ title: 'Panel Admin' }} />
    <Stack.Screen name="DetalleConsulta" component={AdminDetailScreen} options={{ title: 'Detalle de Mensaje' }} />
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
        ) : role === 'admin' && isLoggedIn ? (
          <Stack.Screen name="AdminHome" component={AdminStack} />
        ) : (
          <Stack.Screen name="UserHome" component={UserTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};