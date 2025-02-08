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
  Menu,
  Divider,
} from "antd";
import {
  RobotOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;
const { Header, Footer, Content } = Layout;

export default function Home() {
  return (
    <Layout className="min-h-screen">
      {/* Navigation Header */}
      <Header className="bg-white border-b">
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <img src="logo.png" alt="Echo Logo" className="h-8" />
              <Text strong className="text-xl text-green-700">
                Echo
              </Text>
            </Space>
          </Col>
          <Col>
            <Menu
              mode="horizontal"
              className="border-none"
              items={[
                { key: "features", label: "Features" },
                { key: "pricing", label: "Pricing" },
                { key: "about", label: "About" },
                { key: "contact", label: "Contact" },
              ]}
            />
          </Col>
          <Col>
            <Space>
              <Button>Log In</Button>
              <Button type="primary">Sign Up</Button>
            </Space>
          </Col>
        </Row>
      </Header>

      <Content>
        {/* Hero Section */}
        <div className="hero-section py-20 px-4">
          <Row justify="center" align="middle" gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <Title level={1} className="text-green-700">
                Transform Your Therapy Practice with AI
              </Title>
              <Paragraph className="text-lg text-gray-600">
                Echo helps therapists automate note-taking and gain deeper
                insights through AI-powered conversations.
              </Paragraph>
              <Space direction="vertical" size="large" className="w-full">
                <Space size="large">
                  <Link href="/info">
                    <Button
                      type="primary"
                      size="large"
                      className="min-w-[200px]"
                    >
                      Before/After Appointment
                    </Button>
                  </Link>
                  <Button type="primary" size="large" className="min-w-[200px]">
                    During Appointment
                  </Button>
                </Space>
                <Space size="large">
                  <Button size="large">Learn More</Button>
                </Space>
              </Space>
            </Col>
            <Col xs={24} lg={12} className="text-center">
              <img
                src="/hero-image.png"
                alt="Echo Platform Preview"
                className="max-w-md mx-auto"
              />
            </Col>
          </Row>
        </div>

        {/* Features Section */}
        <div className="features-section bg-green-50 py-16 px-4">
          <Title level={2} className="text-center mb-12">
            Features that Empower Your Practice
          </Title>
          <Row gutter={[32, 32]} justify="center" className="max-w-6xl mx-auto">
            <Col xs={24} sm={12} lg={6} className="flex justify-center">
              <Card className="feature-card text-center w-full">
                <RobotOutlined className="text-4xl text-green-600 mb-4" />
                <Title level={4}>AI Note-Taking</Title>
                <Paragraph>
                  Automated session documentation with intelligent summarization
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6} className="flex justify-center">
              <Card className="feature-card text-center w-full">
                <FileTextOutlined className="text-4xl text-blue-600 mb-4" />
                <Title level={4}>Smart Templates</Title>
                <Paragraph>
                  Customizable templates that adapt to your practice needs
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6} className="flex justify-center">
              <Card className="feature-card text-center w-full">
                <ExperimentOutlined className="text-4xl text-green-600 mb-4" />
                <Title level={4}>Insights Engine</Title>
                <Paragraph>
                  Pattern recognition and therapeutic progress tracking
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6} className="flex justify-center">
              <Card className="feature-card text-center w-full">
                <SafetyOutlined className="text-4xl text-blue-600 mb-4" />
                <Title level={4}>HIPAA Compliant</Title>
                <Paragraph>
                  Secure and compliant data handling for peace of mind
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* How It Works Section */}
        <div className="how-it-works py-16 px-4">
          <Title level={2} className="text-center mb-12">
            How Echo Works
          </Title>
          <Row gutter={[48, 48]} justify="center" className="max-w-6xl mx-auto">
            <Col xs={24} md={8} className="flex justify-center">
              <Card className="text-center h-full w-full">
                <div className="text-3xl mb-4">1</div>
                <Title level={4}>Record Your Session</Title>
                <Paragraph>
                  Simply start a session and let Echo handle the note-taking
                  automatically
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8} className="flex justify-center">
              <Card className="text-center h-full w-full">
                <div className="text-3xl mb-4">2</div>
                <Title level={4}>AI Processing</Title>
                <Paragraph>
                  Our AI analyzes the conversation and generates structured
                  clinical notes
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8} className="flex justify-center">
              <Card className="text-center h-full w-full">
                <div className="text-3xl mb-4">3</div>
                <Title level={4}>Review & Export</Title>
                <Paragraph>
                  Review, edit, and export your notes in your preferred format
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Benefits Section */}
        <div className="benefits bg-gray-50 py-16 px-4">
          <Title level={2} className="text-center mb-12">
            Benefits for Your Practice
          </Title>
          <Row gutter={[32, 32]} justify="center" className="max-w-6xl mx-auto">
            <Col xs={24} md={8}>
              <Space>
                <CheckCircleOutlined className="text-green-600 text-xl" />
                <Title level={4}>Save 5+ Hours Weekly</Title>
              </Space>
              <Paragraph>Reduce documentation time dramatically</Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Space>
                <CheckCircleOutlined className="text-green-600 text-xl" />
                <Title level={4}>Improve Quality</Title>
              </Space>
              <Paragraph>More detailed and consistent documentation</Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Space>
                <CheckCircleOutlined className="text-green-600 text-xl" />
                <Title level={4}>Focus on Patients</Title>
              </Space>
              <Paragraph>
                Spend more time with patients, less on paperwork
              </Paragraph>
            </Col>
          </Row>
        </div>

        {/* Testimonials Section */}
        <div className="testimonials py-16 px-4">
          <Title level={2} className="text-center mb-12">
            What Therapists Say
          </Title>
          <Row gutter={[32, 32]} justify="center" className="max-w-6xl mx-auto">
            <Col xs={24} md={8} className="flex justify-center">
              <Card className="h-full w-full">
                <Paragraph className="italic">
                  "Echo has transformed my practice. I save hours each week on
                  documentation."
                </Paragraph>
                <Text strong>Dr. Sarah Johnson</Text>
                <br />
                <Text type="secondary">Clinical Psychologist</Text>
              </Card>
            </Col>
            <Col xs={24} md={8} className="flex justify-center">
              <Card className="h-full w-full">
                <Paragraph className="italic">
                  "The AI insights have helped me identify patterns I might have
                  missed."
                </Paragraph>
                <Text strong>Mark Thompson</Text>
                <br />
                <Text type="secondary">Licensed Therapist</Text>
              </Card>
            </Col>
            <Col xs={24} md={8} className="flex justify-center">
              <Card className="h-full w-full">
                <Paragraph className="italic">
                  "Finally, I can focus entirely on my clients during sessions."
                </Paragraph>
                <Text strong>Dr. Emily Chen</Text>
                <br />
                <Text type="secondary">Family Therapist</Text>
              </Card>
            </Col>
          </Row>
        </div>

        {/* CTA Section */}
        <div className="cta bg-green-50 py-16 px-4">
          <Row justify="center" align="middle" className="text-center">
            <Col xs={24} md={16}>
              <Title level={2}>Ready to Transform Your Practice?</Title>
              <Paragraph className="text-lg mb-8">
                Join thousands of therapists who are saving time and improving
                their practice with Echo.
              </Paragraph>
              <Space size="large">
                <Button type="primary" size="large">
                  Start Free Trial
                </Button>
                <Button size="large">Schedule Demo</Button>
              </Space>
            </Col>
          </Row>
        </div>
      </Content>

      <Footer className="bg-white">
        <Row
          gutter={[32, 32]}
          justify="space-between"
          className="max-w-6xl mx-auto"
        >
          <Col xs={24} md={6}>
            <Space direction="vertical">
              <img src="/echo-logo.png" alt="Echo Logo" className="h-8" />
              <Paragraph>
                Empowering therapists with AI-powered documentation solutions.
              </Paragraph>
            </Space>
          </Col>
          <Col xs={24} md={4}>
            <Title level={5}>Product</Title>
            <Space direction="vertical">
              <Button type="link">Features</Button>
              <Button type="link">Pricing</Button>
              <Button type="link">Security</Button>
            </Space>
          </Col>
          <Col xs={24} md={4}>
            <Title level={5}>Company</Title>
            <Space direction="vertical">
              <Button type="link">About Us</Button>
              <Button type="link">Blog</Button>
              <Button type="link">Careers</Button>
            </Space>
          </Col>
          <Col xs={24} md={4}>
            <Title level={5}>Resources</Title>
            <Space direction="vertical">
              <Button type="link">Documentation</Button>
              <Button type="link">Support</Button>
              <Button type="link">Contact</Button>
            </Space>
          </Col>
        </Row>
        <Divider />
        <Row justify="center">
          <Col>
            <Text type="secondary">© 2024 Echo. All rights reserved.</Text>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
}
