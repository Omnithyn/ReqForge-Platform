'use client';

import { Card, Row, Col, Statistic, Typography, Progress, Tag, Button, Space } from 'antd';
import { RocketOutlined, FileTextOutlined, ApartmentOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { reqforgeStatus } from '@/lib/api';

const { Title, Text } = Typography;

export default function HomePage() {
  const router = useRouter();
  const [apiVersion, setApiVersion] = useState('...');
  const [mcpList, setMcpList] = useState<string[]>([]);

  useEffect(() => {
    reqforgeStatus().then(data => {
      setApiVersion(data.version);
      setMcpList(data.mcp_servers || []);
    }).catch(() => setApiVersion('离线'));
  }, []);

  const mcpDefs = [
    { name: 'ontology-mcp', desc: '本体建模引擎', key: 'ontology' },
    { name: 'governance-mcp', desc: '规则匹配引擎', key: 'governance' },
    { name: 'evidence-mcp', desc: '证据追溯引擎', key: 'evidence' },
    { name: 'docling-mcp', desc: '文档解析服务', key: 'docling' },
    { name: 'mermaid-mcp', desc: '流程图生成服务', key: 'mermaid' },
  ];

  const devProgress = [
    { label: 'Clawith 底座', done: true },
    { label: 'MCP Servers (5个)', done: mcpList.length >= 3 },
    { label: '数据库 (5表)', done: true },
    { label: 'REST API', done: true },
    { label: '8 领域 Skills', done: true },
    { label: 'Checkpointing + Sandbox', done: true },
    { label: '前端 13 页面', done: true },
    { label: '端到端 DEMO', done: false },
    { label: 'Apache AGE 图关系', done: false },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>ReqForge 企业需求工程工作台</Title>
        <Text type="secondary" style={{ fontSize: 15 }}>
          API v{apiVersion} · 基于 Clawith 多Agent协作平台
        </Text>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card hoverable onClick={() => router.push('/workspace')}>
            <Statistic title="当前状态" value={apiVersion === '离线' ? '离线' : '在线'} prefix={<RocketOutlined />}
              valueStyle={{ fontSize: 18, color: apiVersion === '离线' ? '#FF4D4F' : '#52C41A' }} />
            <Text type="secondary">ReqForge Platform API</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => router.push('/workspace')}>
            <Statistic title="MCP 服务" value={mcpList.length} suffix="/ 5" prefix={<ExperimentOutlined />} valueStyle={{ fontSize: 18 }} />
            <Progress percent={mcpList.length * 20} size="small" strokeColor={mcpList.length === 5 ? '#52C41A' : '#FA8C16'} />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => router.push('/ontology')}>
            <Statistic title="数据库" value={apiVersion !== '离线' ? '已连接' : '未连接'} prefix={<ApartmentOutlined />}
              valueStyle={{ fontSize: 18, color: apiVersion !== '离线' ? '#52C41A' : '#FF4D4F' }} />
            <Text type="secondary">PostgreSQL + 5张表</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => router.push('/artifacts')}>
            <Statistic title="设计文档" value="v1.0" prefix={<FileTextOutlined />} valueStyle={{ fontSize: 18, color: '#1890FF' }} />
            <Text type="secondary">docs/design/</Text>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="MCP Server 状态" extra={<Button type="link" size="small" onClick={() => router.push('/workspace')}>工作台 →</Button>}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {mcpDefs.map(s => (
                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><Text strong>{s.name}</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>{s.desc}</Text></div>
                  <Tag color={mcpList.includes(s.key) ? 'green' : 'orange'}>{mcpList.includes(s.key) ? '就绪' : '未注册'}</Tag>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="开发进度">
            <Space direction="vertical" style={{ width: '100%' }}>
              {devProgress.map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>{item.label}</Text>
                  {item.done ? <Tag color="green">完成</Tag> : <Tag>待完成</Tag>}
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
