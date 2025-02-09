"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Card, Typography, Button } from 'antd';

const { Title } = Typography;

interface RealtimeProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onClose: () => void;
}

interface Message {
  speaker: string;
  text: string;
}

const Realtime = ({ canvasRef, onClose }: RealtimeProps) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const assistantAudioRef = useRef<HTMLAudioElement | null>(null);

  async function startSession() {
    if (isSessionActive) return;

    try {
      // 1) Get ephemeral token from your server
      const tokenResp = await fetch("http://localhost:3000/token");
      if (!tokenResp.ok) throw new Error("Failed to get ephemeral token");
      const sessionData = await tokenResp.json();
      const ephemeralKey = sessionData.client_secret.value;

      // 2) RTCPeerConnection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 3) Audio element for Samantha
      assistantAudioRef.current = document.createElement("audio");
      assistantAudioRef.current.autoplay = true;
      pc.ontrack = (evt) => {
        assistantAudioRef.current!.srcObject = evt.streams[0];
      };

      // 4) Capture mic
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      pc.addTrack(localStream.getTracks()[0]);

      // 5) Data channel
      const dc = pc.createDataChannel("oai-events");
      setDataChannel(dc);

      // 6) Offer -> Realtime -> Answer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResp = await fetch(
        `https://api.openai.com/v1/realtime?model=${sessionData.model}`,
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp",
          },
        }
      );
      if (!sdpResp.ok) throw new Error("Failed to get Realtime SDP answer");
      const answerSDP = await sdpResp.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSDP });
    } catch (err) {
      console.error("Error starting session:", err);
    }
  }

  function stopSession() {
    if (dataChannel) dataChannel.close();
    if (pcRef.current) pcRef.current.close();
    setDataChannel(null);
    pcRef.current = null;
    setIsSessionActive(false);
  }

  function handleFunctionCall(name: string, argStr: string) {
    let args = {};
    try {
      args = JSON.parse(argStr);
    } catch {}
    console.log(`[FunctionCall] ${name} =>`, args);

    // Show it in the transcript
    setMessages((prev) => [
      ...prev,
      { speaker: "Function", text: `Called ${name}(${JSON.stringify(args)})` },
    ]);

    // Placeholder results
    let result = "";
    switch (name) {
      case "getPatientSummary":
        result = `#summary for patient ${(args as any).patientId} on ${(args as any).date}`;
        break;
      case "getClientSince":
        result = `#patient ${(args as any).patientId} joined on 2022-10-10 (placeholder)`;
        break;
      case "getTranscriptQuotes":
        result = `#quotes for patient ${(args as any).patientId}, query="${(args as any).query}"${
          (args as any).date ? `, date=${(args as any).date}` : ""
        }`;
        break;
      default:
        result = "#unknown function???";
    }

    // Show function result in the transcript too
    setMessages((prev) => [
      ...prev,
      { speaker: "Function", text: `Result: ${result}` },
    ]);

    // Send function_call_result to the model
    const fnEvent = {
      type: "conversation.item.create",
      item: {
        type: "function_call_result",
        role: "function",
        name,
        content: [
          {
            type: "function_result",
            text: JSON.stringify({ result }),
          },
        ],
      },
    };
    if (dataChannel) {
      dataChannel.send(JSON.stringify(fnEvent));

      // Ask the model to continue responding after the function
      setTimeout(() => {
        dataChannel.send(
          JSON.stringify({
            type: "response.create",
            response: {
              instructions: "Please continue with your response.",
            },
          })
        );
      }, 500);
    }
  }

  useEffect(() => {
    if (!dataChannel) return;

    function handleOpen() {
      setIsSessionActive(true);
      console.log("[DataChannel] open => session is active");

      // Tools + auto responses
      const sessionUpdate = {
        type: "session.update",
        session: {
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 800,
            create_response: true,
          },
          tools: [
            {
              type: "function",
              name: "getPatientSummary",
              description: "Retrieve a summary for a patient on a given date.",
              parameters: {
                type: "object",
                properties: {
                  patientId: { type: "number" },
                  date: { type: "string" },
                },
                required: ["patientId", "date"],
              },
            },
            {
              type: "function",
              name: "getClientSince",
              description: "Get the date a patient first joined the clinic.",
              parameters: {
                type: "object",
                properties: {
                  patientId: { type: "number" },
                },
                required: ["patientId"],
              },
            },
            {
              type: "function",
              name: "getTranscriptQuotes",
              description: "Retrieve quotes from transcripts for a query.",
              parameters: {
                type: "object",
                properties: {
                  patientId: { type: "number" },
                  query: { type: "string" },
                  date: { type: "string" },
                },
                required: ["patientId", "query"],
              },
            },
          ],
          tool_choice: "auto",
        },
      };
      dataChannel?.send(JSON.stringify(sessionUpdate));
    }

    function handleMessage(e: MessageEvent) {
      let evt;
      try {
        evt = JSON.parse(e.data);
      } catch {
        console.error("Error parsing event:", e.data);
        return;
      }
      console.log("[Realtime event]:", evt);

      // A) Therapist lines => your mic
      if (evt.type === "conversation.item.input_audio_transcription.completed") {
        const therapistText = evt.transcript;
        if (therapistText) {
          setMessages((prev) => [
            ...prev,
            { speaker: "Therapist", text: therapistText },
          ]);
        }
      }

      // B) Samantha lines => assistant audio transcript
      if (evt.type === "response.audio_transcript.done") {
        const samSpeech = evt.transcript;
        if (samSpeech) {
          setMessages((prev) => [
            ...prev,
            { speaker: "Samantha", text: samSpeech },
          ]);
        }
      }

      // C) On response.done, check for function calls
      if (evt.type === "response.done" && evt.response?.output) {
        evt.response.output.forEach((item: any) => {
          if (item.type === "function_call") {
            handleFunctionCall(item.name, item.arguments);
          }
        });
      }
    }

    dataChannel.addEventListener("open", handleOpen);
    dataChannel.addEventListener("message", handleMessage);

    return () => {
      dataChannel.removeEventListener("open", handleOpen);
      dataChannel.removeEventListener("message", handleMessage);
    };
  }, [dataChannel]);

  return (
    <Card className="fixed right-10 bottom-8 w-[400px] max-h-[90vh] flex flex-col shadow-lg z-50">
      {/* Header - Fixed at top */}
      <div className="flex-none">
        <div className="flex justify-between items-center mb-4">
          <Title level={4}>Chat with Agent</Title>
          <div>
            {isSessionActive ? (
              <Button onClick={stopSession} type="primary" danger className="mr-2">
                Stop Session
              </Button>
            ) : (
              <Button onClick={startSession} type="primary" className="mr-2">
                Start Session
              </Button>
            )}
            <Button type="text" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <div className={`flex-grow overflow-y-auto min-h-[200px] ${isSessionActive ? 'mb-24' : 'mb-0'}`}>
        {messages.length === 0 ? (
          <Typography.Text type="secondary">No conversation yet.</Typography.Text>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className="mb-2">
              <Typography.Text strong>{m.speaker}: </Typography.Text>
              <Typography.Text>{m.text}</Typography.Text>
            </div>
          ))
        )}
      </div>
      
      {/* Waveform - Fixed at bottom */}
      {isSessionActive && (
        <div className="flex-none h-24">
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
            width={400}
            height={96}
          />
        </div>
      )}
    </Card>
  );
};

export default Realtime;
