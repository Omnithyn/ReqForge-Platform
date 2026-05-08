'use client';

import { Card, Typography, Space, Tag, Button, Row, Col, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { listOntologyTypes, createOntologyType } from '@/lib/api';

const { Title, Text } = Typography;

export default function OntologyPage() {
  const [types, setTypes] = useState<Array<Record<string,unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { try { setTypes(await listOntologyTypes()); } catch {}; setLoading(false); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    try { await createOntologyType({ name: `业务对象_${Date.now()}`, category: 'entity', scope: 'global' }); message.success('已创建'); load(); }
    catch { message.error('创建失败，请先登录'); }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div><Title level={3} style={{ margin:0 }}>本体建模</Title><Text type="secondary">业务对象、属性、关系管理</Text></div>
        <Button type="primary" icon={<PlusOutlined />} onClick={add}>新建对象</Button>
      </div>
      <Row gutter={16}>
        <Col span={16}>
          <Card title={`本体类型 (${types.length})`}>
            <Table dataSource={types as Array<Record<string,unknown>>} columns={[
              { title:'名称', dataIndex:'name', key:'name' },
              { title:'类别', dataIndex:'category', key:'cat', render:(v:string)=><Tag color="blue">{v||'entity'}</Tag> },
              { title:'范围', dataIndex:'scope', key:'scope', render:(v:string)=><Tag color={v==='global'?'green':'orange'}>{v||'global'}</Tag> },
              { title:'创建', dataIndex:'created_at', key:'dt', render:(v:string)=>v?.split('T')[0]||'-' },
            ]} rowKey="id" size="small" loading={loading} pagination={false} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="关系类型" size="small"><Space direction="vertical"><Text>INHERITS 继承</Text><Text>EXTENDS 扩展</Text><Text>OVERRIDES 覆盖</Text><Text>INSTANCE_OF 实例化</Text></Space></Card>
        </Col>
      </Row>
    </div>
  );
}
