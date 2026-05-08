'use client';

import { Card, Typography, Table, Tag, Row, Col, Progress } from 'antd';
import { useState, useEffect } from 'react';
import { listArtifacts } from '@/lib/api';

const { Title, Text } = Typography;

export default function ArtifactsPage() {
  const [arts, setArts] = useState<Array<Record<string,unknown>>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { listArtifacts().then(setArts).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>研发准备包</Title>
      <Text type="secondary">从需求分析到开发交付的完整资产包</Text>
      <Card style={{ marginTop: 16 }} title={`成果物 (${arts.length})`}>
        <Table dataSource={arts as Array<Record<string,unknown>>} columns={[
          { title:'标题', dataIndex:'title', key:'t' },
          { title:'类型', dataIndex:'artifact_type', key:'tp', render:(v:string)=><Tag color="blue">{v||'unknown'}</Tag> },
          { title:'版本', dataIndex:'version', key:'v' },
          { title:'状态', dataIndex:'status', key:'st', render:(v:string)=><Tag color={v==='done'?'green':'orange'}>{v||'draft'}</Tag> },
        ]} rowKey="id" size="small" loading={loading} />
      </Card>
    </div>
  );
}
