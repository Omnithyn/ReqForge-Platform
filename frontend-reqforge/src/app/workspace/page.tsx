'use client';

import { useState, useEffect } from 'react';
import { ChatPanel } from './ChatPanel';
import { TaskStepper } from './TaskStepper';
import { PreviewCards } from './PreviewCards';
import { RightPanel } from './RightPanel';
import { reqforgeStatus } from '@/lib/api';

export default function WorkspacePage() {
  const [mcpStatus, setMcpStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    reqforgeStatus().then(data => {
      const status: Record<string, boolean> = {};
      (data.mcp_servers || []).forEach((s: string) => { status[s] = true; });
      setMcpStatus(status);
    }).catch(() => {});
  }, []);

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col min-w-0" style={{ maxWidth: '60%' }}>
        <div className="flex-1 p-4 overflow-auto">
          <ChatPanel />
        </div>
        <div className="p-4 pt-0">
          <PreviewCards />
        </div>
      </div>
      <div className="w-[40%] min-w-[360px] max-w-[480px] border-l border-gray-200 bg-white overflow-auto">
        <div className="p-4 space-y-4">
          <TaskStepper mcpReady={mcpStatus} />
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
