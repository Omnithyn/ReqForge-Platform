'use client';

import { useState } from 'react';
import { Card, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login, setToken } from '@/lib/api';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function LoginPage() {
  const [username, setUsername] = useState('yaochunyang');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(username, password);
      message.success('登录成功');
      router.push('/');
    } catch {
      message.error('登录失败，请检查用户名和密码');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Title level={3}>🏗️ ReqForge</Title>
        <Input prefix={<UserOutlined />} placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)}
          style={{ marginBottom: 16 }} onPressEnter={handleLogin} />
        <Input.Password prefix={<LockOutlined />} placeholder="密码" value={password} onChange={e => setPassword(e.target.value)}
          style={{ marginBottom: 16 }} onPressEnter={handleLogin} />
        <Button type="primary" block loading={loading} onClick={handleLogin}>登录 ReqForge</Button>
        <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
          Clawith 账号登录 · 首次使用请先在 http://localhost:3008 注册
        </div>
      </Card>
    </div>
  );
}
