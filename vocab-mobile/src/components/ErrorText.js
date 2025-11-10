import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function ErrorText({ message }) {
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});
