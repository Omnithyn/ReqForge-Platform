'use client';

import {
  Card,
  Typography,
  Tag,
  Button,
  Space,
  Progress,
  Table,
  Badge,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  CheckCircleOutlined,
  FileTextOutlined,
  ApiOutlined,
  ExperimentOutlined,
  DatabaseOutlined,
  PartitionOutlined,
  ProfileOutlined,
  ContainerOutlined,
  PictureOutlined,
  EyeOutlined,
  ExportOutlined,
  ArrowRightOutlined,
  WarningOutlined,
  QuestionCircleOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const deliverables = [
  { icon: <FileTextOutlined />, name: '需求说明书 (PRD)', version: 'v1.0.0', color: '#1890FF' },
  { icon: <PartitionOutlined />, name: '流程图', version: 'v1.0.0', color: '#722ED1' },
  { icon: <PictureOutlined />, name: '页面原型', version: 'v1.0.0', color: '#EB2F96' },
  { icon: <DatabaseOutlined />, name: '数据字典', version: 'v1.0.0', color: '#52C41A' },
  { icon: <ApiOutlined />, name: 'OpenAPI 草案', version: 'v1.0.0', color: '#FA8C16' },
  { icon: <ExperimentOutlined />, name: '测试用例', version: 'v1.0.0', color: '#13C2C2' },
  { icon: <ProfileOutlined />, name: '追溯矩阵', version: 'v1.0.0', color: '#1890FF' },
  { icon: <ContainerOutlined />, name: '实施任务包', version: 'v1.0.0', color: '#FA541C' },
];

const scoreMetrics = [
  { label: '需求完整性', value: '100%' },
  { label: '设计完整性', value: '95%' },
  { label: '可实现性', value: '95%' },
  { label: '可测试性', value: '95%' },
  { label: '文档完整性', value: '95%' },
];

const taskData = [
  {
    key: '1',
    category: '后端开发',
    name: 'OCR服务接口封装',
    description: '封装第三方OCR识别服务，实现身份证、银行卡、医疗单据的自动识别接口',
    priority: 'P0',
    estimate: '5天',
    owner: '张伟',
    status: '待开始',
    planDate: '2024-02-15',
  },
  {
    key: '2',
    category: '后端开发',
    name: '理赔规则引擎开发',
    description: '基于Drools实现理赔材料审核规则引擎，支持规则动态配置与热加载',
    priority: 'P0',
    estimate: '8天',
    owner: '李强',
    status: '待开始',
    planDate: '2024-02-20',
  },
  {
    key: '3',
    category: '后端开发',
    name: '材料存储与版本管理',
    description: '实现理赔材料的OSS存储、缩略图生成、版本追溯功能',
    priority: 'P1',
    estimate: '4天',
    owner: '王芳',
    status: '未开始',
    planDate: '2024-02-18',
  },
  {
    key: '4',
    category: '前端开发',
    name: '材料上传组件开发',
    description: '开发支持多文件上传、拖拽上传、上传进度展示的通用组件',
    priority: 'P0',
    estimate: '3天',
    owner: '陈明',
    status: '待开始',
    planDate: '2024-02-12',
  },
  {
    key: '5',
    category: '前端开发',
    name: '审核结果展示页面',
    description: '实现审核结果的可视化展示，包括通过项、异常项、待补充项分类展示',
    priority: 'P0',
    estimate: '4天',
    owner: '刘洋',
    status: '进行中',
    planDate: '2024-02-14',
  },
  {
    key: '6',
    category: '前端开发',
    name: '规则配置管理界面',
    description: '开发审核规则的可视化配置界面，支持规则增删改查与优先级调整',
    priority: 'P1',
    estimate: '5天',
    owner: '赵静',
    status: '未开始',
    planDate: '2024-02-22',
  },
  {
    key: '7',
    category: '测试',
    name: 'OCR接口集成测试',
    description: '编写OCR服务的集成测试用例，覆盖身份证、银行卡、发票识别场景',
    priority: 'P0',
    estimate: '3天',
    owner: '孙涛',
    status: '待开始',
    planDate: '2024-02-16',
  },
  {
    key: '8',
    category: '测试',
    name: '规则引擎单元测试',
    description: '针对各类审核规则编写单元测试，确保规则判断逻辑正确性',
    priority: 'P1',
    estimate: '4天',
    owner: '周丽',
    status: '未开始',
    planDate: '2024-02-21',
  },
];

const riskItems = [
  { level: '高', color: 'red', text: '第三方OCR服务稳定性' },
  { level: '中', color: 'orange', text: '规则变更频繁' },
];

const pendingItems = [
  { text: '医疗发票识别字段确认', assignee: '产品经理-李明' },
  { text: '审核异常人工复核流程', assignee: '业务专家-王芳' },
];

const renderPriorityTag = (priority: string) => {
  const colorMap: Record<string, string> = {
    P0: 'red',
    P1: 'orange',
    P2: 'blue',
  };
  return <Tag color={colorMap[priority] || 'default'}>{priority}</Tag>;
};

const renderStatus = (status: string) => {
  const statusMap: Record<string, { color: string; text: string }> = {
    '待开始': { color: 'blue', text: '待开始' },
    '进行中': { color: 'green', text: '进行中' },
    '未开始': { color: 'default', text: '未开始' },
  };
  const config = statusMap[status] || { color: 'default', text: status };
  return (
    <Space>
      <Badge status={config.color as any} />
      <Text>{config.text}</Text>
    </Space>
  );
};

const columns = [
  {
    title: '任务类别',
    dataIndex: 'category',
    key: 'category',
    width: 100,
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '任务描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    width: 80,
    render: renderPriorityTag,
  },
  {
    title: '预估工时',
    dataIndex: 'estimate',
    key: 'estimate',
    width: 90,
  },
  {
    title: '责任人',
    dataIndex: 'owner',
    key: 'owner',
    width: 90,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: renderStatus,
  },
  {
    title: '计划完成时间',
    dataIndex: 'planDate',
    key: 'planDate',
    width: 120,
  },
];

export default function ArtifactsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Space align="center" size={12} className="mb-2">
          <Title level={3} className="!m-0">理赔材料自动审核 - 研发准备包</Title>
          <Tag color="green">评审通过</Tag>
          <Tag>v1.0.0</Tag>
        </Space>
        <Text type="secondary">
          创建人：张经理 | 创建时间：2024-01-15 | 评审通过时间：2024-01-20 | 基于版本：v1.0.0
        </Text>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <Card>
            <div className="flex items-start gap-8">
              <div className="flex flex-col items-center">
                <Progress
                  type="circle"
                  percent={96}
                  size={140}
                  strokeColor="#52C41A"
                  format={() => (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500">96</div>
                      <div className="text-sm text-green-500">优秀</div>
                    </div>
                  )}
                />
              </div>

              <div className="flex-1 pt-2">
                <Row gutter={[24, 16]}>
                  {scoreMetrics.map((metric) => (
                    <Col key={metric.label} span={8}>
                      <Space>
                        <CheckCircleOutlined className="text-green-500" />
                        <Text>{metric.label}</Text>
                        <Text strong className="text-green-500">{metric.value}</Text>
                      </Space>
                    </Col>
                  ))}
                </Row>
                <Divider className="my-4" />
                <Text type="secondary">已满足研发交付标准，可进入开发执行</Text>
              </div>
            </div>
          </Card>

          <Card title="交付物清单" className="!mb-6">
            <Row gutter={[16, 16]}>
              {deliverables.map((item) => (
                <Col key={item.name} span={6}>
                  <Card
                    size="small"
                    className="!border-gray-200 hover:!border-blue-300 hover:!shadow-md transition-all cursor-pointer"
                    bodyStyle={{ padding: 16 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <Text strong className="!block">{item.name}</Text>
                          <Text type="secondary" className="!text-xs">{item.version}</Text>
                        </div>
                      </div>
                      <Tag color="green" className="!text-xs">已完成</Tag>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button type="link" size="small" icon={<EyeOutlined />} className="!p-0">
                        预览
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Card title="研发任务清单" className="!mb-6">
            <Table
              columns={columns}
              dataSource={taskData}
              pagination={{
                total: 28,
                pageSize: 8,
                showTotal: (total) => `共 ${total} 项`,
                showSizeChanger: false,
              }}
              size="middle"
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </div>

        <div className="w-80 space-y-4">
          <Card size="small" title={<span className="text-red-500"><WarningOutlined /> 风险项</span>}>
            <Space direction="vertical" className="w-full">
              {riskItems.map((risk, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge color={risk.color} />
                  <Tag color={risk.color === 'red' ? 'error' : 'warning'} className="!text-xs">
                    {risk.level}
                  </Tag>
                  <Text className="!text-sm">{risk.text}</Text>
                </div>
              ))}
            </Space>
          </Card>

          <Card size="small" title={<span><QuestionCircleOutlined /> 待确认事项</span>}>
            <Space direction="vertical" className="w-full">
              {pendingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between w-full">
                  <div className="flex-1">
                    <Text className="!text-sm !block">{item.text}</Text>
                    <Text type="secondary" className="!text-xs">{item.assignee}</Text>
                  </div>
                  <Button type="link" size="small" className="!p-0 !text-xs">
                    去确认 →
                  </Button>
                </div>
              ))}
            </Space>
          </Card>

          <Card size="small">
            <Space direction="vertical" className="w-full">
              <Button type="primary" block icon={<ArrowRightOutlined />}>
                流转至开发执行 →
              </Button>
              <Button block icon={<ExportOutlined />}>
                导出研发准备包
              </Button>
            </Space>
          </Card>

          <Card size="small" className="!bg-blue-50 !border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <FileExcelOutlined className="text-blue-500" />
              <Text strong className="!text-blue-700">文档即开发准备</Text>
            </div>
            <Space direction="vertical" className="w-full">
              <div className="flex items-center gap-2">
                <CheckCircleOutlined className="text-green-500 !text-xs" />
                <Text className="!text-sm">需求文档自动生成接口定义</Text>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleOutlined className="text-green-500 !text-xs" />
                <Text className="!text-sm">流程图自动导出研发任务</Text>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleOutlined className="text-green-500 !text-xs" />
                <Text className="!text-sm">原型与数据字典自动关联</Text>
              </div>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
}
