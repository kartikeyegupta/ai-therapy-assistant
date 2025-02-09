"use client";

import React, { useState } from "react";
import { Select, Calendar, Badge, Card, Typography } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

const fakeAppointments = [
  {
    date: "2025-02-10",
    title: "Initial Consultation - Emily Chen",
  },
  {
    date: "2025-02-10",
    title: "Follow-up Session - Marcus Thompson",
  },
  {
    date: "2025-02-12",
    title: "Group Therapy Session A",
  },
  {
    date: "2025-02-12",
    title: "Couples Counseling - Johnson Family",
  },
  {
    date: "2025-02-15",
    title: "Emergency Session - Sarah Williams",
  },
  {
    date: "2025-02-15",
    title: "Initial Consultation - David Rodriguez",
  },
  {
    date: "2025-02-17",
    title: "Follow-up Session - Lisa Parker",
  },
  {
    date: "2025-02-17",
    title: "Anxiety Management - Michael Brown",
  },
  {
    date: "2025-02-19",
    title: "Depression Counseling - James Wilson",
  },
  {
    date: "2025-02-20",
    title: "PTSD Treatment - Robert Miller",
  },
];

const getAppointmentsForDate = (date) => {
  return fakeAppointments.filter((appt) => appt.date === date);
};

const WeeklyMonthlyCalendar = () => {
  const [view, setView] = useState("Month");
  const [currentDate, setCurrentDate] = useState(dayjs());

  const handleViewChange = (value) => {
    setView(value);
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const appointments = getAppointmentsForDate(formattedDate);

    return (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {appointments.map((appt, index) => (
          <li key={index}>
            <Badge status="success" text={appt.title} />
          </li>
        ))}
      </ul>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = currentDate.startOf("week");
    const days = Array.from({ length: 5 }, (_, i) =>
      startOfWeek.add(i + 1, "day")
    );

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
          height: "calc(100vh - 150px)",
        }}
      >
        {days.map((day, index) => (
          <Card
            key={index}
            title={day.format("dddd, MMM D")}
            style={{ height: "100%" }}
          >
            {dateCellRender(day)}
          </Card>
        ))}
      </div>
    );
  };

  const headerRender = () => {
    return null;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Select
          value={view}
          onChange={handleViewChange}
          style={{ width: "150px" }}
        >
          <Option value="Month">Month</Option>
          <Option value="Week">Week</Option>
        </Select>
        <Title level={4}>{currentDate.format("MMMM YYYY")}</Title>
      </div>
      {view === "Month" ? (
        <Calendar dateCellRender={dateCellRender} headerRender={headerRender} />
      ) : (
        renderWeekView()
      )}
    </div>
  );
};

export default WeeklyMonthlyCalendar;

/*"use client";

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
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");

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
                mode={calendarView}
                onPanelChange={(date, mode) =>
                  setCalendarView(mode as "month" | "week")
                }
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
}*/
