import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Audio } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';

export default function StudyScreen() {
  const { token } = useContext(AuthContext);
  const [savedWords, setSavedWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchSavedWords();
  }, []);

  useEffect(() => {
    if (isFocused) fetchSavedWords();
  }, [isFocused]);

  const fetchSavedWords = async () => {
    try {
      const res = await axios.get('/api/saved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedWords(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách từ đã lưu:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedWord = async (id) => {
    try {
      await axios.delete(`/api/saved/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedWords(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Lỗi khi huỷ lưu từ:', err.message);
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

  const currentWord = savedWords[currentIndex]?.vocab;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Từ đã lưu</Text>

      {!flashcardMode && savedWords.length > 0 && (
        <TouchableOpacity
          style={styles.flashcardBtn}
          onPress={() => {
            setFlashcardMode(true);
            setCurrentIndex(0);
            setFlipped(false);
          }}
        >
          <Text style={styles.flashcardBtnText}>🔁 Học bằng Flashcard</Text>
        </TouchableOpacity>
      )}

      {flashcardMode ? (
        currentWord ? (
          <View style={styles.flashcard}>
            <TouchableOpacity onPress={() => setFlipped(!flipped)}>
              <View style={styles.cardContainer}>
                {currentWord.imageUrl && (
                  <Image source={{ uri: currentWord.imageUrl }} style={styles.imageLarge} />
                )}
                {!flipped ? (
                  <Text style={styles.wordLarge}>{currentWord.word}</Text>
                ) : (
                  <>
                    <Text style={styles.meaningLarge}>Nghĩa: {currentWord.meaning}</Text>
                    <Text style={styles.levelLarge}>Cấp độ: {currentWord.level}</Text>
                    {currentWord.audioUrl && (
                      <TouchableOpacity onPress={() => playAudio(currentWord.audioUrl)}>
                        <Text style={styles.audio}>🔊 Nghe phát âm</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.navRow}>
              <TouchableOpacity
                disabled={currentIndex === 0}
                onPress={() => {
                  setCurrentIndex(prev => prev - 1);
                  setFlipped(false);
                }}
              >
                <Ionicons
                  name="arrow-back-circle"
                  size={40}
                  color={currentIndex === 0 ? '#ccc' : '#007bff'}
                />
              </TouchableOpacity>

              <Text style={styles.cardIndexText}>
                {currentIndex + 1} / {savedWords.length}
              </Text>

              <TouchableOpacity
                disabled={currentIndex === savedWords.length - 1}
                onPress={() => {
                  setCurrentIndex(prev => prev + 1);
                  setFlipped(false);
                }}
              >
                <Ionicons
                  name="arrow-forward-circle"
                  size={40}
                  color={currentIndex === savedWords.length - 1 ? '#ccc' : '#007bff'}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setFlashcardMode(false)}>
              <Text style={{ marginTop: 16, color: 'red' }}>❌ Thoát chế độ Flashcard</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>Không có từ để hiển thị</Text>
        )
      ) : loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : savedWords.length === 0 ? (
        <Text style={{ fontSize: 16 }}>Chưa có từ nào được lưu.</Text>
      ) : (
        <FlatList
          data={savedWords}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            const word = item.vocab;
            return (
              <View style={styles.card}>
                {word.imageUrl && (
                  <Image source={{ uri: word.imageUrl }} style={styles.image} />
                )}
                <View style={styles.info}>
                  <Text style={styles.word}>{word.word}</Text>
                  <Text style={styles.meaning}>Nghĩa: {word.meaning}</Text>
                  <Text style={styles.level}>Cấp độ: {word.level}</Text>
                  {word.audioUrl && (
                    <TouchableOpacity onPress={() => playAudio(word.audioUrl)}>
                      <Text style={styles.audio}>🔊 Nghe phát âm</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => removeSavedWord(item._id)}>
                    <Text style={styles.remove}>❌ Huỷ lưu</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
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
  remove: { marginTop: 6, color: 'red' },

  flashcardBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#007bff',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  flashcardBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  flashcard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: 280,
    minHeight: 280,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLarge: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
  },
  wordLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  meaningLarge: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  levelLarge: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  cardIndexText: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});
