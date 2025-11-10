import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import axios from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [words, setWords] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWords = async () => {
    try {
      const res = await axios.get("/api/vocab");
      setWords(res.data);
      setAllWords(res.data);
    } catch (err) {
      setError("Không thể tải dữ liệu từ server");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải categories:", err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCategories();
      await fetchWords();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCategoryPress = (item) => {
    navigation.navigate("CategoryWordScreen", {
      categoryId: item._id,
      categoryName: item.name,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => handleCategoryPress(item)}
    >
      <ImageBackground
        source={{ uri: item.backgroundImage }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay}>
          <Text numberOfLines={1} style={styles.categoryName}>
            {item.name}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn chủ đề để học</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1890ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={6} // ✅ 6 cột đều nhau
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#001529",
    textAlign: "center",
    marginBottom: 16,
  },
  listContent: {
    justifyContent: "center",
    paddingBottom: 60,
    paddingHorizontal: 8,
  },
  card: {
    width: "15.5%", // ✅ cố định 6 card/hàng
    aspectRatio: 1, // ✅ vuông đều
    margin: 6,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
    transform: [{ scale: Platform.OS === "web" ? 1 : 1 }],
    transition: Platform.OS === "web" ? "transform 0.2s ease-in-out" : undefined,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  categoryName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});
//