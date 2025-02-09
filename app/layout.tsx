import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
import { ConfigProvider } from "antd";
import '@ant-design/v5-patch-for-react-19';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Echo - AI Automation for Therapists",
  description: "Automate note-taking and engage with patient history through AI-powered conversations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className}`}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#16a34a",
              colorInfo: "#3b82f6",
              borderRadius: 8,
            },
            components: {
              Layout: {
                headerBg: 'transparent',
                colorSplit: 'transparent',
              },
              Typography: {
                fontSizeHeading1: 72,
                colorTextHeading: '#16a34a'
              }
            }
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
