import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Dimensions } from 'react-native';
import axios from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';
import { BarChart } from 'react-native-chart-kit';
import { useIsFocused } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const isFocused = useIsFocused();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error('Lỗi lấy thống kê:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchStats();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Đang tải thống kê...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text>Không thể tải dữ liệu thống kê 😢</Text>
      </View>
    );
  }

  // Chỉ lấy các ngày có người đăng ký
 const filteredStats = stats.userStats.filter(item => item.count > 0); // dùng trực tiếp item.day


  const chartData = {
    labels: filteredStats.map(item => `${item.day}`),
    datasets: [
      {
        data: filteredStats.map(item => item.count),
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Thống kê</Text>
      <Text style={styles.stat}> Tổng số category: {stats.totalCategories}</Text>
      <Text style={styles.stat}> Tổng số từ vựng: {stats.totalVocab}</Text>

      {filteredStats.length > 0 ? (
        <>
          <Text style={[styles.title, { marginTop: 20 }]}>👥 Số người đăng kí trong tháng</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            fromZero
            showValuesOnTopOfBars
            chartConfig={{
              backgroundColor: '#f0f0f0',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 8,
              },
              propsForBackgroundLines: {
                strokeDasharray: '', // solid lines
              },
            }}
            style={{ marginTop: 10, borderRadius: 8 }}
          />
        </>
      ) : (
        <Text style={{ marginTop: 20, color: 'gray' }}>
          Không có dữ liệu người dùng theo ngày trong tháng.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  stat: { fontSize: 20, marginVertical: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});
