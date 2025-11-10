import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet, ActivityIndicator,
  TouchableOpacity, Alert
} from 'react-native';
import axios from '../api/axiosClient';
import { Audio } from 'expo-av';
import { AuthContext } from '../context/AuthContext';

export default function CategoryWordScreen({ route }) {
  const { categoryId, categoryName } = route.params;
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedWordIds, setSavedWordIds] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchWords = async () => {
    try {
      const res = await axios.get('/api/vocab');
      const filtered = res.data.filter(w => w.category?._id === categoryId);
      setWords(filtered);
    } catch (err) {
      console.error('Lỗi tải từ vựng:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedWords = async () => {
    try {
      const res = await axios.get('/api/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ids = res.data.map(item => item.vocab._id);
      setSavedWordIds(ids);
    } catch (err) {
      console.error('Lỗi lấy từ đã lưu:', err.message);
    }
  };

  const playAudio = async (url) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      await sound.playAsync();
    } catch (e) {
      console.log('Lỗi phát âm thanh:', e.message);
    }
  };

  const saveWord = async (vocabId) => {
    try {
      await axios.post(
        '/api/saved',
        { vocab: vocabId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedWordIds(prev => [...prev, vocabId]);
      Alert.alert('Thành công', 'Đã lưu từ vựng');
    } catch (err) {
      console.error('Lỗi khi lưu từ:', err.message);
      Alert.alert('Lỗi', 'Từ này đã lưu rồi !');
    }
  };

  useEffect(() => {
    fetchWords();
    fetchSavedWords();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Từ vựng: {categoryName}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={words}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : null}
              <View style={styles.info}>
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.meaning}>Nghĩa: {item.meaning}</Text>
                <Text style={styles.level}>Cấp độ: {item.level}</Text>

                {item.audioUrl ? (
                  <TouchableOpacity onPress={() => playAudio(item.audioUrl)}>
                    <Text style={styles.audio}>🔊 Nghe phát âm</Text>
                  </TouchableOpacity>
                ) : null}

                {savedWordIds.includes(item._id) ? (
                  <Text style={styles.saved}>✅ Đã lưu</Text>
                ) : (
                  <TouchableOpacity onPress={() => saveWord(item._id)}>
                    <Text style={styles.saveButton}>💾 Lưu từ</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#f9f9f9'
  },
  image: { width: 80, height: 80, marginRight: 12, borderRadius: 8 },
  info: { flex: 1, justifyContent: 'center' },
  word: { fontSize: 20, fontWeight: 'bold' },
  meaning: { fontSize: 16 },
  level: { fontSize: 14, fontStyle: 'italic' },
  audio: { marginTop: 6, color: '#007bff' },
  saveButton: { marginTop: 6, color: 'green', fontWeight: 'bold' },
  saved: { marginTop: 6, color: 'gray', fontWeight: 'bold' },
});
