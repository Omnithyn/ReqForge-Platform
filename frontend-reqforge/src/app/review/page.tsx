'use client';

import { Card, Typography, Progress, Space, Table, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const dimensionLabels: Record<string, string> = {
  completeness: '完整性',
  consistency: '一致性',
  traceability: '可追溯性',
  implementability: '可实现性',
  testability: '可测试性',
};

export default function ReviewPage() {
  const scoreData = [
    { key: 'completeness', label: '完整性', score: 0, min: 80 },
    { key: 'consistency', label: '一致性', score: 0, min: 80 },
    { key: 'traceability', label: '可追溯性', score: 0, min: 90 },
    { key: 'implementability', label: '可实现性', score: 0, min: 70 },
    { key: 'testability', label: '可测试性', score: 0, min: 75 },
  ];

  const reviewTableColumns = [
    { title: '检查项', dataIndex: 'item', key: 'item' },
    { title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => s === 'pass' ? <Tag color="green">通过</Tag> :
        s === 'fail' ? <Tag color="red">未通过</Tag> : <Tag color="orange">待检查</Tag>
    },
    { title: '说明', dataIndex: 'note', key: 'note' },
  ];

  const reviewItems = [
    { key: '1', item: '需求是否覆盖主流程', status: 'pending', note: '等待文档解析' },
    { key: '2', item: '需求是否覆盖异常流程', status: 'pending', note: '等待需求抽取' },
    { key: '3', item: '字段是否引用数据字典', status: 'pending', note: '等待本体建模' },
    { key: '4', item: 'API 草案是否完整', status: 'pending', note: '等待接口生成' },
    { key: '5', item: '测试用例是否覆盖规则', status: 'pending', note: '等待测试生成' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>质量评审</Title>
      <Text type="secondary">基于 ontology-mcp 和 governance-mcp 的自动化质量检查</Text>

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <div style={{ flex: 1 }}>
          <Card title="需求就绪评分" extra={<Tag color="orange">未开始</Tag>}>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <div style={{ fontSize: 48, fontWeight: 'bold', color: '#1677ff' }}>—</div>
              <Text type="secondary">等待需求分析完成</Text>
            </div>
            <div style={{ marginTop: 24 }}>
              {scoreData.map(d => (
                <div key={d.key} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>{d.label}</Text>
                    <Text type="secondary">目标 ≥{d.min}%</Text>
                  </div>
                  <Progress percent={d.score} strokeColor={d.score >= d.min ? '#52c41a' : '#faad14'} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ flex: 2 }}>
          <Card title="评审检查清单">
            <Table
              columns={reviewTableColumns}
              dataSource={reviewItems}
              size="small"
              pagination={false}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
