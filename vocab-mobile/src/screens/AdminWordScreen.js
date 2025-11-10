import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import axios from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';

export default function AdminWordScreen({ route, navigation }) {
  const { categoryId, categoryName } = route.params;
  const { token } = useContext(AuthContext);

  const [words, setWords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingWord, setEditingWord] = useState('');
  const [editingMeaning, setEditingMeaning] = useState('');
  const [editingAudioUrl, setEditingAudioUrl] = useState('');
  const [editingImageUrl, setEditingImageUrl] = useState('');
  const [editingLevel, setEditingLevel] = useState('');

  const [isModalVisible, setModalVisible] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newLevel, setNewLevel] = useState('');

  const fetchWords = async () => {
    try {
      const res = await axios.get('/api/vocab', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter(w => w.category._id === categoryId);
      setWords(filtered);
    } catch (err) {
      Alert.alert('Lỗi', 'Không tải được danh sách từ');
    }
  };

  const handleAdd = async () => {
  if (!newWord.trim()) {
    Alert.alert('Lỗi', 'Vui lòng nhập từ vựng');
    return;
  }
  if (!newMeaning.trim()) {
    Alert.alert('Lỗi', 'Vui lòng nhập nghĩa');
    return;
  }
  if (!newImageUrl.trim()) {
    Alert.alert('Lỗi', 'Vui lòng nhập URL hình ảnh');
    return;
  }
  if (!newLevel.trim()) {
    Alert.alert('Lỗi', 'Vui lòng nhập cấp độ');
    return;
  }

  try {
    await axios.post('/api/vocab', {
      word: newWord,
      meaning: newMeaning,
      audioUrl: newAudioUrl,
      imageUrl: newImageUrl,
      level: newLevel,
      category: categoryId,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setModalVisible(false);
    setNewWord('');
    setNewMeaning('');
    setNewAudioUrl('');
    setNewImageUrl('');
    setNewLevel('');
    fetchWords();
  } catch (err) {
    Alert.alert('Lỗi', err.response?.data?.message || 'Không thêm được từ');
  }
};


  const handleEdit = async () => {
  if (!editingWord || !editingMeaning || !editingImageUrl || !editingLevel) {
    Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ từ, nghĩa, ảnh và cấp độ');
    return;
  }

  try {
    await axios.put(`/api/vocab/${editingId}`, {
      word: editingWord,
      meaning: editingMeaning,
      audioUrl: editingAudioUrl, 
      imageUrl: editingImageUrl,
      level: editingLevel,
      category: categoryId,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setEditingId(null);
    setEditingWord('');
    setEditingMeaning('');
    setEditingAudioUrl('');
    setEditingImageUrl('');
    setEditingLevel('');
    fetchWords();
  } catch (err) {
    Alert.alert('Lỗi', 'Không sửa được từ');
  }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/vocab/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWords();
    } catch (err) {
      Alert.alert('Lỗi', 'Không xóa được từ');
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: `Từ của ${categoryName}` });
    fetchWords();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Từ vựng</Text>

      <FlatList
        data={words}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.wordItem}>
            {editingId === item._id ? (
              <View style={{ flex: 1 }}>
                <TextInput
                  value={editingWord}
                  onChangeText={setEditingWord}
                  style={styles.editInput}
                  placeholder="Từ"
                />
                <TextInput
                  value={editingMeaning}
                  onChangeText={setEditingMeaning}
                  style={styles.editInput}
                  placeholder="Nghĩa"
                />
                <TextInput
                  value={editingAudioUrl}
                  onChangeText={setEditingAudioUrl}
                  style={styles.editInput}
                  placeholder="Audio URL"
                />
                <TextInput
                  value={editingImageUrl}
                  onChangeText={setEditingImageUrl}
                  style={styles.editInput}
                  placeholder="Image URL"
                />
                <TextInput
                  value={editingLevel}
                  onChangeText={setEditingLevel}
                  style={styles.editInput}
                  placeholder="Cấp độ (ví dụ: basic)"
                />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={handleEdit}>
                    <Text style={styles.editBtn}>💾</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingId(null)}>
                    <Text style={styles.cancelBtn}>❌</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={{ flex: 1 }}>
                  <Text style={styles.wordText}>
                    {item.word} - {item.meaning}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setEditingId(item._id);
                    setEditingWord(item.word);
                    setEditingMeaning(item.meaning);
                    setEditingAudioUrl(item.audioUrl || '');
                    setEditingImageUrl(item.imageUrl || '');
                    setEditingLevel(item.level || '');
                  }}
                >
                  <Text style={styles.editBtn}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                  <Text style={styles.deleteBtn}>🗑️</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>➕</Text>
      </TouchableOpacity>

      {/* Modal Form */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm từ mới</Text>
            <TextInput style={styles.modalInput} placeholder="Từ" value={newWord} onChangeText={setNewWord} />
            <TextInput style={styles.modalInput} placeholder="Nghĩa" value={newMeaning} onChangeText={setNewMeaning} />
            <TextInput style={styles.modalInput} placeholder="Audio URL" value={newAudioUrl} onChangeText={setNewAudioUrl} />
            <TextInput style={styles.modalInput} placeholder="Image URL" value={newImageUrl} onChangeText={setNewImageUrl} />
            <TextInput style={styles.modalInput} placeholder="Cấp độ" value={newLevel} onChangeText={setNewLevel} />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleAdd}><Text style={styles.saveBtn}>Lưu</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={styles.cancelBtn}>Hủy</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  wordItem: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordText: { fontSize: 16 },
  editInput: {
    borderColor: '#888', borderWidth: 1, padding: 6,
    marginBottom: 6, borderRadius: 6,
  },
  editBtn: { fontSize: 18, marginHorizontal: 8 },
  deleteBtn: { fontSize: 18, color: 'red' },
  cancelBtn: { fontSize: 18, color: 'gray' },

  // FAB button
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 26,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    padding: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveBtn: {
    color: '#007bff',
    fontSize: 16,
  },
});
