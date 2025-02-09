"use client";

import React, { useState } from "react";
import { Select, Calendar, Badge, Card, Typography, Layout } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;
const { Content } = Layout;

type Appointment = {
  date: string;
  title: string;
};

const fakeAppointments: Appointment[] = [
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

const getAppointmentsForDate = (date: string): Appointment[] => {
  return fakeAppointments.filter((appt) => appt.date === date);
};

const WeeklyMonthlyCalendar: React.FC = () => {
  const [view, setView] = useState<"Month" | "Week">("Month");
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());

  const handleViewChange = (value: "Month" | "Week") => {
    setView(value);
  };

  const cellRender = (current: Dayjs, info: { type: 'date' | 'month' }) => {
    if (info.type !== 'date') return null;
    
    const formattedDate = current.format("YYYY-MM-DD");
    const appointments = getAppointmentsForDate(formattedDate);

    return (
      <ul className="list-none p-0 m-0">
        {appointments.map((appt, index) => (
          <li key={index} className="mb-1">
            <Badge 
              status="success" 
              text={appt.title} 
              className="text-sm"
            />
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
      <div className="grid grid-cols-5 gap-4 h-[calc(100vh-200px)]">
        {days.map((day, index) => (
          <Card
            key={index}
            title={day.format("dddd, MMM D")}
            className="h-full overflow-auto"
            bodyStyle={{ padding: "12px" }}
          >
            {cellRender(day, { type: 'date' })}
          </Card>
        ))}
      </div>
    );
  };

  const headerRender = () => null;

  return (
    <Layout className="min-h-screen">
      <Content className="bg-green-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <Select
              value={view}
              onChange={handleViewChange}
              className="w-32"
              size="large"
            >
              <Option value="Month">Month</Option>
              <Option value="Week">Week</Option>
            </Select>
            <Title level={4} className="m-0">
              {currentDate.format("MMMM YYYY")}
            </Title>
          </div>

          <Card className="shadow-lg">
            {view === "Month" ? (
              <Calendar 
                cellRender={cellRender} 
                headerRender={headerRender}
                className="bg-white rounded-lg"
              />
            ) : (
              renderWeekView()
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default WeeklyMonthlyCalendar;
