import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import FormButton from '../components/FormButton';
import ErrorText from '../components/ErrorText';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !name || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    try {
      setError('');
      await register(name, email, password);
      navigation.navigate('Login');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại.');
    }
  };

  return (
    <ImageBackground
      source={{ 
        uri: 'https://giacmouc.com/images/202004/10-cach-tao-dong-luc-hoc-tap-tot-nhat-duy-tri-cam-hung-suot-hoc-ky/10-cach-tao-dong-luc-hoc-tap-tot-nhat-duy-tri-cam-hung-suot-hoc-ky.jpg' 
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Đăng ký</Text>

        {/* ✅ Email Input */}
        <View style={styles.inputWrapper}>
          <Icon name="email" size={20} color="#4CAF50" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* ✅ Name Input */}
        <View style={styles.inputWrapper}>
          <Icon name="person" size={20} color="#4CAF50" style={styles.icon} />
          <TextInput
            placeholder="Tên hiển thị"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        {/* ✅ Password Input with Eye Icon */}
        <View style={styles.inputWrapper}>
          <Icon name="lock" size={20} color="#4CAF50" style={styles.icon} />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)} 
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#4CAF50"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ Confirm Password Input with Eye Icon */}
        <View style={styles.inputWrapper}>
          <Icon name="lock" size={20} color="#4CAF50" style={styles.icon} />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
              style={styles.eyeIcon}
            >
              <Icon
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#4CAF50"
              />
            </TouchableOpacity>
          </View>
        </View>

        <ErrorText message={error} />

        <FormButton title="Đăng ký" onPress={handleRegister} />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '90%',
    maxWidth: 400,
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputWrapper: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    fontSize: 16,
    color: '#333',
  },
  // ✅ Container cho password input + eye icon
  passwordContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007bff',
    fontSize: 15,
  },
});