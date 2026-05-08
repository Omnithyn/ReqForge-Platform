'use client';

import { Card, Steps, Space, Typography, Badge } from 'antd';
import {
  FileTextOutlined,
  ApartmentOutlined,
  NodeIndexOutlined,
  SketchOutlined,
  ApiOutlined,
  ExperimentOutlined,
  AuditOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const stages = [
  { key: 'document_parsing', title: '文档解析', icon: <FileTextOutlined />, status: 'done' },
  { key: 'requirement_extraction', title: '需求抽取', icon: <CheckCircleOutlined />, status: 'done' },
  { key: 'ontology_modeling', title: '本体建模', icon: <ApartmentOutlined />, status: 'done' },
  { key: 'flow_design', title: '流程设计', icon: <NodeIndexOutlined />, status: 'progress' },
  { key: 'prototype_design', title: '原型设计', icon: <SketchOutlined />, status: 'pending' },
  { key: 'interface_generation', title: '接口生成', icon: <ApiOutlined />, status: 'pending' },
  { key: 'test_generation', title: '测试生成', icon: <ExperimentOutlined />, status: 'pending' },
  { key: 'quality_review', title: '质量评审', icon: <AuditOutlined />, status: 'pending' },
  { key: 'artifact_package', title: '研发准备包', icon: <GiftOutlined />, status: 'pending' },
];

const statusConfig = {
  done: { icon: <CheckCircleOutlined className="reqforge-done" />, color: '#52C41A', label: '已完成' },
  progress: { icon: <LoadingOutlined className="reqforge-progress" />, color: '#1890FF', label: '进行中' },
  pending: { icon: <ClockCircleOutlined className="reqforge-pending" />, color: '#FA8C16', label: '待处理' },
};

export function TaskStepper() {
  const currentIndex = stages.findIndex((s) => s.status === 'progress');
  const doneCount = stages.filter((s) => s.status === 'done').length;
  const progressCount = stages.filter((s) => s.status === 'progress').length;
  const pendingCount = stages.filter((s) => s.status === 'pending').length;

  return (
    <Card className="h-full" styles={{ body: { padding: 16 } }}>
      <Title level={5} className="!mb-4">需求工程流程</Title>

      <Steps
        direction="vertical"
        current={currentIndex}
        size="small"
        className="mb-6"
        items={stages.map((stage) => {
          const config = statusConfig[stage.status as keyof typeof statusConfig];
          return {
            title: (
              <Space size="small">
                <Text className={stage.status === 'done' ? 'reqforge-done' : stage.status === 'progress' ? 'reqforge-progress' : 'reqforge-pending'}>
                  {stage.title}
                </Text>
                {stage.status === 'done' && <span className="reqforge-done">✅</span>}
                {stage.status === 'progress' && <span className="reqforge-progress">🔵</span>}
                {stage.status === 'pending' && <span className="reqforge-pending">⏳</span>}
              </Space>
            ),
            icon: config.icon,
          };
        })}
      />

      <div className="border-t border-gray-100 pt-4">
        <Title level={5} className="!mb-3">任务状态概览</Title>
        <Space size="large" className="w-full justify-center">
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2"
              style={{ backgroundColor: '#52C41A' }}
            >
              {doneCount}
            </div>
            <Text className="reqforge-done text-sm">已完成</Text>
          </div>
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2"
              style={{ backgroundColor: '#1890FF' }}
            >
              {progressCount}
            </div>
            <Text className="reqforge-progress text-sm">进行中</Text>
          </div>
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2"
              style={{ backgroundColor: '#FA8C16' }}
            >
              {pendingCount}
            </div>
            <Text className="reqforge-pending text-sm">待处理</Text>
          </div>
        </Space>
      </div>
    </Card>
  );
}
