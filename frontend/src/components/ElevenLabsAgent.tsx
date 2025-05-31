import React, { useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = {
  agentId: string;
  apiKey: string;
  onMessage: (speaker: 'user' | 'agent', text: string) => void;
  onSessionClose: () => void;
};

const ElevenLabsAgent: React.FC<Props> = ({
  agentId,
  apiKey,
  onMessage,
  onSessionClose,
}) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Voice Agent</title>
        <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/@elevenlabs/elevenlabs-react@latest/dist/index.min.js"></script>
        <style>
          body { margin: 0; padding: 0; font-family: sans-serif; }
        </style>
      </head>
      <body>
        <div id="root">Loading Voice Agent...</div>
        <script>
          const { ConvoAIProvider, useConversation } = ElevenLabsReact;

          function AgentComponent() {
            const {
              startConversation,
              stopConversation,
              registerTool
            } = useConversation({
              agent_id: "${agentId}",
              api_key: "${apiKey}",
              variables: {
                username: "Sathvik",
                platform: "${Platform.OS}",
                session_date: new Date().toISOString().split("T")[0]
              },
              onMessage: (msg) => {
                window.ReactNativeWebView?.postMessage(JSON.stringify(msg));
              },
              onEnd: () => {
                window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'session_end' }));
              }
            });

            React.useEffect(() => {
              startConversation();
              return () => stopConversation();
            }, []);

            registerTool("SaveEntry", async ({ text }) => {
              const logs = JSON.parse(localStorage.getItem("journal_entries") || "[]");
              logs.push({ text, timestamp: new Date().toISOString() });
              localStorage.setItem("journal_entries", JSON.stringify(logs));
              return { output: "Journal entry saved." };
            });

            registerTool("GetPastEntries", async () => {
              const logs = JSON.parse(localStorage.getItem("journal_entries") || "[]");
              if (logs.length === 0) return { output: "You have no previous entries." };
              return {
                output: "Here are your entries:\\n" + logs.map(e => "• " + e.text).join("\\n")
              };
            });

            registerTool("GenerateSummary", async () => {
              const logs = JSON.parse(localStorage.getItem("journal_entries") || "[]");
              if (logs.length === 0) return { output: "No entries to summarize." };
              const combined = logs.map(e => e.text).join(" ");
              return {
                output: "Today you journaled about: " + combined.slice(0, 150) + "..."
              };
            });

            return React.createElement("div", null, "Voice agent ready...");
          }

          ReactDOM.render(
            React.createElement(
              ConvoAIProvider,
              { apiKey: "${apiKey}" },
              React.createElement(AgentComponent)
            ),
            document.getElementById("root")
          );
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'session_end') {
        onSessionClose();
      } else if (msg.speaker && msg.text) {
        console.log('📥 Agent Message:', msg);
        onMessage(msg.speaker, msg.text);
      }
    } catch (e) {
      console.warn('Invalid message from agent:', e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        javaScriptEnabled
        onError={(e) => console.warn('❌ WebView error', e.nativeEvent)}
        onHttpError={(e) => console.warn('❌ WebView HTTP error', e.nativeEvent)}
        style={styles.visible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  visible: {
    flex: 1,
    height: 400,
    backgroundColor: '#fff',
  },
});

export default ElevenLabsAgent;
