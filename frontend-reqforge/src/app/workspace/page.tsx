'use client';

import { ChatPanel } from './ChatPanel';
import { TaskStepper } from './TaskStepper';
import { PreviewCards } from './PreviewCards';
import { RightPanel } from './RightPanel';

export default function WorkspacePage() {
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
          <TaskStepper />
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
