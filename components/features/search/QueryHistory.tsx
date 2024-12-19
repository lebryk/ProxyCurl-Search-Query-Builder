import React from 'react';
import { Button } from '@/components/ui/button';
import { StoredQuery } from '@/types/QueryTypes';

interface QueryHistoryProps {
  queries: StoredQuery[];
  onDelete: (queryId: string) => void;
}

export const QueryHistory: React.FC<QueryHistoryProps> = ({ queries, onDelete }) => {
  if (queries.length === 0) {
    return <div className="text-gray-500">No previous queries found.</div>;
  }

  return (
    <div className="space-y-4">
      {queries.map((query) => (
        <div key={query.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium">Query {query.query_hash.slice(0, 8)}</div>
            <div className="text-sm text-gray-500">
              Results: {query.number_of_results} | Version: {query.version_number}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(query.executed_at).toLocaleString()}
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(query.id)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};
