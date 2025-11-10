import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import StudyScreen from '../screens/StudyScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminWordScreen from '../screens/AdminWordScreen';
import CategoryWordScreen from '../screens/CategoryWordScreen';
import { CategoryListScreen, LogoutScreen } from '../screens/AdminCategoryScreen';
import AddCategoryScreen from '../screens/AddCategoryScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const defaultHeaderOptions = {
  headerTitle: () => (
    <Image
      source={{ uri: 'https://png.pngtree.com/png-clipart/20230928/original/pngtree-education-school-logo-design-kids-student-learning-vector-png-image_12898111.png' }}
      style={{
        width: 200,
        height: 100,
        resizeMode: 'contain',
      }}
    />
  ),
  headerTitleAlign: 'center',
};


function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Study') iconName = 'book-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Study" component={StudyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Danh sách Category') iconName = 'list-outline';
          else if (route.name === 'Thêm Category') iconName = 'add-circle-outline';
          else if (route.name === 'Thống kê') iconName = 'bar-chart-outline';
          else if (route.name === 'Đăng xuất') iconName = 'log-out-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Danh sách Category" component={CategoryListScreen} />
      <Tab.Screen name="Thêm Category" component={AddCategoryScreen} />
      <Tab.Screen name="Thống kê" component={AdminDashboardScreen} />
      <Tab.Screen name="Đăng xuất" component={LogoutScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return (
      <Stack.Navigator screenOptions={defaultHeaderOptions}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng ký',headerShown: false  }} />
      </Stack.Navigator>
    );
  }

  if (user?.role === 'admin') {
    return (
      <Stack.Navigator screenOptions={defaultHeaderOptions}>
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
        <Stack.Screen
          name="AdminWordScreen"
          component={AdminWordScreen}
          options={({ route }) => ({
            title: route.params?.categoryName || 'Từ vựng',
          })}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>
      <Stack.Screen name="UserTabs" component={UserTabs} />
      <Stack.Screen
        name="CategoryWordScreen"
        component={CategoryWordScreen}
        options={{ title: 'Từ vựng theo chủ đề' }}
      />
    </Stack.Navigator>
  );
}
