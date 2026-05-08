'use client';

import { Card, Typography, Table, Tag, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import { listRequirements } from '@/lib/api';

const { Title, Text } = Typography;

export default function ReviewPage() {
  const [reqs, setReqs] = useState<Array<Record<string,unknown>>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { listRequirements().then(setReqs).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>质量评审</Title>
      <Text type="secondary">需求完整性、一致性、可追溯性检查</Text>
      <Card style={{ marginTop: 16 }} title={`需求清单 (${reqs.length})`}>
        <Table dataSource={reqs as Array<Record<string,unknown>>} columns={[
          { title:'标题', dataIndex:'title', key:'t' },
          { title:'类型', dataIndex:'req_type', key:'tp', render:(v:string)=><Tag>{v||'functional'}</Tag> },
          { title:'优先级', dataIndex:'priority', key:'pr', render:(v:string)=><Tag color={v==='high'?'red':v==='medium'?'orange':'blue'}>{v||'medium'}</Tag> },
          { title:'状态', dataIndex:'status', key:'st', render:(v:string)=><Tag color={v==='draft'?'default':'green'}>{v||'draft'}</Tag> },
          { title:'来源', dataIndex:'source_ref', key:'sr' },
        ]} rowKey="id" size="small" loading={loading} />
      </Card>
    </div>
  );
}
