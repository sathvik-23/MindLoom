"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversation } from "@11labs/react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Lock, Loader2 } from "lucide-react";

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    console.error("Microphone permission denied");
    return false;
  }
}

async function getSignedUrl(): Promise<string> {
  const response = await fetch("/api/signed-url");
  if (!response.ok) {
    throw Error("Failed to get signed url");
  }
  const data = await response.json();
  return data.signedUrl;
}

export function ConvAI() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const conversation = useConversation({
    onConnect: () => {
      console.log("connected");
    },
    onDisconnect: () => {
      console.log("disconnected");
    },
    onError: error => {
      console.log(error);
      alert("An error occurred during the conversation");
    },
    onMessage: message => {
      console.log(message);
    },
  });

  async function startConversation() {
    // Check authentication first
    if (!user) {
      router.push('/auth/signin?redirectTo=/journal');
      return;
    }

    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      alert("Microphone permission is required for voice conversations");
      return;
    }
    const signedUrl = await getSignedUrl();
    const conversationId = await conversation.startSession({ signedUrl });
    console.log(conversationId);
  }

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center gap-x-4">
        <Card className="rounded-3xl">
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
              <p className="mt-4 text-gray-400">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show authentication required message for non-authenticated users
  if (!user) {
    return (
      <div className="flex justify-center items-center gap-x-4">
        <Card className="rounded-3xl">
          <CardContent>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Lock className="h-5 w-5 text-red-400" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-y-4 text-center">
              <p className="text-gray-400 max-w-sm">
                Please sign in to access voice conversations. Your conversations are private and secure.
              </p>
              <Button
                variant="outline"
                className="rounded-full"
                size="lg"
                onClick={() => router.push('/auth/signin?redirectTo=/journal')}
              >
                Sign In to Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={"flex justify-center items-center gap-x-4"}>
      <Card className={"rounded-3xl"}>
        <CardContent>
          <CardHeader>
            <CardTitle className={"text-center"}>
              {conversation.status === "connected"
                ? conversation.isSpeaking
                  ? `Agent is speaking`
                  : "Agent is listening"
                : "Disconnected"}
            </CardTitle>
          </CardHeader>
          <div className={"flex flex-col gap-y-4 text-center"}>
            <div
              className={cn(
                "orb my-16 mx-12",
                conversation.status === "connected" && conversation.isSpeaking
                  ? "orb-active animate-orb"
                  : conversation.status === "connected"
                  ? "animate-orb-slow orb-inactive"
                  : "orb-inactive"
              )}
            ></div>

            <Button
              variant={"outline"}
              className={"rounded-full"}
              size={"lg"}
              disabled={
                conversation !== null && conversation.status === "connected"
              }
              onClick={startConversation}
            >
              Start conversation
            </Button>
            <Button
              variant={"outline"}
              className={"rounded-full"}
              size={"lg"}
              disabled={conversation === null}
              onClick={stopConversation}
            >
              End conversation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
