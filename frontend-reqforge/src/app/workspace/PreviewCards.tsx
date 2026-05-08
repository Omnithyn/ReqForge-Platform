'use client';

import { Card, Typography, Space } from 'antd';
import {
  NodeIndexOutlined,
  SketchOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const previewItems = [
  {
    key: 'flowchart',
    title: '业务流程图预览',
    icon: <NodeIndexOutlined className="text-[#1890FF] text-xl" />,
    description: '车险理赔核心业务流程',
    status: '已生成',
  },
  {
    key: 'prototype',
    title: '页面原型预览',
    icon: <SketchOutlined className="text-[#FA8C16] text-xl" />,
    description: '报案、查勘、定损页面',
    status: '生成中',
  },
  {
    key: 'ontology',
    title: '本体关系图预览',
    icon: <ApartmentOutlined className="text-[#52C41A] text-xl" />,
    description: '业务对象与关系模型',
    status: '已生成',
  },
];

export function PreviewCards() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {previewItems.map((item) => (
        <Card
          key={item.key}
          hoverable
          className="cursor-pointer transition-all duration-200 hover:shadow-md"
          styles={{ body: { padding: 16 } }}
        >
          <div className="flex items-center gap-2 mb-3">
            {item.icon}
            <Title level={5} className="!m-0 !text-sm">{item.title}</Title>
          </div>

          <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center mb-3">
            <Space direction="vertical" align="center" className="text-gray-400">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                {item.icon}
              </div>
              <Text className="text-xs">预览图占位</Text>
            </Space>
          </div>

          <div className="flex justify-between items-center">
            <Text className="text-xs text-gray-500 truncate flex-1">{item.description}</Text>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                item.status === '已生成'
                  ? 'bg-[#F6FFED] text-[#52C41A]'
                  : 'bg-[#FFF7E6] text-[#FA8C16]'
              }`}
            >
              {item.status}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
