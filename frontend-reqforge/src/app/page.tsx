'use client';

import { Card, Row, Col, Statistic, Typography, Progress, Tag, Button, Space } from 'antd';
import { RocketOutlined, FileTextOutlined, ApartmentOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { reqforgeStatus, listProjects, listRequirements, listOntologyTypes } from '@/lib/api';

const { Title, Text } = Typography;

export default function HomePage() {
  const router = useRouter();
  const [apiVer, setApi] = useState('...');
  const [projCount, setProj] = useState(0);
  const [reqCount, setReq] = useState(0);
  const [ontoCount, setOnto] = useState(0);

  useEffect(() => {
    reqforgeStatus().then(d => setApi(d.version)).catch(() => setApi('离线'));
    listProjects().then(d => setProj(d.length)).catch(() => {});
    listRequirements().then(d => setReq(d.length)).catch(() => {});
    listOntologyTypes().then(d => setOnto(d.length)).catch(() => {});
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ margin: 0 }}>ReqForge 企业需求工程工作台</Title>
      <Text type="secondary" style={{ fontSize: 15 }}>API v{apiVer} · 基于 Clawith 多Agent协作平台</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 16, marginBottom: 16 }}>
        <Col span={6}><Card hoverable onClick={() => router.push('/workspace')}><Statistic title="项目" value={projCount} prefix={<RocketOutlined />} valueStyle={{ fontSize: 18, color: '#1890FF' }} /></Card></Col>
        <Col span={6}><Card hoverable><Statistic title="需求" value={reqCount} prefix={<FileTextOutlined />} valueStyle={{ fontSize: 18 }} /></Card></Col>
        <Col span={6}><Card hoverable onClick={() => router.push('/ontology')}><Statistic title="本体类型" value={ontoCount} prefix={<ApartmentOutlined />} valueStyle={{ fontSize: 18, color: '#52C41A' }} /></Card></Col>
        <Col span={6}><Card hoverable onClick={() => router.push('/artifacts')}><Statistic title="API状态" value={apiVer==='离线'?'离线':'在线'} prefix={<ExperimentOutlined />} valueStyle={{ fontSize: 18, color: apiVer==='离线'?'#FF4D4F':'#52C41A' }} /></Card></Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="MCP Server" extra={<Button type="link" size="small" onClick={() => router.push('/workspace')}>工作台→</Button>}>
            {['ontology-mcp','governance-mcp','evidence-mcp','docling-mcp','mermaid-mcp'].map(s => (
              <div key={s} style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                <Text>{s}</Text><Tag color={apiVer!=='离线'?'green':'orange'}>{apiVer!=='离线'?'就绪':'待连接'}</Tag>
              </div>))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="开发进度">
            {['Clawith底座','MCP(5个)','REST API','数据库(5表)','8 Skills','前端对接'].map(s => (
              <div key={s} style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                <Text>{s}</Text><Tag color="green">完成</Tag>
              </div>))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
