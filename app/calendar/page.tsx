"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Badge, Layout, Typography, Row, Col, Card } from "antd";
import type { Dayjs } from "dayjs";
import type { BadgeProps } from "antd";
import "antd/dist/reset.css";
import "@ant-design/v5-patch-for-react-19";

const { Content } = Layout;
const { Title, Text } = Typography;

// Define the appointment type
interface Appointment {
  id: string;
  title: string;
  time: string;
  type: "success" | "warning" | "error" | "default";
  patient: string;
  date: string;
}

// Mock appointments data
const appointments: Record<string, Appointment[]> = {
  "2024-03-18": [
    {
      id: "1",
      title: "Initial Consultation",
      time: "09:00 AM",
      type: "success",
      patient: "Yash Dagade",
      date: "2024-03-18",
    },
    {
      id: "2",
      title: "Follow-up Session",
      time: "02:30 PM",
      type: "default",
      patient: "Sarah Johnson",
      date: "2024-03-18",
    },
  ],
  "2024-03-19": [
    {
      id: "3",
      title: "Therapy Session",
      time: "11:00 AM",
      type: "warning",
      patient: "Michael Chen",
      date: "2024-03-19",
    },
  ],
  "2024-03-20": [
    {
      id: "4",
      title: "Emergency Session",
      time: "10:00 AM",
      type: "error",
      patient: "Emma Rodriguez",
      date: "2024-03-20",
    },
    {
      id: "5",
      title: "Group Therapy",
      time: "03:00 PM",
      type: "success",
      patient: "Support Group A",
      date: "2024-03-20",
    },
  ],
  "2024-03-21": [
    {
      id: "6",
      title: "Follow-up Session",
      time: "01:00 PM",
      type: "default",
      patient: "Yash Dagade",
      date: "2024-03-21",
    },
  ],
  "2024-03-22": [
    {
      id: "7",
      title: "Initial Consultation",
      time: "09:30 AM",
      type: "success",
      patient: "David Wilson",
      date: "2024-03-22",
    },
    {
      id: "8",
      title: "Therapy Session",
      time: "04:00 PM",
      type: "default",
      patient: "Sarah Johnson",
      date: "2024-03-22",
    },
  ],
};

export default function AppointmentCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // ... existing fetch logic ...
  }, []);

  const dateCellRender = (value: Dayjs) => {
    const listData = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === value.date() &&
        appointmentDate.getMonth() === value.month() &&
        appointmentDate.getFullYear() === value.year()
      );
    });

    return (
      <ul className="events">
        {listData.map((appointment) => (
          <li key={appointment.id}>
            <Badge
              status="success"
              text={`${new Date(appointment.date).toLocaleTimeString()} - ${
                appointment.patient
              }`}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Layout className="min-h-screen bg-white">
      <Content className="p-8">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Title level={2}>Appointment Calendar</Title>
          </Col>
          <Col span={24}>
            <Card className="calendar-card">
              <Calendar
                cellRender={dateCellRender}
                className="custom-calendar"
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card className="legend-card">
              <Title level={4}>Appointment Types</Title>
              <div className="flex gap-6">
                <Badge status="success" text="Initial Consultation" />
                <Badge status="default" text="Follow-up Session" />
                <Badge status="warning" text="Therapy Session" />
                <Badge status="error" text="Emergency Session" />
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
