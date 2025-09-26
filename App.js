import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RunningMetrics from './components/RunningMetrics';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <RunningMetrics />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});