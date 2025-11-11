import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Checkbox from 'expo-checkbox'; // ✅ Thay đổi này

import FormButton from '../components/FormButton';
import ErrorText from '../components/ErrorText';
import { AuthContext } from '../context/AuthContext';

function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setError('');
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://giacmouc.com/images/202004/10-cach-tao-dong-luc-hoc-tap-tot-nhat-duy-tri-cam-hung-suot-hoc-ky/10-cach-tao-dong-luc-hoc-tap-tot-nhat-duy-tri-cam-hung-suot-hoc-ky.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>LOGIN HERE</Text>

        <View style={styles.inputWrapper}>
          <Icon name="email" size={20} color="#4CAF50" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="lock" size={20} color="#4CAF50" style={styles.icon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={rememberMe}
            onValueChange={setRememberMe}
            style={styles.checkbox}
            color={rememberMe ? '#4CAF50' : undefined}
          />
          <Text style={styles.rememberText}>Remember me</Text>
        </View>

        <ErrorText message={error} style={styles.errorText} />

        <FormButton title="LOGIN" onPress={handleLogin} style={styles.button} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.switchText}>To Register New Account → Click Here</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
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
    width: '90%', // ✅ Thay đổi từ 30% thành 90% cho mobile
    maxWidth: 400, // ✅ Giới hạn width trên web
    height: 'auto',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputWrapper: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    height: 50,
    paddingLeft: 40,
    paddingRight: 40, // ✅ Thêm padding phải cho icon mắt
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    fontSize: 16,
    color: '#333',
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 10,
  },
  rememberText: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#4CAF50',
    fontSize: 16,
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 10,
  },
});

export default LoginScreen;