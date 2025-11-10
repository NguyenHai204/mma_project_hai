import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axiosClient";
import { globalStyles, AntdTheme } from "../../styles/antdStyles";

export function CategoryListScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) fetchCategories();
  }, [isFocused]);

  // 🧩 Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể tải danh sách category");
    }
  };

  // 🗑️ Delete category
  const handleDeleteCategory = async (categoryId) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa category này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await axios.delete(`/api/categories/${categoryId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 200) {
              setCategories((prev) =>
                prev.filter((category) => category._id !== categoryId)
              );
              Alert.alert("Thành công", "Đã xóa category!");
            }
          } catch (err) {
            console.error("Delete error:", err.response?.data || err.message);
            Alert.alert("Lỗi", err.response?.data?.message || "Không thể xóa");
          }
        },
      },
    ]);
  };

  // ✏️ Update category
  const handleUpdateCategory = async () => {
    const { _id, name, backgroundImage } = editingCategory;
    if (!name.trim()) {
      Alert.alert("Lỗi", "Tên không được để trống");
      return;
    }

    try {
      await axios.put(
        `/api/categories/${_id}`,
        { name, backgroundImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalVisible(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", err.response?.data?.message || "Không cập nhật được");
    }
  };

  // 🎴 Render card
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        width: "15.5%", // ✅ cố định để đủ 6 cột
        aspectRatio: 1, // ✅ card vuông, tự co theo màn hình
        margin: 6,
        borderRadius: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        transform: [{ scale: Platform.OS === "web" ? 1 : 1 }],
        transition: Platform.OS === "web" ? "transform 0.2s ease-in-out" : undefined,
      }}
      onPress={() =>
        navigation.navigate("AdminWordScreen", {
          categoryId: item._id,
          categoryName: item.name,
        })
      }
    >
      <ImageBackground
        source={{ uri: item.backgroundImage }}
        style={{
          width: "100%",
          height: "70%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
        imageStyle={{
          resizeMode: "cover",
        }}
      />

      <View
        style={{
          width: "100%",
          paddingVertical: 6,
          backgroundColor: "#fff",
          alignItems: "center",
          borderTopWidth: 1,
          borderColor: "#f0f0f0",
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            color: "#001529",
            fontSize: 14,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {item.name}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 4 }}>
          <TouchableOpacity
            onPress={() => {
              setEditingCategory({ ...item });
              setModalVisible(true);
            }}
            style={{ marginHorizontal: 6 }}
          >
            <Text style={{ fontSize: 16, color: "#1890ff" }}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteCategory(item._id)}>
            <Text style={{ fontSize: 16, color: "#ff4d4f" }}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.screenContainer}>
      <Text style={globalStyles.screenTitle}>Danh sách Category</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={6} // ✅ 6 card mỗi hàng
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          justifyContent: "center",
        }}
      />

      {/* 🪟 Modal cập nhật */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={globalStyles.modalBackground}>
          <View style={globalStyles.modalContainer}>
            <Text style={globalStyles.modalTitle}>Cập nhật Category</Text>

            <Text style={globalStyles.modalLabel}>Tên mới:</Text>
            <TextInput
              style={globalStyles.input}
              value={editingCategory?.name || ""}
              onChangeText={(text) =>
                setEditingCategory({ ...editingCategory, name: text })
              }
            />

            <Text style={globalStyles.modalLabel}>Background Image URL:</Text>
            <TextInput
              style={globalStyles.input}
              value={editingCategory?.backgroundImage || ""}
              onChangeText={(text) =>
                setEditingCategory({ ...editingCategory, backgroundImage: text })
              }
            />

            <View style={globalStyles.modalButtons}>
              <TouchableOpacity
                style={[globalStyles.modalButton, globalStyles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#000", fontWeight: "600" }}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[globalStyles.modalButton, globalStyles.modalButtonSave]}
                onPress={handleUpdateCategory}
              >
                <Text style={globalStyles.modalButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function LogoutScreen() {
  const { logout } = useContext(AuthContext);
  useEffect(() => {
    logout();
  }, []);
  return (
    <View style={globalStyles.logoutContainer}>
      <Text style={globalStyles.logoutText}>Đang đăng xuất...</Text>
    </View>
  );
}
//