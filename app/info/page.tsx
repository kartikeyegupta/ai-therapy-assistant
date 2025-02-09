"use client";

import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect, useRef, Suspense } from "react";
import {
  Layout,
  Menu,
  Row,
  Col,
  Card,
  Typography,
  Timeline,
  Avatar,
  Divider,
  Select,
  Button,
  Space,
  ConfigProvider,
  Dropdown,
  Input,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import Wave from 'react-wavify'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { Database } from '@/app/types/supabase'
import Realtime from '../realtime';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const InfoPageContent = () => {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState("2024-01-21");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [waveAmplitude, setWaveAmplitude] = useState(20);
  const [isListening, setIsListening] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const dataArrayRef = useRef<number[]>([]);
  const frameCountRef = useRef(0);
  const FRAME_THROTTLE = 3;
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const supabase = createClientComponentClient<Database>()
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')

      if (error) {
        console.error('Error fetching patients:', error)
        return
      }

      setPatients(data || [])
    }

    fetchPatients()
  }, [])

  useEffect(() => {
    const fetchTranscripts = async () => {
      if (!selectedPatient) return;
      
      const { data, error } = await supabase
        .from('transcripts')
        .select('summary, therapist_notes, transcript, date')
        .eq('patient_id', selectedPatient.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transcripts:', error);
        return;
      }

      setTranscripts(data || []);
      // Set the most recent session date as default if available
      if (data && data.length > 0 && data[0].date) {
        setSelectedSession(data[0].date);
      }
    };

    fetchTranscripts();
  }, [selectedPatient]);

  useEffect(() => {
    const patientId = searchParams.get('patient');
    if (patientId) {
      handlePatientChange(patientId);
    }
  }, [searchParams]);

  const clientsMenu = patients.map((patient) => ({
    value: patient.id,
    label: patient.name,
  }));

  const handlePatientChange = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', parseInt(patientId))
        .single();

      if (error) {
        console.error('Error fetching patient details:', error);
        return;
      }

      setSelectedPatient(data);
    } catch (err) {
      console.error('Error in handlePatientChange:', err);
    }
  };

  const timelineItems = [
    {
      children: (
        <>
          <Text strong>14:30</Text> —{" "}
          <Text>Tell me about Yash's recent therapy sessions.</Text>
        </>
      ),
    },
    {
      children: (
        <>
          <Text strong>14:30</Text> —{" "}
          <Text>
            In recent sessions, Yash has been working through significant
            work-related stress. He's been implementing mindfulness techniques
            and has shown improvement in managing daily anxiety. He's
            particularly struggled with a recent project deadline but
            successfully used the breathing exercises we discussed. Would you
            like to know more about any specific aspect?
          </Text>
        </>
      ),
    },
    {
      children: (
        <>
          <Text strong>14:31</Text> —{" "}
          <Text>How has he been handling imposter syndrome lately?</Text>
        </>
      ),
    },
    {
      children: (
        <>
          <Text strong>14:31</Text> —{" "}
          <Text>
            Yash has made progress with his imposter syndrome, though it remains
            a challenge. He's started keeping a "wins journal" as suggested,
            documenting his daily achievements. He recently presented at a team
            meeting and, despite initial anxiety, received positive feedback.
            However, he still struggles with comparing himself to more
            experienced colleagues.
          </Text>
        </>
      ),
    },
    {
      children: (
        <>
          <Text strong>14:32</Text> —{" "}
          <Text>What coping strategies has he found most effective?</Text>
        </>
      ),
    },
    {
      children: (
        <>
          <Text strong>14:32</Text> —{" "}
          <Text>
            The most effective strategies for Yash have been: 1. Morning running
            routine (3-4 times/week) 2. 5-minute breathing exercises before
            important meetings 3. Regular journaling, especially during
            high-stress periods 4. Setting firm boundaries around work hours
            He's reported these habits have helped reduce his anxiety levels
            significantly.
          </Text>
        </>
      ),
    },
  ];

  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.7;

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      setIsListening(true);
      frameCountRef.current = 0;
      dataArrayRef.current = [];
      drawWaveform();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopAudioVisualization = () => {
    setIsListening(false);
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    dataArrayRef.current = [];
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
      
      frameCountRef.current = (frameCountRef.current + 1) % FRAME_THROTTLE;
      if (frameCountRef.current === 0) {
        const sample = Math.floor(dataArray[0]);
        dataArrayRef.current.push(sample);
      }
      
      const barWidth = 6;
      const gap = 3;
      const maxBars = Math.floor(width / (barWidth + gap));
      if (dataArrayRef.current.length > maxBars) {
        dataArrayRef.current = dataArrayRef.current.slice(-maxBars);
      }
      
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, width, height);
      
      dataArrayRef.current.forEach((value, i) => {
        const x = i * (barWidth + gap);
        const barHeight = (value / 255) * (height * 0.7);
        
        const gradient = ctx.createLinearGradient(0, height / 2 - barHeight / 2, 0, height / 2 + barHeight / 2);
        gradient.addColorStop(0, '#7ED957');
        gradient.addColorStop(1, '#6bc348');
        
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.roundRect(
          x, 
          height / 2 - barHeight / 2,
          barWidth, 
          barHeight,
          3
        );
        ctx.fill();
      });
      
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  };

  useEffect(() => {
    if (isChatOpen) {
      startAudioVisualization();
    } else {
      stopAudioVisualization();
    }
    
    return () => {
      stopAudioVisualization();
    };
  }, [isChatOpen]);

  // Add this helper function at the component level
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Modify the Select options to include time
  const sessionOptions = transcripts.map(transcript => ({
    value: transcript.date,
    label: new Date(transcript.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  // Get the current transcript based on selected session
  const currentTranscript = transcripts.find(t => t.date === selectedSession);

  const navigateToMatch = (index: number) => {
    const matches = transcriptRef.current?.getElementsByTagName('mark');
    if (!matches || matches.length === 0) return;

    // Ensure index stays within bounds
    const newIndex = Math.max(0, Math.min(index, matches.length - 1));
    setCurrentMatchIndex(newIndex);

    matches[newIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const handleSearch = (searchValue: string) => {
    if (!searchValue.trim()) {
      setTotalMatches(0);
      setCurrentMatchIndex(0);
      return;
    }
    
    const transcriptDiv = transcriptRef.current;
    if (!transcriptDiv) return;

    // Clear previous highlights
    const textElements = transcriptDiv.getElementsByClassName('transcript-text');
    for (const element of textElements) {
      const originalText = element.getAttribute('data-original-text') || '';
      if (originalText) {
        element.textContent = originalText;
      }
    }

    // Highlight matches and count them
    let matchCount = 0;
    for (const element of textElements) {
      const text = element.textContent || '';
      element.setAttribute('data-original-text', text);
      
      if (text.toLowerCase().includes(searchValue.toLowerCase())) {
        const regex = new RegExp(`(${searchValue})`, 'gi');
        element.innerHTML = text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
        matchCount += (text.match(regex) || []).length;
      }
    }

    setTotalMatches(matchCount);
    setCurrentMatchIndex(matchCount > 0 ? 1 : 0);
    
    // Navigate to first match
    if (matchCount > 0) {
      navigateToMatch(0);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7ED957",
          colorInfo: "#3b82f6",
          borderRadius: 8,
        },
      }}
    >
      <Layout className="min-h-screen relative">
        {/* Navigation Header */}
        <Header className="bg-white p-4">
          <Row justify="space-between" align="middle" className="pl-[1%]">
            <Col>
              <Text strong className="text-lg">
                {selectedPatient?.name}
              </Text>
            </Col>
            <Col>
              <Space size="middle">
                <Select 
                  placeholder="Clients"
                  style={{ width: 200 }}
                  options={clientsMenu}
                  onChange={handlePatientChange}
                  value={selectedPatient?.id}
                />
                <Button
                  type="primary"
                  className="min-w-[120px]"
                  style={{ backgroundColor: "#7ED957" }}
                  onClick={() => router.push('/calendar')}
                >
                  Schedule
                </Button>
              </Space>
            </Col>
          </Row>
          <Divider className="my-4" />
        </Header>

        {/* Main Content */}
        <Content className="p-8 bg-white">
          <Row gutter={24}>
            {/* Left Column: Patient Info */}
            <Col xs={24} md={6}>
              <Card
                className="mb-6 bg-gray-50"
                cover={
                  <div className="px-4 pt-4">
                    <div
                      style={{
                        position: "relative",
                        width: "95%",
                        paddingTop: "95%",
                        margin: "0 auto",
                      }}
                    >
                      <Avatar
                        shape="square"
                        src={selectedPatient?.picture || `${selectedPatient?.name.replace(/\s+/g, '')}.jpeg`}
                        icon={<UserOutlined />}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                        style={{ position: "absolute" }}
                      />
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer text-2xl">
                    <Text strong className="text-2xl">Age: </Text>
                    <Text className="text-2xl">{selectedPatient?.age} years old</Text>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer text-2xl">
                    <Text strong className="text-2xl">Client Since: </Text>
                    <Text className="text-2xl">{selectedPatient?.client_since ? formatDate(selectedPatient.client_since) : ''}</Text>
                  </div>
                  <div className="p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer mt-4">
                    <div className="space-y-3 text-2xl">
                      <div>
                        <Text strong className="text-2xl">About: </Text>
                        <Text className="text-2xl">{selectedPatient?.about}</Text>
                      </div>
                      <div>
                        <Text strong className="text-2xl">Triggers: </Text>
                        <Text className="text-2xl">{selectedPatient?.triggers}</Text>
                      </div>
                      <div>
                        <Text strong className="text-2xl">Medication: </Text>
                        <Text className="text-2xl">
                          {selectedPatient?.medication?.join(', ') || 'N/A'}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Right Column: Transcripts / Chatbot */}
            <Col xs={24} md={isChatOpen ? 12 : 18} className="transition-all duration-300">
              {/* Session Summary Card */}
              <Card
                title={
                  <span className="text-xl">
                    Session on {new Date(selectedSession).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                }
                className="mb-6"
                extra={
                  <Space>
                    <Button 
                      type="primary" 
                      onClick={() => {
                        handleSearch('');
                        transcriptRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      View Transcript
                    </Button>
                    <Select
                      value={selectedSession}
                      style={{ width: 300 }}
                      options={sessionOptions}
                      className="text-lg"
                      size="large"
                      onChange={(value) => setSelectedSession(value)}
                    />
                  </Space>
                }
              >
                <div className="space-y-6">
                  <div>
                    <Title level={4}>Echo Summary</Title>
                    <Text className="text-xl">
                      {currentTranscript?.summary || "No summary available"}
                    </Text>
                  </div>

                  <Divider />

                  <div>
                    <Title level={4}>Your Summary</Title>
                    <Text className="text-lg">
                      {currentTranscript?.therapist_notes || "No therapist notes available"}
                    </Text>
                  </div>
                </div>
              </Card>

              {/* Chatbot Transcript Card */}
              <Card
                ref={transcriptRef}
                title={
                  <Row justify="space-between" align="middle">
                    <span className="text-xl">Transcript</span>
                    <Space>
                      <Input.Search
                        placeholder="Search transcript..."
                        allowClear
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                        size="large"
                        className="text-lg"
                      />
                      {totalMatches > 0 && (
                        <Space>
                          <Text className="text-gray-600">
                            {currentMatchIndex + 1} of {totalMatches}
                          </Text>
                          <Button
                            icon="↑"
                            disabled={currentMatchIndex === 0}
                            onClick={() => navigateToMatch(currentMatchIndex - 1)}
                          />
                          <Button
                            icon="↓"
                            disabled={currentMatchIndex === totalMatches - 1}
                            onClick={() => navigateToMatch(currentMatchIndex + 1)}
                          />
                        </Space>
                      )}
                    </Space>
                  </Row>
                }
                className="mb-6"
              >
                <div className="max-h-[600px] overflow-y-auto pr-4">
                  <Timeline 
                    className="text-lg"
                    items={currentTranscript?.transcript ? 
                      currentTranscript.transcript.map((entry: { time: string; text: string }) => ({
                        children: (
                          <>
                            <Text strong>{entry.time}</Text> —{" "}
                            <Text className="transcript-text text-lg">{entry.text}</Text>
                          </>
                        )
                      })) : 
                      [{
                        children: <Text className="text-lg">No transcript available</Text>
                      }]
                    }
                  />
                </div>
              </Card>
            </Col>

            {/* Chat Pane */}
            {isChatOpen && (
              <Col xs={24} md={6}>
                <Realtime 
                  canvasRef={canvasRef}
                  onClose={() => setIsChatOpen(false)}
                  selectedPatient={selectedPatient}
                />
              </Col>
            )}
          </Row>
        </Content>

        {/* Chat with Agent Button */}
        {!isChatOpen && (
          <Button
            type="primary"
            size="large"
            className="fixed bottom-8 right-8 shadow-lg z-50 font-sans text-lg"
            style={{ backgroundColor: "#7ED957" }}
            onClick={() => setIsChatOpen(true)}
          >
            Chat with Agent
          </Button>
        )}
      </Layout>
    </ConfigProvider>
  );
};

const InfoPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InfoPageContent />
    </Suspense>
  );
};

export default InfoPage;
