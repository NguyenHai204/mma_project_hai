import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WordCard({ word }) {
  return (
    <View style={styles.card}>
      <Text style={styles.word}>{word.word}</Text>
      <Text style={styles.translation}>{word.translation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2, // đổ bóng trên Android
    shadowColor: '#000', // đổ bóng trên iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  translation: {
    fontSize: 16,
    color: '#555',
  },
});
