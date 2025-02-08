'use client';

import React from 'react';
import { Layout, Menu, Row, Col, Card, Typography, Timeline, Avatar, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const InfoPage = () => {
  const today = new Date().toLocaleDateString();

  const timelineItems = [
    {
      children: <><Text strong>00:00</Text> — <Text>Hello! How can I help?</Text></>
    },
    {
      children: <><Text strong>00:01</Text> — <Text>Tell me about Josh's recent problems</Text></>
    },
    {
      children: <><Text strong>00:02</Text> — <Text>Sure! [Chatbot reply text...]</Text></>
    }
  ];

  return (
    <Layout className="min-h-screen">
      {/* Navigation Header */}
      <Header className="bg-white border-b p-4">
        <Row>
          <Col flex="200px">
            <Text strong>{today}</Text>
          </Col>
          <Col flex="auto">
            <Menu 
              mode="horizontal" 
              className="border-none justify-end"
              defaultSelectedKeys={['1']}
              items={[
                { key: '1', label: 'Patients' },
                { key: '2', label: 'Schedule' },
                { key: '3', label: 'XYZ' },
                { key: '4', label: 'XYZ' }
              ]}
            />
          </Col>
        </Row>
      </Header>

      {/* Main Content */}
      <Content className="p-4">
        <Row gutter={16}>
          {/* Left Column: Patient Info */}
          <Col xs={24} md={8}>
            <Card
              title="PATIENT PHOTO"
              className="mb-4"
              cover={
                <Avatar
                  shape="square"
                  icon={<UserOutlined />}
                  className="w-full h-[200px] object-cover"
                />
              }
            >
              <div className="space-y-2">
                <div>
                  <Text strong>NAME: </Text>
                  <Text>Josh</Text>
                </div>
                <div>
                  <Text strong>AGE: </Text>
                  <Text>ABC</Text>
                </div>
                <div>
                  <Text strong>LOCATION: </Text>
                  <Text>ABC</Text>
                </div>
                <div>
                  <Text strong>CLIENT SINCE: </Text>
                  <Text>ABC</Text>
                </div>
                <Divider />
                <div>
                  <Text strong>ABOUT: </Text>
                  <Text>XYZ</Text>
                </div>
                <div>
                  <Text strong>LOCATION: </Text>
                  <Text>XYZ</Text>
                </div>
                <div>
                  <Text strong>MEDICATION: </Text>
                  <Text>N/A</Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* Right Column: Transcripts / Chatbot */}
          <Col xs={24} md={16}>
            <Card 
              title="PREVIOUS RECORDING TRANSCRIPS" 
              className="mb-4"
            >
              <Title level={5}>ECHO CHATBOT</Title>
              <Timeline items={timelineItems} />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default InfoPage;
