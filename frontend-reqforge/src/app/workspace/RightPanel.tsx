'use client';

import { Card, Typography, Tag, Badge, Space, List, Button } from 'antd';
import {
  FileTextOutlined,
  NodeIndexOutlined,
  SketchOutlined,
  DatabaseOutlined,
  ApiOutlined,
  ExperimentOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const outputs = [
  { key: 'prd', name: 'PRD', version: 'v1.1', status: 'done', icon: <FileTextOutlined /> },
  { key: 'bpmn', name: 'BPMN', version: 'v1.0', status: 'progress', icon: <NodeIndexOutlined /> },
  { key: 'axure', name: 'Axure', version: 'v1.0', status: 'pending', icon: <SketchOutlined /> },
  { key: 'datadict', name: 'Data Dict', version: 'v1.0', status: 'pending', icon: <DatabaseOutlined /> },
  { key: 'api', name: 'API Spec', version: 'v0.9', status: 'pending', icon: <ApiOutlined /> },
  { key: 'test', name: 'Test Cases', version: 'v0.5', status: 'pending', icon: <ExperimentOutlined /> },
];

const pendingConfirmations = [
  { key: 1, title: '业务流程图确认', description: '车险理赔流程图需要您确认', time: '10分钟前' },
  { key: 2, title: '数据字典审核', description: '核心实体字段定义待确认', time: '30分钟前' },
];

const riskAlerts = [
  { key: 1, title: '需求完整性风险', level: 'high', description: '部分非功能需求未定义' },
  { key: 2, title: '接口依赖风险', level: 'medium', description: '第三方接口文档缺失' },
];

export function RightPanel() {
  return (
    <div className="space-y-4">
      <Card
        title={<Title level={5} className="!m-0">输出物清单</Title>}
        size="small"
        styles={{ body: { padding: 12 } }}
      >
        <List
          size="small"
          dataSource={outputs}
          renderItem={(item) => (
            <List.Item className="!py-2">
              <div className="flex items-center justify-between w-full">
                <Space size="small">
                  <span className="text-gray-400">{item.icon}</span>
                  <Text className="text-sm">{item.name}</Text>
                  <Text className="text-xs text-gray-400">{item.version}</Text>
                </Space>
                {item.status === 'done' && (
                  <Tag color="success" icon={<CheckCircleOutlined />} className="!text-xs">
                    已完成
                  </Tag>
                )}
                {item.status === 'progress' && (
                  <Tag color="processing" icon={<ClockCircleOutlined />} className="!text-xs">
                    进行中
                  </Tag>
                )}
                {item.status === 'pending' && (
                  <Tag color="default" className="!text-xs">待处理</Tag>
                )}
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Card
        title={
          <div className="flex items-center justify-between">
            <Title level={5} className="!m-0">待确认事项</Title>
            <Badge count={pendingConfirmations.length} className="reqforge-pending" />
          </div>
        }
        size="small"
        styles={{ body: { padding: 12 } }}
      >
        <List
          size="small"
          dataSource={pendingConfirmations}
          renderItem={(item) => (
            <List.Item className="!py-2 cursor-pointer hover:bg-gray-50 rounded">
              <div className="flex items-start gap-2 w-full">
                <div className="w-2 h-2 rounded-full bg-[#FA8C16] mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Text className="text-sm font-medium">{item.title}</Text>
                    <Text className="text-xs text-gray-400">{item.time}</Text>
                  </div>
                  <Text className="text-xs text-gray-500 truncate">{item.description}</Text>
                </div>
              </div>
            </List.Item>
          )}
        />
        <Button type="link" size="small" className="!mt-2" icon={<ArrowRightOutlined />}>
          查看全部
        </Button>
      </Card>

      <Card
        title={
          <div className="flex items-center gap-2">
            <WarningOutlined className="reqforge-error" />
            <Title level={5} className="!m-0">风险预警</Title>
          </div>
        }
        size="small"
        styles={{ body: { padding: 12 } }}
      >
        <List
          size="small"
          dataSource={riskAlerts}
          renderItem={(item) => (
            <List.Item className="!py-2">
              <div className="flex items-start gap-2 w-full">
                <ExclamationCircleOutlined
                  className={item.level === 'high' ? 'reqforge-error' : 'reqforge-pending'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Text className="text-sm font-medium">{item.title}</Text>
                    <Tag
                      color={item.level === 'high' ? 'error' : 'warning'}
                      className="!text-xs"
                    >
                      {item.level === 'high' ? '高风险' : '中风险'}
                    </Tag>
                  </div>
                  <Text className="text-xs text-gray-500">{item.description}</Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
