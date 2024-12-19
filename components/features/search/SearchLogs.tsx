import React from 'react';

interface SearchLogsProps {
  logs: string[];
}

export const SearchLogs: React.FC<SearchLogsProps> = ({ logs }) => {
  return (
    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
      <div className="space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
