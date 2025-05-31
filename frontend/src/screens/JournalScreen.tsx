import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  SafeAreaView,
} from 'react-native';
import ElevenLabsAgent from '../components/ElevenLabsAgent';
import { CONFIG } from '../constants/config'; // ✅ central config

interface Message {
  id: string;
  speaker: 'user' | 'agent';
  text: string;
}

export default function JournalScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAgent, setShowAgent] = useState<boolean>(false);

  const handleNewMessage = (speaker: 'user' | 'agent', text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), speaker, text },
    ]);
  };

  const handleSessionEnd = () => {
    setShowAgent(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={
              item.speaker === 'user' ? styles.userBubble : styles.agentBubble
            }
          >
            <Text>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.buttonContainer}>
        {!showAgent && (
          <Button title="Start Journaling" onPress={() => setShowAgent(true)} />
        )}
      </View>

      {showAgent && (
        <ElevenLabsAgent
          agentId={CONFIG.AGENT_ID}
          apiKey={CONFIG.XI_API_KEY}
          onMessage={handleNewMessage}
          onSessionClose={handleSessionEnd}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  listContent: { padding: 16 },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '75%',
  },
  agentBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '75%',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
});
