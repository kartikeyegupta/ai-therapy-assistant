"use client";
import React, { useRef, useEffect, useState } from "react";
import { Button, Typography, Card, Row, Col, Space, Layout, Modal } from "antd";
import Link from "next/link";
import "@ant-design/v5-patch-for-react-19";

const { Title, Paragraph, Text } = Typography;
const { Header, Footer, Content } = Layout;

const testimonials = [
  {
    id: 1,
    comment: "Echo saves me 5+ hours every week on documentation.",
    author: "Dr. Sarah Johnson",
    role: "Clinical Psychologist",
    avatar: "/therapist1.jpg",
  },
  {
    id: 2,
    comment: "The AI insights help me provide better care.",
    author: "Mark Thompson",
    role: "Licensed Therapist",
    avatar: "/therapist3.jpg",
  },
  {
    id: 3,
    comment: "Finally, I can be fully present during sessions.",
    author: "Dr. Emily Chen",
    role: "Family Therapist",
    avatar: "/therapist2.jpg",
  },
];

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
  }, []);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  return (
    <Layout className="min-h-screen">
      {/* Navigation Header */}
      <Header
        style={{ background: "none", border: "none" }}
        className="absolute w-full z-10"
      >
        <div className="w-full px-4 flex justify-between items-center h-full">
          <Space align="center" className="absolute left-8" size="middle">
            <img
              src="/logo.png"
              alt="Echo Logo"
              className="h-12 w-12 object-contain"
            />
            <Text strong className="text-3xl text-green-700">
              Echo
            </Text>
          </Space>
          <Space className="absolute right-8">
            <Link href="/current">
              <Button type="primary" size="large" className="text-lg px-8">
                Try Echo
              </Button>
            </Link>
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
              Echo helps therapists focus on their clients. Our AI-powered
              platform automates note-taking and provides insights, saving you
              hours each week while improving documentation quality.
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
              Trusted by thousands of mental health professionals across the
              globe
            </Text>
            <Text className="text-gray-600 text-xl">
              Join the community of therapists who save 5+ hours every week with
              Echo
            </Text>
          </div>

          {/* Testimonials */}
          <div className="mb-20">
            <Title level={2} className="text-center mb-12">
              Trusted by Leading Therapists
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
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleImageClick(testimonial.avatar)}
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

          {/* CTA Section */}
          <div className="text-center">
            <Button type="primary" size="large" className="px-8">
              Start Free Trial
            </Button>
          </div>

          <div className="text-center mt-4">
            <Link href="/calendar">
              <Button
                type="primary"
                className="min-w-[120px]"
                style={{ backgroundColor: "#7ED957" }}
              >
                Schedule
              </Button>
            </Link>
          </div>
        </div>
      </Content>

      <Footer className="bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <Text type="secondary">© 2024 Echo. All rights reserved.</Text>
        </div>
      </Footer>

      <Modal
        open={!!selectedImage}
        footer={null}
        onCancel={() => setSelectedImage(null)}
        width="auto"
        centered
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Enlarged therapist"
            className="max-h-[80vh] w-auto"
          />
        )}
      </Modal>
    </Layout>
  );
}
