export default function MemoPage() {
  return (
    <div className="flex flex-col p-4 h-full w-full border">
      {/* 主体区域 */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* 左侧分组栏 */}
        <div className="w-1/4 bg-gray-100">Memo Group List</div>

        {/* 右侧任务区 */}
        <div className="w-3/4 bg-gray-200">Memo List</div>
      </div>
    </div>
  );
}
