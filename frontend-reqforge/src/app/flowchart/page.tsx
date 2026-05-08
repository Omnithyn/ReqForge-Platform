'use client';
import { Card, Typography, Empty } from 'antd';
const { Title, Text } = Typography;
export default function Page() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>流程图</Title>
      <Text type="secondary">业务流程设计与 BPMN 建模</Text>
      <Card style={{ marginTop: 24, minHeight: 400 }}>
        <Empty description="功能开发中，敬请期待" />
      </Card>
    </div>
  );
}
