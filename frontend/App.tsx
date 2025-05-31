import React from 'react';
import { SafeAreaView } from 'react-native';
import JournalScreen from './src/screens/JournalScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <JournalScreen />
    </SafeAreaView>
  );
}
