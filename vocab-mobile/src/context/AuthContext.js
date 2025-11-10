import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

 useEffect(() => {
  const loadTokenAndUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log('✅ Token & User loaded from storage');
      } else {
        console.log('ℹ️ Không tìm thấy token hoặc user');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.log('❌ Lỗi khi tải dữ liệu đăng nhập:', err);
      setToken(null);
      setUser(null);
    }
  };

  loadTokenAndUser();
}, []);


  const login = async (email, password) => {
    try {
      console.log('🔐 Gửi yêu cầu login:', { email, password });
      const res = await axios.post('/api/users/login', { email, password });

      const { token, user } = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      console.log('✅ Đăng nhập thành công:', user);
    } catch (err) {
      const message = err.response?.data?.message || 'Đăng nhập thất bại';
      console.log('❌ Lỗi đăng nhập:', message);
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
  try {
    await axios.post('/api/users/register', { name, email, password });

    // ❌ KHÔNG lưu token / user gì cả sau khi đăng ký
    console.log('✅ Đăng ký thành công');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Đăng ký thất bại';
    console.log('❌ Lỗi đăng ký:', message);
    throw new Error(message);
  }
};



  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      console.log('🚪 Đã đăng xuất');
    } catch (err) {
      console.log('❌ Lỗi khi đăng xuất:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
