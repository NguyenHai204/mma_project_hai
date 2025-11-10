import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';

export default function AddCategoryScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  const handleAdd = async () => {
    if (!name.trim() || !backgroundImage.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên và ảnh nền');
      return;
    }

    try {
      await axios.post(
        '/api/categories',
        { name, backgroundImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Thành công', 'Đã thêm category');
      setName('');
      setBackgroundImage('');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Lỗi', err.response?.data?.message || 'Không thêm được category');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Thêm Category Mới</Text>

        <TextInput
          placeholder="Tên category"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Link ảnh nền (background)"
          value={backgroundImage}
          onChangeText={setBackgroundImage}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Thêm Category</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  inner: {
    padding: 20,
    paddingTop: 40, // 👈 Đẩy nội dung xuống chút
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
