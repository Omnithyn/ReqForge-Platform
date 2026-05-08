'use client';

import { Card, Row, Col, Statistic, Typography, Progress, Space, Tag, Button } from 'antd';
import {
  RocketOutlined, FileTextOutlined, ApartmentOutlined, ExperimentOutlined,
  CheckCircleOutlined, ClockCircleOutlined, WarningOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>ReqForge 企业需求工程工作台</Title>
        <Text type="secondary" style={{ fontSize: 15 }}>
          以交互式工作台为入口，以智能体驾驭为底座，将需求工作从文档编写升级为可追溯、可评审、可生成、可复用的研发准备过程。
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card hoverable onClick={() => router.push('/workspace')}>
            <Statistic title="当前项目" value="智慧理赔平台建设" prefix={<RocketOutlined />} valueStyle={{ fontSize: 18 }} />
            <Text type="secondary">需求设计进行中</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => router.push('/documents')}>
            <Statistic title="文档总数" value={128} prefix={<FileTextOutlined />} suffix={<span style={{ fontSize: 12, color: '#52c41a' }}>+12</span>} />
            <Progress percent={72} size="small" strokeColor="#52C41A" />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => router.push('/ontology')}>
            <Statistic title="本体对象" value={64} prefix={<ApartmentOutlined />} suffix={<span style={{ fontSize: 12, color: '#52c41a' }}>+6</span>} />
            <Text type="secondary">已建立关系 86 条</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => router.push('/artifacts')}>
            <Statistic title="研发准备包" value="8/8" prefix={<ExperimentOutlined />} valueStyle={{ fontSize: 18, color: '#52c41a' }} />
            <Text type="secondary">评审通过 · 就绪度 96%</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="需求设计进度" extra={<Button type="link" size="small" onClick={() => router.push('/workspace')}>进入工作台 →</Button>}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {[
                { label: '文档解析', status: 'done' },
                { label: '需求抽取', status: 'done' },
                { label: '本体建模', status: 'done' },
                { label: '流程设计', status: 'progress' },
                { label: '原型设计', status: 'pending' },
                { label: '接口生成', status: 'pending' },
                { label: '测试生成', status: 'pending' },
                { label: '质量评审', status: 'pending' },
                { label: '研发准备包', status: 'pending' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>{item.label}</Text>
                  {item.status === 'done' ? <Tag color="green">已完成</Tag> :
                   item.status === 'progress' ? <Tag color="blue">进行中</Tag> :
                   <Tag>待开始</Tag>}
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="MCP Server 状态">
            <Space direction="vertical" style={{ width: '100%' }}>
              {[
                { name: 'ontology-mcp', desc: '本体建模引擎', ok: true },
                { name: 'governance-mcp', desc: '规则匹配引擎', ok: true },
                { name: 'evidence-mcp', desc: '证据追溯引擎', ok: true },
                { name: 'docling-mcp', desc: '文档解析服务', ok: false },
                { name: 'mermaid-mcp', desc: '流程图生成服务', ok: false },
              ].map(s => (
                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>{s.name}</Text>
                    <br /><Text type="secondary" style={{ fontSize: 12 }}>{s.desc}</Text>
                  </div>
                  <Tag color={s.ok ? 'green' : 'orange'}>{s.ok ? '就绪' : '待实现'}</Tag>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
