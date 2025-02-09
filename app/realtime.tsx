"use client";

import React, { useRef } from 'react';
import { Card, Typography, Button } from 'antd';

const { Title } = Typography;

interface RealtimeProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onClose: () => void;
}

const Realtime = ({ canvasRef, onClose }: RealtimeProps) => {
  return (
    <Card className="h-full relative">
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Chat with Agent</Title>
        <Button type="text" onClick={onClose}>
          ✕
        </Button>
      </div>
      
      {/* Waveform */}
      <div className="absolute bottom-0 left-0 right-0 h-24">
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
          width={400}
          height={96}
        />
      </div>
    </Card>
  );
};

export default Realtime;
