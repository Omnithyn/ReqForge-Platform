'use client';

import { useState } from 'react';
import { Card, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!identifier || !password) return;
    setLoading(true);
    try { await login(identifier, password); message.success('登录成功'); router.push('/'); }
    catch { message.error('登录失败，请检查账号密码'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #1A2B4A 0%, #2D4A7A 100%)', display:'flex', justifyContent:'center', alignItems:'center' }}>
      <Card style={{ width:420, borderRadius:12, boxShadow:'0 8px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🏗️</div>
          <Title level={2} style={{ margin:0 }}>ReqForge</Title>
          <Text type="secondary">企业需求工程工作台</Text>
        </div>
        <Input size="large" prefix={<UserOutlined />} placeholder="用户名或邮箱" value={identifier}
          onChange={e => setIdentifier(e.target.value)} style={{ marginBottom:16 }} onPressEnter={handleLogin} />
        <Input.Password size="large" prefix={<LockOutlined />} placeholder="密码" value={password}
          onChange={e => setPassword(e.target.value)} style={{ marginBottom:24 }} onPressEnter={handleLogin} />
        <Button type="primary" size="large" block icon={<LoginOutlined />} loading={loading} onClick={handleLogin}>登录</Button>
        <div style={{ marginTop:24, textAlign:'center' }}>
          <Text type="secondary" style={{ fontSize:12 }}>
            新用户请在 Clawith 管理后台注册 <a href="http://localhost:3008" target="_blank">打开 →</a>
          </Text>
        </div>
      </Card>
    </div>
  );
}
