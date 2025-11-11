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
  StyleSheet,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axiosClient";
import { globalStyles } from "../../styles/antdStyles";

export function CategoryListScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) loadCategories();
  }, [isFocused]);

  const loadCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tải danh sách category");
    }
  };

  const deleteCategory = (categoryId) => {
    Alert.alert("Xác nhận", "Bạn chắc muốn xóa category này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`/api/categories/${categoryId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setCategories((prev) => prev.filter((c) => c._id !== categoryId));
            Alert.alert("Thành công", "Đã xóa category");

          } catch (err) {
            Alert.alert("Lỗi", err.response?.data?.message || "Không thể xóa");
          }
        },
      },
    ]);
  };

  const updateCategory = async () => {
    if (!editingCategory.name.trim()) {
      return Alert.alert("Lỗi", "Tên không được để trống");
    }

    try {
      await axios.put(
        `/api/categories/${editingCategory._id}`,
        {
          name: editingCategory.name,
          backgroundImage: editingCategory.backgroundImage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalVisible(false);
      setEditingCategory(null);
      loadCategories();

    } catch (err) {
      Alert.alert("Lỗi", err.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const openEditModal = (category) => {
    setEditingCategory({ ...category });
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("AdminWordScreen", {
          categoryId: item._id,
          categoryName: item.name,
        })
      }
    >
      <ImageBackground
        source={{ uri: item.backgroundImage }}
        style={styles.cardImage}
        imageStyle={styles.cardImageStyle}
      />

      <View style={styles.cardFooter}>
        <Text numberOfLines={1} style={styles.cardTitle}>
          {item.name}
        </Text>

        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => openEditModal(item)}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteCategory(item._id)}>
            <Text style={styles.deleteIcon}>🗑️</Text>
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
        numColumns={6}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Modal edit category */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={globalStyles.modalBackground}>
          <View style={globalStyles.modalContainer}>
            <Text style={globalStyles.modalTitle}>Cập nhật Category</Text>

            <TextInput
              placeholder="Tên category"
              style={globalStyles.input}
              value={editingCategory?.name}
              onChangeText={(text) =>
                setEditingCategory({ ...editingCategory, name: text })
              }
            />

            <TextInput
              placeholder="Link background"
              style={globalStyles.input}
              value={editingCategory?.backgroundImage}
              onChangeText={(text) =>
                setEditingCategory({
                  ...editingCategory,
                  backgroundImage: text,
                })
              }
            />

            <View style={globalStyles.modalButtons}>
              <TouchableOpacity
                style={[globalStyles.modalButton, globalStyles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[globalStyles.modalButton, globalStyles.modalButtonSave]}
                onPress={updateCategory}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Lưu
                </Text>
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

const styles = StyleSheet.create({
  card: {
    width: "15.5%",
    aspectRatio: 1,
    margin: 6,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
    shadowOpacity: 0.15,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "70%",
    backgroundColor: "#e8e8e8",
  },
  cardImageStyle: {
    resizeMode: "cover",
  },
  cardFooter: {
    paddingVertical: 6,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#001529",
  },
  cardActions: {
    flexDirection: "row",
    marginTop: 4,
  },
  editIcon: {
    marginHorizontal: 6,
    fontSize: 16,
    color: "#1890ff",
  },
  deleteIcon: {
    fontSize: 16,
    color: "#ff4d4f",
  },
});
