'use client';

import { Card, Input, Button, Space, Typography, Avatar, Badge } from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  UploadOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

const { Paragraph } = Typography;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 欢迎使用 ReqForge 需求工程工作台！我已准备好协助您完成需求分析。请上传业务文档或直接描述您的需求。',
      timestamp: '10:30',
    },
    {
      role: 'user',
      content: '我需要设计一个车险理赔系统，包含报案、查勘、定损、核赔、支付等核心流程。',
      timestamp: '10:32',
    },
    {
      role: 'assistant',
      content: '收到！我将为您分析车险理赔系统的需求。首先进行文档解析，提取关键业务流程...',
      timestamp: '10:32',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '正在分析您的需求...（当前为 UI 预览模式）',
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Card
      title="需求对话"
      className="h-full"
      styles={{ body: { height: 'calc(100% - 56px)', padding: 0 } }}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar
                icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                className={msg.role === 'user' ? 'bg-[#1890FF]' : 'bg-[#52C41A]'}
                size={36}
              />
              <div
                className={`max-w-[70%] px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-[#E6F4FF] text-right'
                    : 'bg-[#F6FFED] text-left'
                }`}
              >
                <Paragraph className="!mb-1 !text-sm">{msg.content}</Paragraph>
                <span className="text-xs text-gray-400">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-[#1890FF] rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[#1890FF] rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-[#1890FF] rounded-full animate-bounce delay-200" />
              <span className="text-sm ml-2">AI 正在思考...</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <Space.Compact className="w-full">
            <Button icon={<UploadOutlined />} className="flex-shrink-0">
              上传
            </Button>
            <Button icon={<CheckSquareOutlined />} className="flex-shrink-0">
              任务
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              placeholder="描述您的需求，或上传文档开始分析..."
              className="flex-1"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
              className="flex-shrink-0"
            >
              发送
            </Button>
          </Space.Compact>
        </div>
      </div>
    </Card>
  );
}
