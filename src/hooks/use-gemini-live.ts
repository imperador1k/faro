"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getVoiceTutorSetup } from "@/app/practice/conversation/actions";

type GeminiLiveStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

export function useGeminiLive() {
  const [status, setStatus] = useState<GeminiLiveStatus>("idle");
  const [userTranscript, setUserTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioInputRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const setupRef = useRef<any>(null);

  // Buffer for playing audio smoothly
  const playAudioChunk = useCallback(
    (base64Data: string) => {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;

      // Decode Base64 PCM16 to Float32
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert Int16 to Float32
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000); // Gemini Live outputs 24kHz
      audioBuffer.getChannelData(0).set(float32Array);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      if (nextPlayTimeRef.current < currentTime) {
        nextPlayTimeRef.current = currentTime;
      }

      source.start(nextPlayTimeRef.current);
      nextPlayTimeRef.current += audioBuffer.duration;

      setIsSpeaking(true);
      setStatus("speaking");

      source.onended = () => {
        if (ctx.currentTime >= nextPlayTimeRef.current - 0.1) {
          setIsSpeaking(false);
          if (isRecording) {
            setStatus("listening");
          } else {
            setStatus("idle");
          }
        }
      };
    },
    [isRecording],
  );

  const sendSetup = useCallback((ws: WebSocket, setupData: any) => {
    const systemPrompt = `You are a native tutor for a ${setupData.cefrLevel} ${setupData.activeLanguage} student. Their native language is ${setupData.nativeLanguage}. Give them short responses, correct only major mistakes to avoid frustration, and occasionally translate complex words to ${setupData.nativeLanguage} if they struggle. Keep it super brief and conversational. Never use markdown.`;

    ws.send(
      JSON.stringify({
        setup: {
          model: "models/gemini-2.0-flash-exp",
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  // Aoede, Charon, Fenrir, Kore, Puck
                  voiceName: "Aoede",
                },
              },
            },
          },
        },
      }),
    );
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setStatus("idle");

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioInputRef.current) {
      audioInputRef.current.disconnect();
      audioInputRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setStatus("connecting");
      const setup = await getVoiceTutorSetup();
      setupRef.current = setup;

      // 1. Initialize WebSocket
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${setup.apiKey}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        sendSetup(ws, setup);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.serverContent?.modelTurn?.parts) {
            const parts = data.serverContent.modelTurn.parts;
            for (const part of parts) {
              if (part.text) {
                setAiResponse((prev) => prev + part.text);
              }
              if (
                part.inlineData &&
                part.inlineData.mimeType.startsWith("audio/pcm")
              ) {
                playAudioChunk(part.inlineData.data);
              }
            }
          }

          if (data.serverContent?.turnComplete) {
            // The AI finished speaking
          }
        } catch (err) {
          console.error("WS Message Error", err);
        }
      };

      ws.onerror = (e) => {
        console.error("WS Error", e);
        setStatus("error");
      };

      ws.onclose = () => {
        stopRecording();
      };

      // 2. Setup Audio Recording (16kHz PCM)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        },
      });
      mediaStreamRef.current = stream;

      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({
        sampleRate: 16000,
      });
      audioContextRef.current = audioCtx;

      const input = audioCtx.createMediaStreamSource(stream);
      audioInputRef.current = input;

      // Use ScriptProcessor (deprecated but universally supported for raw PCM)
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
          return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          let s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Convert Int16Array to Base64
        const uint8 = new Uint8Array(pcm16.buffer);
        let binary = "";
        for (let i = 0; i < uint8.byteLength; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        const base64 = window.btoa(binary);

        wsRef.current.send(
          JSON.stringify({
            realtimeInput: {
              mediaChunks: [
                {
                  mimeType: "audio/pcm;rate=16000",
                  data: base64,
                },
              ],
            },
          }),
        );
      };

      input.connect(processor);
      processor.connect(audioCtx.destination); // Required for script processor to fire

      setIsRecording(true);
      setStatus("listening");
      setAiResponse("");
      setUserTranscript("");
    } catch (err) {
      console.error("Failed to start Live API", err);
      setStatus("error");
    }
  }, [playAudioChunk, sendSetup, stopRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    isSpeaking,
    userTranscript, // Live API doesn't return user text transcript right away easily unless requested, but we'll leave it empty or map it if needed
    aiResponse,
    status,
    toggleRecording,
  };
}
