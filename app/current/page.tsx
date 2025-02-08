'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Layout } from 'antd';
import { AudioOutlined, LoadingOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';

const { Content } = Layout;

const CurrentPage = () => {
  const [isRecording, setIsRecording] = useState(false);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Improved analyser settings for better visualization
      analyser.fftSize = 512; // Increased for more detailed data
      analyser.smoothingTimeConstant = 0.7; // Slightly reduced smoothing for more responsive movement

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      mediaRecorder.start();
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

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
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

  return (
    <Layout className="min-h-screen relative overflow-hidden bg-white">
      <div className="absolute inset-0">
        {/* Interactive background with moving dots */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div id="particles-background" className="absolute inset-0"></div>
        </div>
      </div>

      <Content className="p-8 relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-3xl backdrop-blur-xl bg-white/80 p-8 rounded-2xl shadow-2xl border border-white/20">
          <canvas 
            ref={canvasRef}
            className="w-full h-[200px] border border-gray-200 rounded-lg mb-4 bg-green-50"
            width={800}
            height={200}
          />
          
          <div className="flex flex-col items-center gap-4">
            <Button
              type="primary"
              size="large"
              icon={isRecording ? <LoadingOutlined /> : <AudioOutlined />}
              onClick={isRecording ? stopRecording : startRecording}
              className={`${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
              } transition-all duration-300`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            {isRecording && (
              <div className="text-gray-600 font-mono text-lg">
                {formatTime(recordingTime)}
              </div>
            )}
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
