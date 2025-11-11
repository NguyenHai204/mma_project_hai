import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import { BarChart } from "react-native-chart-kit";
import { useIsFocused } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useContext(AuthContext);
  const isFocused = useIsFocused();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Lỗi lấy thống kê:", err);

      // 👉 Nếu token hết hạn → logout người dùng
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (isFocused) fetchStats();
  }, [isFocused, fetchStats]);

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

  // ✅ safe filter (tránh crash khi userStats undefined)
  const filteredStats = stats?.userStats?.filter((item) => item.count > 0) || [];

  const chartData = {
    labels: filteredStats.map((item) => `${item.day}/${stats.currentMonth}`),
    datasets: [{ data: filteredStats.map((item) => item.count) }],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Thống kê</Text>

      {/* Summary Stats Cards */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{stats.totalCategories}</Text>
          <Text style={styles.cardLabel}>Category</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>{stats.totalVocab}</Text>
          <Text style={styles.cardLabel}>Từ vựng</Text>
        </View>
      </View>

      {filteredStats.length > 0 ? (
        <>
          <Text style={[styles.title, { marginTop: 20 }]}>
            👥 Người dùng đăng ký theo ngày
          </Text>

          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            fromZero
            showValuesOnTopOfBars
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 8,
              },
              propsForBackgroundLines: {
                strokeDasharray: "",
              },
            }}
            style={{ marginTop: 10, borderRadius: 8 }}
          />
        </>
      ) : (
        <Text style={{ marginTop: 20, color: "gray" }}>
          Không có dữ liệu người dùng theo ngày trong tháng.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // ✅ New UI card
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#007AFF",
  },
  cardLabel: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
});
