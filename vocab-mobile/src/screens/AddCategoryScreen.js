import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";

export default function AddCategoryScreen({ navigation }) {
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    backgroundImage: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { name, backgroundImage } = form;

    if (!name.trim() || !backgroundImage.trim()) {
      return Alert.alert("Thiếu dữ liệu", "Vui lòng điền đầy đủ thông tin.");
    }

    try {
      await axios.post(
        "/api/categories",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("✅ Thành công", "Category đã được tạo");
      setForm({ name: "", backgroundImage: "" });
      navigation.goBack();

    } catch (err) {
      Alert.alert("❌ Lỗi", err.response?.data?.message || "Không thể tạo Category");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.heading}>Tạo Category mới</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên Category</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên category"
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Link ảnh nền</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập URL ảnh nền"
            value={form.backgroundImage}
            onChangeText={(text) => handleChange("backgroundImage", text)}
          />
        </View>

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Lưu Category</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef2f7" },

  wrapper: {
    paddingHorizontal: 18,
    paddingTop: 30,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 25,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    color: "#444",
  },

  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#d6d7db",
    fontSize: 16,
    elevation: 2,
  },

  button: {
    backgroundColor: "#0D6EFD",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
