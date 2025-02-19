'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Layout, Typography, Card, Row, Col, Space, Select } from 'antd';
import { AudioOutlined, LoadingOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Realtime from '../realtime';
import { getPatientContext } from '../../lib/patient-context';

const { Content, Header } = Layout;

interface Patient {
  value: number;
  label: string;
}

interface PatientContext {
  id: number;
  name: string;
  visitDates: string[];
  lastSessionSummary?: string;
  clientSince?: string;
  triggers?: string[];
  notes?: string;
}

const CurrentPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const dataArrayRef = useRef<number[]>([]);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const frameCountRef = useRef(0);
  const FRAME_THROTTLE = 3; // Only sample every Nth frame (increase this number to move slower)
  const [recordingTime, setRecordingTime] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [therapistNotes, setTherapistNotes] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [patientContext, setPatientContext] = useState<PatientContext | null>(null);

  const startRecording = async () => {
    if (!selectedPatientId) {
      return;
    }

    try {
      if (isPaused && mediaRecorderRef.current) {
        // Resume recording if paused
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        // Resume timer
        timerIntervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        // Resume waveform animation
        drawWaveform();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // We'll convert this to MP3 later
      });
      mediaRecorderRef.current = mediaRecorder;

      // Set up data handling
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Improved analyser settings for better visualization
      analyser.fftSize = 512; // Increased for more detailed data
      analyser.smoothingTimeConstant = 0.7; // Slightly reduced smoothing for more responsive movement

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      frameCountRef.current = 0;
      dataArrayRef.current = [];
      drawWaveform();
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      // Pause timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      // Pause waveform animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Handle the recorded audio
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            localStorage.setItem('recorded_audio', base64Audio);
            console.log('Audio saved to local storage');
          };
        } catch (error) {
          console.error('Error saving audio:', error);
        }
      };

      setIsRecording(false);
      setIsPaused(false);
      setIsFinished(true);
      // Clear the waveform data
      dataArrayRef.current = [];
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      analyser.getByteFrequencyData(dataArray);
      
      // Only add new data every FRAME_THROTTLE frames
      frameCountRef.current = (frameCountRef.current + 1) % FRAME_THROTTLE;
      if (frameCountRef.current === 0) {
        const sample = Math.floor(dataArray[0]);
        dataArrayRef.current.push(sample);
      }
      
      // Reduce the number of visible bars
      const barWidth = 6; // Increased bar width
      const gap = 3; // Increased gap
      const maxBars = Math.floor(width / (barWidth + gap));
      if (dataArrayRef.current.length > maxBars) {
        dataArrayRef.current = dataArrayRef.current.slice(-maxBars);
      }
      
      // Clear the canvas
      ctx.fillStyle = 'rgb(240, 253, 244)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw the bars with smoother animation
      dataArrayRef.current.forEach((value, i) => {
        const x = i * (barWidth + gap);
        const barHeight = (value / 255) * (height * 0.7); // Reduced max height slightly
        
        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, height / 2 - barHeight / 2, 0, height / 2 + barHeight / 2);
        gradient.addColorStop(0, 'rgb(22, 163, 74)');
        gradient.addColorStop(1, 'rgb(21, 128, 61)');
        
        ctx.fillStyle = gradient;
        
        // Draw bar with rounded corners
        ctx.beginPath();
        ctx.roundRect(
          x, 
          height / 2 - barHeight / 2,
          barWidth, 
          barHeight,
          3 // Radius for rounded corners
        );
        ctx.fill();
      });
      
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTranscriptSegments = (segments: any[]) => {
    const formatted = segments.map(segment => ({
      text: segment.text.trim(),
      time: segment.startFormatted
    }));
    console.log('Formatted transcript array:', JSON.stringify(formatted, null, 2));
    return formatted;
  };

  const handleGenerateSummary = async () => {
    try {
      setIsProcessing(true);
      setProcessingStep(0);
      setProcessingMessage('Preparing audio data...');

      const audioData = localStorage.getItem('recorded_audio');
      if (!audioData) {
        console.error('No audio data found');
        return;
      }

      setProcessingStep(20);
      setProcessingMessage('Transcribing audio...');
      
      // Convert base64 to blob
      const base64Response = await fetch(audioData);
      const audioBlob = await base64Response.blob();

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      // Call the transcribe API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      setProcessingStep(40);
      setProcessingMessage('Analyzing transcript...');
      
      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      if (data.segments) {
        const formattedTranscript = formatTranscriptSegments(data.segments);
        
        setProcessingStep(60);
        setProcessingMessage('Generating summary...');
        
        // Call the summarize API
        const summaryResponse = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: formattedTranscript }),
        });

        const summaryData = await summaryResponse.json();
        
        if (summaryData.summary) {
          setProcessingStep(80);
          setProcessingMessage('Creating one-sentence summary...');
          
          // Get one-sentence summary
          const oneSentenceResponse = await fetch('/api/one-sentence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ summary: summaryData.summary }),
          });
          
          const { oneSentence } = await oneSentenceResponse.json();

          if (!selectedPatientId) {
            console.error('No patient selected');
            return;
          }

          setProcessingStep(90);
          setProcessingMessage('Saving session data...');

          const saveResponse = await fetch('/api/save-transcript', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              patient_id: selectedPatientId,
              date: new Date().toISOString(),
              summary: summaryData.summary,
              card_summary: oneSentence,
              therapist_notes: therapistNotes,
              transcript: formattedTranscript
            }),
          });

          if (!saveResponse.ok) {
            throw new Error('Failed to save transcript');
          }

          setProcessingStep(100);
          setProcessingMessage('Complete! Redirecting...');
          
          // Small delay before redirect for smooth UX
          setTimeout(() => {
            router.push(`/info?patient=${selectedPatientId}`);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error in handleGenerateSummary:', error);
      setProcessingMessage('Error occurred. Please try again.');
      setTimeout(() => setIsProcessing(false), 2000);
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        console.log('Frontend: Fetching patients...');
        const response = await fetch('/api/patients');
        console.log('Frontend: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        
        const data = await response.json();
        console.log('Frontend: Received data:', data);
        
        if (Array.isArray(data)) {
          setPatients(data);
          console.log('Frontend: Updated patients state:', data);
        } else {
          console.error('Frontend: Received non-array data:', data);
        }
      } catch (error) {
        console.error('Frontend: Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  // Log whenever patients state changes
  useEffect(() => {
    console.log('Current patients state:', patients);
  }, [patients]);

  useEffect(() => {
    // For demo, fetch context for patient ID 1234
    // In production, this would come from your session/route params
    async function fetchContext() {
      const context = await getPatientContext(1234);
      if (context) {
        setPatientContext(context);
      }
    }
    fetchContext();
  }, []);

  return (
    <Layout className="min-h-screen relative overflow-hidden bg-white">
      <Header style={{ background: 'none', border: 'none' }} className="relative w-full z-50">
        <div className="w-full px-4 flex justify-between items-center h-full">
          <Space align="center" className="absolute left-8" size="middle">
            <Link href="/">
              <Button type="primary" size="large" className="text-lg px-8">
                Back
              </Button>
            </Link>
            {/* ... existing logo code ... */}
          </Space>
          <Space className="absolute right-8">
            <Link href="/info">
              <Button type="primary" size="large" className="text-lg px-8">
                All Info
              </Button>
            </Link>
          </Space>
        </div>
      </Header>

      <div className="absolute inset-0 z-0">
        {/* Interactive background with moving dots */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div id="particles-background" className="absolute inset-0"></div>
        </div>
      </div>

      <Content className="p-8 relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="flex gap-8 w-full max-w-6xl h-full items-center justify-center">
          {/* Left side - Recording section with Patient Selection */}
          <div className="flex-1 flex flex-col gap-4 self-center">
            {/* New Patient Selection Card */}
            <div className="backdrop-blur-xl bg-white/80 p-6 rounded-2xl shadow-2xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 text-gray-700">Select Client</h2>
                  <Select
                    placeholder="Choose a client to begin"
                    style={{ width: '100%' }}
                    options={patients}
                    size="large"
                    status={!selectedPatientId ? 'warning' : undefined}
                    onChange={(value) => {
                      console.log('Selected client:', value);
                      setSelectedPatientId(value);
                    }}
                    className="w-full"
                  />
                </div>
                {!selectedPatientId && (
                  <div className="text-amber-600 text-sm">
                    ⚠️ Please select a client before recording
                  </div>
                )}
              </div>
            </div>

            {/* Recording Interface */}
            <div className="backdrop-blur-xl bg-white/80 p-6 rounded-2xl shadow-2xl border border-white/20 flex flex-col justify-center">
              <canvas 
                ref={canvasRef}
                className="w-full h-[120px] border border-gray-200 rounded-lg mb-3 bg-green-50"
                width={800}
                height={120}
              />
              
              <div className="flex flex-col items-center gap-2">
                {!isFinished ? (
                  <Button
                    type="primary"
                    size="large"
                    icon={isRecording && !isPaused ? <LoadingOutlined /> : <AudioOutlined />}
                    onClick={isRecording ? (isPaused ? startRecording : pauseRecording) : startRecording}
                    className={`${
                      isRecording && !isPaused ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
                    } transition-all duration-300`}
                    disabled={!selectedPatientId}
                    title={!selectedPatientId ? "Please select a client first" : ""}
                  >
                    {!selectedPatientId 
                      ? 'Select Client to Record' 
                      : isRecording 
                        ? (isPaused ? 'Resume Recording' : 'Pause Recording') 
                        : 'Start Recording'}
                  </Button>
                ) : null}
                
                {(isRecording || isPaused) && (
                  <Button
                    type="primary"
                    size="large"
                    danger
                    onClick={stopRecording}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Stop Recording
                  </Button>
                )}

                {isFinished && (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleGenerateSummary}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Generate Summary
                  </Button>
                )}

                {(isRecording || isPaused) && (
                  <div className="text-gray-600 font-mono text-lg">
                    {formatTime(recordingTime)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Therapist Notes */}
          <div className="w-[400px] backdrop-blur-xl bg-white/80 p-8 rounded-2xl shadow-2xl border border-white/20 self-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Therapist Notes</h2>
            <textarea
              value={therapistNotes}
              onChange={(e) => setTherapistNotes(e.target.value)}
              className="w-full h-[500px] p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90 resize-none font-sans text-gray-700 leading-relaxed focus:outline-none transition-all duration-200"
              placeholder={selectedPatientId ? "Enter your session notes here..." : "Please select a client first"}
              disabled={!selectedPatientId}
            />
          </div>
        </div>
      </Content>

      {isProcessing && (
        <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* Progress percentage */}
            <div className="text-4xl font-bold text-green-600 text-center mb-4">
              {processingStep}%
            </div>
            
            {/* Main progress bar */}
            <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden mb-6 relative">
              <div 
                className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 transition-all duration-500 ease-out relative"
                style={{ width: `${processingStep}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 progress-shine"></div>
              </div>
            </div>

            {/* Processing step indicator */}
            <div className="relative mb-8">
              <div className="text-xl text-green-700 text-center font-medium animate-pulse">
                {processingMessage}
              </div>
            </div>

            {/* Processing steps visualization */}
            <div className="flex justify-between items-center w-full max-w-xl mx-auto">
              {['Recording', 'Transcribing', 'Analyzing', 'Summarizing'].map((step, index) => {
                const stepValue = (index + 1) * 25;
                const isCompleted = processingStep >= stepValue;
                const isActive = processingStep >= stepValue - 25 && processingStep < stepValue;
                
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                        ${isCompleted ? 'bg-green-500 scale-110' : 
                          isActive ? 'bg-green-400 scale-105 animate-pulse' : 
                          'bg-gray-200'}`}
                    >
                      {isCompleted && (
                        <span className="text-white">✓</span>
                      )}
                    </div>
                    <span className={`text-sm ${isActive ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        #particles-background {
          background: transparent;
          background-image: 
            radial-gradient(#22c55e 1px, transparent 1px),
            radial-gradient(#22c55e 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 20px 20px;
          animation: moveBackground 8s linear infinite;
          opacity: 0.2;
        }

        @keyframes moveBackground {
          0% {
            background-position: 0 0, 20px 20px;
          }
          100% {
            background-position: 40px 40px, 60px 60px;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        .progress-shine {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.4) 50%,
            rgba(255,255,255,0) 100%
          );
          animation: shine 2s infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </Layout>
  );
};

export default CurrentPage;
