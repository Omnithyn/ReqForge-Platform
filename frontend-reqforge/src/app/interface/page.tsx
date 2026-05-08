'use client';
import { Card, Typography, Empty } from 'antd';
const { Title, Text } = Typography;
export default function Page() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>接口与数据</Title>
      <Text type="secondary">OpenAPI 草案与数据字典</Text>
      <Card style={{ marginTop: 24, minHeight: 400 }}>
        <Empty description="功能开发中，敬请期待" />
      </Card>
    </div>
  );
}
