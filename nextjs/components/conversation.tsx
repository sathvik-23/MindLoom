"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback, useState } from "react";

export function Conversation() {
  const [messages, setMessages] = useState<string[]>([]);

  const conversation = useConversation({
    onConnect: () => {
      console.log("✅ Connected");
      setMessages(prev => [...prev, "[Connected]"]);
    },
    onDisconnect: () => {
      console.log("❌ Disconnected");
      setMessages(prev => [...prev, "[Disconnected]"]);
    },
    onMessage: (message: any) => {
      console.log("📨 Message:", message);
      if (message?.text) {
        setMessages(prev => [...prev, message.text]);
      } else {
        setMessages(prev => [...prev, JSON.stringify(message)]);
      }
    },
    onError: (error: any) => {
      console.error("🚨 Error:", error);
      setMessages(prev => [...prev, `[Error] ${error.message}`]);
    },
  });

  const getSignedUrl = async (): Promise<string> => {
    const response = await fetch("/api/signed-url");
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to get signed url: ${response.status} - ${text}`);
    }
    const { signedUrl } = await response.json();
    return signedUrl;
  };

  const startConversation = useCallback(async () => {
    try {
      console.log("🎤 Requesting mic permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("🎤 Mic permission granted");

      const signedUrl = await getSignedUrl();
      console.log("🔗 Got signed URL:", signedUrl);

      const conversationId = await conversation.startSession({
        signedUrl, // or agentId if using that flow
      });

      console.log("✅ Session started, ID:", conversationId);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : JSON.stringify(error);
      console.error("❌ Failed to start conversation:", errMsg);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (err) {
      console.error("❌ Failed to stop conversation:", err);
    }
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={conversation.status === "connected"}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== "connected"}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Conversation
        </button>
      </div>

      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
      </div>

      <div className="mt-4 w-full max-w-lg bg-gray-100 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Conversation Transcript</h3>
        <ul className="space-y-1 text-sm max-h-[300px] overflow-auto">
          {messages.map((msg, idx) => (
            <li
              key={idx}
              className="bg-white p-2 rounded shadow-sm font-mono whitespace-pre-wrap break-words"
            >
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
