"use client";

import React from "react";
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
} from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const InfoPage = () => {
  const today = new Date().toLocaleDateString();

  const patients = [
    { key: "1", label: "Yash Dagade", value: "yash" },
    { key: "2", label: "Sarah Johnson", value: "sarah" },
    { key: "3", label: "Michael Chen", value: "michael" },
    { key: "4", label: "Emma Rodriguez", value: "emma" },
  ];

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
      <Layout className="min-h-screen">
        {/* Navigation Header */}
        <Header className="bg-white border-b p-4">
          <Row>
            <Col flex="200px">
              <Text strong>{today}</Text>
            </Col>
            <Col flex="auto">
              <div className="flex justify-end items-center">
                <Select
                  defaultValue="yash"
                  style={{ width: 200, marginRight: 16 }}
                  options={patients}
                  className="text-base"
                />
                <Menu
                  mode="horizontal"
                  className="border-none"
                  defaultSelectedKeys={["2"]}
                  items={[
                    { key: "2", label: "Schedule" },
                    { key: "3", label: "Reports" },
                    { key: "4", label: "Settings" },
                  ]}
                />
              </div>
            </Col>
          </Row>
        </Header>

        {/* Main Content */}
        <Content className="p-8">
          <Row gutter={24}>
            {/* Left Column: Patient Info */}
            <Col xs={24} md={10}>
              <Card
                className="mb-6"
                cover={
                  <div className="px-4 pt-4">
                    <Avatar
                      shape="square"
                      src="/Yash.jpeg"
                      icon={<UserOutlined />}
                      className="w-[95%] h-[300px] object-cover mx-auto block rounded-lg"
                    />
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer text-lg">
                    <Text strong>Name: </Text>
                    <Text>Yash Dagade</Text>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
                    <Text strong>Age: </Text>
                    <Text>18 years old</Text>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
                    <Text strong>Location: </Text>
                    <Text>Durham, NC</Text>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
                    <Text strong>Client Since: </Text>
                    <Text>8th June, 2023</Text>
                  </div>
                  <div className="p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer mt-4">
                    <div className="space-y-3">
                      <div>
                        <Text strong>About: </Text>
                        <Text>
                          Struggles with anxiety & imposter syndrome at work.
                          Values structure but wants to be more adaptable. Finds
                          comfort in running & journaling. Recently started
                          setting boundaries in relationships. Wants to improve
                          self-confidence & work-life balance.
                        </Text>
                      </div>
                      <div>
                        <Text strong>Triggers: </Text>
                        <Text>
                          Yash feels overwhelmed by tight deadlines, unexpected
                          changes, and conflict in relationships. He struggles
                          with self-doubt, perceived failure, and social
                          situations, often overthinking interactions. Lack of
                          control leaves him anxious and unsettled.
                        </Text>
                      </div>
                      <div>
                        <Text strong>Medication: </Text>
                        <Text>N/A</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Right Column: Transcripts / Chatbot */}
            <Col xs={24} md={14}>
              {/* Session Summary Card */}
              <Card
                title={<span className="text-xl">Session Summary</span>}
                className="mb-6"
                extra={
                  <Space>
                    <Button type="primary">View Transcript</Button>
                    <Select
                      defaultValue="Select Session"
                      style={{ width: 200 }}
                      options={[
                        { value: "2024-01-11", label: "11th January, 2024" },
                        { value: "2024-01-21", label: "21st January, 2024" },
                      ]}
                      className="text-lg"
                    />
                  </Space>
                }
              >
                <Text>
                  In this session, Yash showed notable progress in managing his
                  work-related anxiety and imposter syndrome. He reported
                  successfully implementing several coping strategies, including
                  daily mindfulness practices and boundary-setting at work. Key
                  developments include: 1. Reduced anxiety around team meetings
                  through preparation and breathing exercises 2. Successfully
                  managed a high-pressure project deadline without overwhelming
                  stress 3. Started setting boundaries with colleagues regarding
                  after-hours work communications 4. Continued his consistent
                  exercise routine, which has positively impacted his mood Areas
                  for continued focus include building self-confidence in
                  professional settings and developing more robust stress
                  management techniques for unexpected workplace changes. Yash
                  expressed interest in exploring additional cognitive
                  behavioral techniques in future sessions to address persistent
                  self-doubt patterns.
                </Text>
              </Card>

              {/* Chatbot Transcript Card */}
              <Card
                title={
                  <span className="text-xl">Ask Questions about Yash</span>
                }
                className="mb-6"
              >
                <Card className="bg-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/logo.png" alt="Echo Logo" className="h-8 w-8" />
                    <Title level={4}>Echo Chatbot</Title>
                  </div>
                  <Timeline items={timelineItems} className="text-lg" />
                </Card>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default InfoPage;
