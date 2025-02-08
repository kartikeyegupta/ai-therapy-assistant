"use client";
import React from "react";
import {
  Button,
  Typography,
  Card,
  Row,
  Col,
  Space,
  Layout,
} from "antd";
import Link from "next/link";
import "@ant-design/v5-patch-for-react-19";

const { Title, Paragraph, Text } = Typography;
const { Header, Footer, Content } = Layout;

export default function Home() {
  return (
    <Layout className="min-h-screen">
      {/* Navigation Header */}
      <Header style={{ background: 'none', border: 'none' }} className="absolute w-full z-10">
        <div className="w-full px-4 flex justify-between items-center h-full">
          <Space align="center" className="absolute left-8" size="middle">
            <img 
              src="/logo.png" 
              alt="Echo Logo" 
              className="h-12 w-12 object-contain"
            />
            <Text strong className="text-3xl text-green-700">Echo</Text>
          </Space>
          <Space className="absolute right-8">
            <Button type="primary" size="large" className="text-lg px-8">
              Try Echo
            </Button>
          </Space>
        </div>
      </Header>

      <Content className="bg-green-50">
        {/* Main Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 pt-32">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <Title level={1} className="text-4xl md:text-5xl mb-6">
              Transform Your Therapy Practice
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
              Echo helps therapists focus on their clients. Our AI-powered platform automates 
              note-taking and provides insights, saving you hours each week while improving 
              documentation quality.
            </Paragraph>
          </div>

          {/* Video Section */}
          <div className="mb-20">
            <div className="relative w-full max-w-4xl mx-auto bg-green-50 rounded-xl overflow-hidden">
              <iframe
                className="w-full aspect-video"
                src="https://www.youtube.com/embed/AyvebPNWHtU"
                title="Echo Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-20 text-center">
            <Text className="text-gray-600 text-2xl font-medium block mb-3">
              Trusted by thousands of mental health professionals across the globe
            </Text>
            <Text className="text-gray-600 text-xl">
              Join the community of therapists who save 5+ hours every week with Echo
            </Text>
          </div>

          {/* Testimonials */}
          <div className="mb-20">
            <Title level={2} className="text-center mb-12">
              Trusted by Leading Therapists
            </Title>
            <Row gutter={[32, 32]} justify="center">
              <Col xs={24} md={8}>
                <Card className="h-full">
                  <div className="flex flex-col items-center">
                    <img 
                      src="/therapist1.png" 
                      alt="Dr. Sarah Johnson" 
                      className="w-24 h-24 rounded-full object-cover mb-6"
                    />
                    <Paragraph className="text-lg italic mb-6">
                      "Echo has revolutionized how I handle session documentation. I save over 5 hours every week, 
                      giving me more time to focus on my clients."
                    </Paragraph>
                    <div>
                      <Text strong className="block">Dr. Sarah Johnson</Text>
                      <Text type="secondary">Clinical Psychologist</Text>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="h-full">
                  <div className="flex flex-col items-center">
                    <img 
                      src="/therapist1.png" 
                      alt="Mark Thompson" 
                      className="w-24 h-24 rounded-full object-cover mb-6"
                    />
                    <Paragraph className="text-lg italic mb-6">
                      "The AI insights have helped me identify patterns I might have missed. It's like having 
                      an intelligent assistant that helps me provide better care."
                    </Paragraph>
                    <div>
                      <Text strong className="block">Mark Thompson</Text>
                      <Text type="secondary">Licensed Therapist</Text>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="h-full">
                  <div className="flex flex-col items-center">
                    <img 
                      src="/therapist1.png" 
                      alt="Dr. Emily Chen" 
                      className="w-24 h-24 rounded-full object-cover mb-6"
                    />
                    <Paragraph className="text-lg italic mb-6">
                      "Finally, I can be fully present during sessions without worrying about taking notes. 
                      The documentation quality has actually improved."
                    </Paragraph>
                    <div>
                      <Text strong className="block">Dr. Emily Chen</Text>
                      <Text type="secondary">Family Therapist</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Button type="primary" size="large" className="px-8">
              Start Free Trial
            </Button>
          </div>
        </div>
      </Content>

      <Footer className="bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <Text type="secondary">© 2024 Echo. All rights reserved.</Text>
        </div>
      </Footer>
    </Layout>
  );
}
