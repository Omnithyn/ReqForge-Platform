'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Input, Badge, Dropdown, Avatar, Space } from 'antd';
import {
  HomeOutlined, MessageOutlined, FileTextOutlined, BookOutlined,
  ApartmentOutlined, SketchOutlined, NodeIndexOutlined,
  ApiOutlined, ExperimentOutlined, AuditOutlined,
  GiftOutlined, BellOutlined, SettingOutlined,
  SearchOutlined, QuestionCircleOutlined, MenuFoldOutlined,
} from '@ant-design/icons';

const navItems = [
  { key: '/workspace', icon: <HomeOutlined />, label: '项目空间' },
  { key: '/workspace', icon: <MessageOutlined />, label: '对话工作台' },
  { key: '/documents', icon: <FileTextOutlined />, label: '文档中心' },
  { key: '/knowledge', icon: <BookOutlined />, label: '知识库' },
  { key: '/ontology', icon: <ApartmentOutlined />, label: '本体中心' },
  { key: '/prototype', icon: <SketchOutlined />, label: '原型设计' },
  { key: '/flowchart', icon: <NodeIndexOutlined />, label: '流程图' },
  { key: '/interface', icon: <ApiOutlined />, label: '接口与数据' },
  { key: '/testing', icon: <ExperimentOutlined />, label: '测试与验收' },
  { key: '/review', icon: <AuditOutlined />, label: '评审中心' },
  { key: '/artifacts', icon: <GiftOutlined />, label: '研发准备包' },
  { key: '/subscription', icon: <BellOutlined />, label: '订阅服务' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
];

export function ReqForgeShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="reqforge-layout">
      {/* Left Sidebar */}
      <aside className="reqforge-sidebar">
        <div className="reqforge-sidebar-logo">
          🏗️ ReqForge<br />
          <span>交互式需求工作台</span>
        </div>
        <nav className="reqforge-sidebar-menu">
          {navItems.map(item => (
            <div
              key={item.key + item.label}
              className={`reqforge-sidebar-item ${pathname === item.key ? 'active' : ''}`}
              onClick={() => router.push(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="reqforge-sidebar-footer">
          <MenuFoldOutlined /> 收起菜单
        </div>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header className="reqforge-header">
          <Dropdown menu={{
            items: [
              { key: '1', label: '智慧理赔平台建设项目' },
              { key: '2', label: '车险核心系统升级项目' },
              { key: '3', label: '营销活动配置平台' },
            ]
          }}>
            <div className="reqforge-header-project">
              当前项目：智慧理赔平台建设项目 ▾
            </div>
          </Dropdown>
          <div className="reqforge-header-search">
            <Input
              prefix={<SearchOutlined style={{ color: '#BFBFBF' }} />}
              placeholder="搜索文档、需求、任务、资产..."
              suffix={<span style={{ color: '#BFBFBF', fontSize: 12 }}>⌘K</span>}
            />
          </div>
          <div className="reqforge-header-right">
            <Badge count={1} size="small">
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer', color: '#595959' }} />
            </Badge>
            <QuestionCircleOutlined style={{ fontSize: 18, cursor: 'pointer', color: '#595959' }} />
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size={28} style={{ backgroundColor: '#1890FF' }}>张</Avatar>
              <span style={{ fontSize: 14, color: '#262626' }}>张伟</span>
            </Space>
          </div>
        </header>

        {/* Content */}
        <div className="reqforge-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
}
