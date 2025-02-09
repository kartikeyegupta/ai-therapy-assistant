"use client";
import React, { useRef, useEffect } from "react";
import { Button, Typography, Card, Row, Col, Space, Layout } from "antd";
import Link from "next/link";
import "@ant-design/v5-patch-for-react-19";
import {
  StarOutlined,
  ClockCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Header, Footer, Content } = Layout;

const testimonials = [
  {
    id: 1,
    comment:
      "I spend 3+ hours daily on EHR documentation instead of focusing on my patients.",
    author: "Dr. Sarah Johnson",
    role: "Clinical Psychologist",
    avatar: "/therapist1.png",
  },
  {
    id: 2,
    comment:
      "Managing paperwork takes up 40% of my time that could be spent helping clients.",
    author: "Mark Thompson",
    role: "Licensed Therapist",
    avatar: "/therapist3.png",
  },
  {
    id: 3,
    comment:
      "Between sessions, notes, and admin work, I barely have time to properly prepare.",
    author: "Dr. Emily Chen",
    role: "Family Therapist",
    avatar: "/therapist2.png",
  },
  {
    id: 4,
    comment:
      "Documentation burnout is real. We need a better solution for mental health professionals.",
    author: "Dr. Michael Rivera",
    role: "Psychiatrist",
    avatar: "/therapist4.jpg",
  },
];

const features = [
  {
    icon: <StarOutlined className="text-2xl" />,
    title: "AI-Powered Notes",
    description:
      "Automatically generate comprehensive session notes using advanced AI technology.",
  },
  {
    icon: <ClockCircleOutlined className="text-2xl" />,
    title: "Save Time",
    description:
      "Reduce administrative work by hours each week with automated documentation.",
  },
  {
    icon: <MessageOutlined className="text-2xl" />,
    title: "Real-Time Chat",
    description:
      "Engage in real-time conversations to better understand patients and their conditions.",
  },
];

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      const scrollWidth = carousel.scrollWidth;
      const animationDuration = scrollWidth / 50;
      carousel.style.setProperty("--scroll-width", `${scrollWidth}px`);
      carousel.style.setProperty(
        "--animation-duration",
        `${animationDuration}s`
      );
    }

    const leaves = leavesRef.current;
    if (leaves) {
      setTimeout(() => {
        leaves.style.transition = "opacity 1s ease-out";
        leaves.style.opacity = "0";
      }, 6000);

      setTimeout(() => {
        leaves.style.display = "none";
      }, 7000);
    }
  }, []);

  return (
    <Layout className="min-h-screen">
      <div id="leaves" ref={leavesRef}>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>

      <Header
        style={{ background: "none", border: "none" }}
        className="absolute w-full z-10"
      >
        <div className="w-full px-4 flex justify-between items-center h-full">
          <Space align="center" className="absolute left-8" size="middle">
            <img
              src="/logo.png"
              alt="Echo Logo"
              className="h-16 w-16 object-contain"
            />
            <Text strong className="text-3xl text-green-700">
              Echo
            </Text>
          </Space>
          <Space className="absolute right-8">
            <Link href="/current">
              <Button
                type="primary"
                size="large"
                className="text-xl px-12 py-6 h-auto font-semibold hover:scale-105 transition-transform"
              >
                Try Echo
              </Button>
            </Link>
          </Space>
        </div>
      </Header>

      <Content className="bg-green-50">
        <div className="max-w-7xl mx-auto px-4 py-16 pt-32">
          <div className="text-center mb-12">
            <Title level={1} className="text-4xl md:text-5xl mb-6">
              Transform Your Therapy Practice
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
              Echo helps therapists focus on their clients. Our AI-powered
              platform automates note-taking and provides insights, saving you
              hours each week while improving documentation quality.
            </Paragraph>
          </div>

          <div className="mb-20">
            <div className="relative w-full max-w-4xl mx-auto bg-green-50 rounded-xl overflow-hidden">
              <iframe
                className="w-full aspect-video"
                src="https://www.youtube.com/embed/Eudud6eaGBk"
                title="Two-Minute Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className="text-center mb-20">
            <Link href="/current">
              <Button
                type="primary"
                size="large"
                className="text-xl px-12 py-6 h-auto font-semibold hover:scale-105 transition-transform"
              >
                Try Echo Now
              </Button>
            </Link>
          </div>

          <div className="mb-20 text-center">
            <Text className="text-gray-600 text-2xl font-medium block mb-3">
              Therapists spend a staggering 49.2% of their workday on
              documentation
            </Text>
            <Text className="text-gray-600 text-xl">
              Echo helps therapists focus on their clients not on paperwork
            </Text>
          </div>

          <div className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
            <Row gutter={24} justify="space-between">
              {features.map((feature, index) => (
                <Col key={index} xs={24} md={8} className="mb-8 md:mb-0">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-5">
                      <div className="text-3xl">{feature.icon}</div>
                    </div>
                    <Title level={3} className="!text-2xl !mb-3 !text-gray-800">
                      {feature.title}
                    </Title>
                    <Text className="text-gray-600 text-lg leading-relaxed max-w-sm">
                      {feature.description}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          <div className="mb-20">
            <Title level={2} className="text-center mb-12">
              Leading Therepists Need Echo
            </Title>
            <div className="carouselContainer">
              <div className="fadeLeft" />
              <div className="fadeRight" />
              <div className="carousel" ref={carouselRef}>
                <div className="carouselTrack">
                  {[...testimonials, ...testimonials].map(
                    (testimonial, index) => (
                      <Card
                        key={`${testimonial.id}-${index}`}
                        className="feedbackCard"
                      >
                        <div className="flex items-start space-x-4 p-4">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <Paragraph className="text-base mb-2 font-medium">
                              "{testimonial.comment}"
                            </Paragraph>
                            <Text strong className="block text-sm">
                              {testimonial.author}
                            </Text>
                            <Text type="secondary" className="text-xs">
                              {testimonial.role}
                            </Text>
                          </div>
                        </div>
                      </Card>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Footer className="bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <Text type="secondary">© 2025 Echo. All rights reserved.</Text>
        </div>
      </Footer>
    </Layout>
  );
}
