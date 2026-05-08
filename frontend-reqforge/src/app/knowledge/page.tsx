'use client';
import { Card, Typography, Empty } from 'antd';
const { Title, Text } = Typography;
export default function Page() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>知识库</Title>
      <Text type="secondary">行业知识、业务术语、规则案例和 FAQ</Text>
      <Card style={{ marginTop: 24, minHeight: 400 }}>
        <Empty description="功能开发中，敬请期待" />
      </Card>
    </div>
  );
}
