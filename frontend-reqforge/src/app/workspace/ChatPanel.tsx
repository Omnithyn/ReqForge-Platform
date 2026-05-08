'use client';

import { Card, Input, Button, Space, Typography, Avatar } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { reqforgeStatus } from '@/lib/api';

const { Paragraph } = Typography;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'system',
    content: '🔌 正在连接 ReqForge 平台...',
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reqforgeStatus().then(data => {
      const mcpList = data.mcp_servers?.join(', ') || '无';
      setMessages(prev => [...prev.slice(0, -1), {
        role: 'assistant',
        content: `👋 欢迎使用 ReqForge 需求工程工作台！\n\n已连接 MCP 服务: ${mcpList}\n\n请上传业务文档或直接描述您的需求。`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }).catch(() => {
      setMessages(prev => [...prev.slice(0, -1), {
        role: 'assistant',
        content: '⚠️ 无法连接 ReqForge 后端 (http://localhost:3008)。请确认 Clawith Docker 正在运行。',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    });
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      role: 'user', content: input,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await reqforgeStatus();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ ReqForge API v${data.version} 在线\nMCP 服务: ${data.mcp_servers.join(', ')}\n\n需求分析功能准备就绪。请上传文档开始分析。`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ API 连接失败。请确认 Clawith 后端正在运行 (http://localhost:3008)。',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
    setLoading(false);
  };

  return (
    <Card title="需求对话" className="h-full" styles={{ body: { height: 'calc(100% - 56px)', padding: 0 } }}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <Avatar
                icon={msg.role === 'user' ? <UserOutlined /> : msg.role === 'system' ? <UserOutlined /> : <RobotOutlined />}
                className={msg.role === 'user' ? 'bg-[#1890FF]' : msg.role === 'system' ? 'bg-orange-400' : 'bg-[#52C41A]'}
                size={36}
              />
              <div className={`max-w-[70%] px-4 py-3 rounded-lg ${msg.role === 'user' ? 'bg-[#E6F4FF]' : msg.role === 'system' ? 'bg-orange-50' : 'bg-[#F6FFED]'}`}>
                <Paragraph className="!mb-1 !text-sm whitespace-pre-wrap">{msg.content}</Paragraph>
                <span className="text-xs text-gray-400">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-400 px-4">
              <div className="w-2 h-2 bg-[#1890FF] rounded-full animate-bounce" />
              <span className="text-sm">AI 正在思考...</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <Space.Compact className="w-full">
            <Button icon={<UploadOutlined />}>上传文档</Button>
            <Input value={input} onChange={e => setInput(e.target.value)} onPressEnter={handleSend}
              placeholder="描述您的需求，或上传业务文档..." className="flex-1" />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={loading}>发送</Button>
          </Space.Compact>
        </div>
      </div>
    </Card>
  );
}
