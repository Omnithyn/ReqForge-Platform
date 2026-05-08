'use client';

import { Card, Steps, Space, Typography } from 'antd';
import { FileTextOutlined, NodeIndexOutlined, ApartmentOutlined, SketchOutlined, ApiOutlined, ExperimentOutlined, AuditOutlined, GiftOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { reqforgeStatus } from '@/lib/api';

const { Title } = Typography;

export function TaskStepper({ mcpReady }: { mcpReady?: Record<string, boolean> }) {
  const stages = [
    { title: '文档解析', icon: <FileTextOutlined />, mcp: 'docling' },
    { title: '需求抽取', icon: <LoadingOutlined />, mcp: null },
    { title: '本体建模', icon: <ApartmentOutlined />, mcp: 'ontology' },
    { title: '流程设计', icon: <NodeIndexOutlined />, mcp: 'mermaid' },
    { title: '原型设计', icon: <SketchOutlined />, mcp: null },
    { title: '接口生成', icon: <ApiOutlined />, mcp: null },
    { title: '测试生成', icon: <ExperimentOutlined />, mcp: null },
    { title: '质量评审', icon: <AuditOutlined />, mcp: 'governance' },
    { title: '研发准备包', icon: <GiftOutlined />, mcp: 'evidence' },
  ];

  const getStatus = (mcp: string | null) => {
    if (!mcp) return 'wait';
    return mcpReady?.[mcp] ? 'finish' : 'wait';
  };

  return (
    <Card title={<Title level={5} className="!mb-0">需求分析进展</Title>}>
      <Steps direction="vertical" current={0} size="small"
        items={stages.map(s => ({
          title: s.title,
          icon: s.icon,
          status: getStatus(s.mcp),
          description: s.mcp ? (mcpReady?.[s.mcp] ? `${s.mcp}-mcp 就绪` : `${s.mcp}-mcp 未连接`) : '待配置',
        }))}
      />
      <div className="mt-4 text-xs text-gray-400">
        {Object.keys(mcpReady || {}).length === 0 ? '正在获取 MCP 状态...' :
         `${Object.keys(mcpReady || {}).length} 个 MCP 服务已连接`}
      </div>
    </Card>
  );
}
