'use client';

import { Card, Typography, Empty, Space, Tag, Button, Row, Col } from 'antd';
import { PlusOutlined, ApartmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function OntologyPage() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>本体建模</Title>
          <Text type="secondary">管理业务对象、属性、关系和规则</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>新建本体对象</Button>
      </div>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="本体关系图" style={{ minHeight: 500 }}>
            <Empty
              image={<ApartmentOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
              description="暂无本体数据。从需求工作台上传文档并完成需求分析后，本体关系图将在此展示。"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="对象类型" size="small" style={{ marginBottom: 16 }}>
            <Space wrap>
              <Tag color="blue">业务主体</Tag>
              <Tag color="green">业务对象</Tag>
              <Tag color="orange">业务流程</Tag>
              <Tag color="purple">数据字段</Tag>
              <Tag color="red">接口服务</Tag>
            </Space>
          </Card>
          <Card title="关系类型" size="small" style={{ marginBottom: 16 }}>
            <Space direction="vertical">
              <Text>→ 需求来源于文档</Text>
              <Text>→ 规则约束字段</Text>
              <Text>→ 页面展示字段</Text>
              <Text>→ 接口使用字段</Text>
              <Text>→ 测试覆盖规则</Text>
            </Space>
          </Card>
          <Card title="MCP 后端" size="small">
            <Text type="secondary">ontology-mcp 提供本体建模能力</Text>
            <br />
            <Text type="secondary">Apache AGE 提供图查询能力</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}


