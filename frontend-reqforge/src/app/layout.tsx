import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './globals.css';
import { ReqForgeShell } from '@/components/ReqForgeShell';

export const metadata: Metadata = {
  title: 'ReqForge — 企业需求工程工作台',
  description: '以交互式工作台为入口，以智能体驾驭为底座，将需求工作从文档编写升级为研发准备过程',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
              token: {
                colorPrimary: '#1890FF',
                borderRadius: 6,
                colorBgContainer: '#FFFFFF',
              },
            }}
          >
            <ReqForgeShell>{children}</ReqForgeShell>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
