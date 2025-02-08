"use client";

import '@ant-design/v5-patch-for-react-19';
import React, { useState } from "react";
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
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const InfoPage = () => {
  const [selectedSession, setSelectedSession] = useState("2024-01-21");

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const patients = [
    { key: "1", label: "Yash Dagade" },
    { key: "2", label: "Sarah Johnson" },
    { key: "3", label: "Michael Chen" },
    { key: "4", label: "Emma Rodriguez" },
  ];

  const clientsMenu: MenuProps["items"] = patients.map((patient) => ({
    key: patient.key,
    label: patient.label,
  }));

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
        <Header className="bg-white p-4">
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong className="text-lg">
                {today}
              </Text>
            </Col>
            <Col>
              <Space size="middle">
                <Dropdown menu={{ items: clientsMenu }} placement="bottomRight">
                  <Button
                    type="primary"
                    className="min-w-[120px]"
                    style={{ backgroundColor: "#7ED957" }}
                  >
                    Clients
                  </Button>
                </Dropdown>
                <Button
                  type="primary"
                  className="min-w-[120px]"
                  style={{ backgroundColor: "#7ED957" }}
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
            <Col xs={24} md={10}>
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
                        src="/Yash.jpeg"
                        icon={<UserOutlined />}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                        style={{ position: "absolute" }}
                      />
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer text-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <Text strong>Name: </Text>
                    <Text>Yash Dagade</Text>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
                    <Text strong>Age: </Text>
                    <Text>18 years old</Text>
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
                title={
                  <span className="text-xl">
                    Session on {selectedSession.split("-").reverse().join("/")}
                  </span>
                }
                className="mb-6"
                extra={
                  <Space>
                    <Button type="primary">View Transcript</Button>
                    <Select
                      defaultValue="2024-01-21"
                      style={{ width: 200 }}
                      options={[
                        { value: "2024-01-11", label: "11th January, 2024" },
                        { value: "2024-01-21", label: "21st January, 2024" },
                      ]}
                      className="text-lg"
                      onChange={(value) => setSelectedSession(value)}
                    />
                  </Space>
                }
              >
                <div className="space-y-6">
                  <div>
                    <Title level={4}>Echo Summary</Title>
                    <Text>
                      In this session, Yash showed notable progress in managing
                      his work-related anxiety and imposter syndrome. He
                      reported successfully implementing several coping
                      strategies, including daily mindfulness practices and
                      boundary-setting at work. Key developments include: 1.
                      Reduced anxiety around team meetings through preparation
                      and breathing exercises 2. Successfully managed a
                      high-pressure project deadline without overwhelming stress
                      3. Started setting boundaries with colleagues regarding
                      after-hours work communications 4. Continued his
                      consistent exercise routine. Areas for continued focus
                      include building self-confidence in professional settings
                      and developing more robust stress management techniques
                      for unexpected workplace changes. Yash expressed interest
                      in exploring additional cognitive behavioral techniques in
                      future sessions to address persistent self-doubt patterns.
                    </Text>
                  </div>

                  <Divider />

                  <div>
                    <Title level={4}>Your Summary</Title>
                    <Text>
                      {/* This section will be populated from your external source */}
                      [Your summary content will go here]
                    </Text>
                  </div>
                </div>
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
