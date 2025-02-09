'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Layout, Typography, Card, Row, Col, Space, Select } from 'antd';
import { AudioOutlined, LoadingOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import Link from 'next/link';

const { Content, Header } = Layout;

interface Patient {
  value: number;
  label: string;
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

  const startRecording = async () => {
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

  const handleGenerateSummary = async () => {
    try {
      console.log('Starting summary generation...');
      const audioData = localStorage.getItem('recorded_audio');
      if (!audioData) {
        console.error('No audio data found');
        return;
      }
      console.log('Audio data retrieved from localStorage');

      // Convert base64 to blob
      const base64Response = await fetch(audioData);
      const audioBlob = await base64Response.blob();
      console.log('Audio blob created:', audioBlob.size, 'bytes');

      // Create form data
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      console.log('FormData created with audio blob');

      // Call the transcribe API
      console.log('Sending request to /api/transcribe...');
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      console.log('Response received:', response.status, response.statusText);
      
      // Read the response as text first for debugging
      const rawResponse = await response.text();
      console.log('Raw response:', rawResponse);

      // Parse the text response as JSON
      const data = JSON.parse(rawResponse);
      console.log('Parsed response data:', data);

      if (data.transcript) {
        console.log('Transcription:', data.transcript);
        
        // Call the summarize API with the transcript
        console.log('Calling summarize API...');
        const summaryResponse = await fetch('/api/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transcript: data.transcript }),
        });

        const summaryData = await summaryResponse.json();
        console.log('Summary response:', summaryData);
        
        if (summaryData.summary) {
          console.log('Generated summary:', summaryData.summary);
        } else {
          console.error('No summary in response:', summaryData);
        }
      } else {
        console.error('No transcript in response data:', data);
      }
    } catch (error) {
      console.error('Error in handleGenerateSummary:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
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

  return (
    <Layout className="min-h-screen relative overflow-hidden bg-white">
      <Header style={{ background: 'none', border: 'none' }} className="relative w-full z-50">
        <div className="w-full px-4 flex justify-between items-center h-full">
          <Space align="center" className="absolute left-8" size="middle">
            {/* ... existing logo code ... */}
          </Space>
          <Space className="absolute right-8">
            <Select
              placeholder="Clients"
              style={{ width: 200 }}
              options={patients}
              className="mr-4"
              onChange={(value) => {
                console.log('Selected client:', value);
                const selected = patients.find(p => p.value === value);
                console.log('Found patient:', selected);
              }}
            />
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

      <Content className="p-8 relative z-10 flex items-center justify-center min-h-screen">
        <div className="flex gap-8 w-full max-w-6xl">
          {/* Left side - Existing recording section */}
          <div className="flex-1 backdrop-blur-xl bg-white/80 p-6 rounded-2xl shadow-2xl border border-white/20 flex flex-col justify-center self-center">
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
                >
                  {isRecording ? (isPaused ? 'Resume Recording' : 'Pause Recording') : 'Start Recording'}
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

          {/* Right side - New Therapist Notes */}
          <div className="w-[400px] backdrop-blur-xl bg-white/80 p-8 rounded-2xl shadow-2xl border border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Therapist Notes</h2>
            <textarea
              value={therapistNotes}
              onChange={(e) => setTherapistNotes(e.target.value)}
              className="w-full h-[500px] p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90 resize-none font-sans text-gray-700 leading-relaxed focus:outline-none transition-all duration-200"
              placeholder="Enter your session notes here..."
            />
          </div>
        </div>
      </Content>

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

        /* Remove previous wave animations */
      `}</style>
    </Layout>
  );
};

export default CurrentPage;
