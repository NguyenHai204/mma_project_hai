import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, Dimensions } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

const avatars = [
  'https://tse4.mm.bing.net/th/id/OIP.o6io0uj0nN_B7DY3Ed_pBgHaHw?rs=1&pid=ImgDetMain&o=7&rm=3',
  // require('../assets/avatar1.png'),
  // require('../assets/avatar2.png'),
  // require('../assets/avatar3.png'),
  // require('../assets/avatar4.png'),
];

export default function ProfileScreen() {
  const { logout, user } = useContext(AuthContext);
  const [reminderOn, setReminderOn] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const status = await AsyncStorage.getItem('reminderOn');
      setReminderOn(status === 'true');

      const randomIndex = Math.floor(Math.random() * avatars.length);
      setAvatar(avatars[randomIndex]);
    };

    loadData();
  }, []);

  const toggleReminder = async () => {
    if (reminderOn) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setReminderOn(false);
      await AsyncStorage.setItem('reminderOn', 'false');
      Alert.alert('🔕 Đã tắt nhắc học');
    } else {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Không có quyền gửi thông báo!');
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();
          await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Học từ thôi!',
        body: 'Đây là thông báo test sau 5 giây',
      },
      trigger: { seconds: 5 }, 
    });

      setReminderOn(true);
      await AsyncStorage.setItem('reminderOn', 'true');
      Alert.alert('✅ Đã bật nhắc học mỗi ngày lúc 8h');
    }
  };

  return (
    <View style={styles.container}>
      {avatar && <Image source={avatar} style={styles.avatar} />}
      <Text style={styles.name}>{user?.name || 'Người dùng'}</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.reminderButton} onPress={toggleReminder}>
          <Text style={styles.buttonText}>
            {reminderOn ? '🔕 Tắt nhắc học mỗi ngày' : '🔔 Bật nhắc học mỗi ngày'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}> Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  buttonGroup: {
    width: screenWidth * 0.8,
    alignItems: 'center',
    gap: 15,
  },
  reminderButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  logoutText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
