import { useState } from 'react';
import { StoredQuery } from '@/types/QueryTypes';
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();


export const useQueryHistory = () => {
  const [storedQueries, setStoredQueries] = useState<StoredQuery[]>([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
  };

  const fetchStoredQueries = async (userId: string) => {
    try {
      setLoading(true);
      const { data: historyData, error: historyError } = await supabase
        .from('user_queries_history')
        .select('*')
        .eq('user_id', userId)
        .order('executed_at', { ascending: false })
        .limit(5);

      if (historyError) {
        console.error('History error:', historyError);
        return [];
      }

      if (historyData && historyData.length > 0) {
        const queryHashes = historyData.map(h => h.query_hash).filter(Boolean);
        console.log('Query hashes:', queryHashes);
        
        const { data: globalQueries, error: globalError } = await supabase
          .from('global_queries')
          .select('*')
          .in('query_hash', queryHashes);

        if (globalError) {
          console.error('Global queries error:', globalError);
          return [];
        }

        console.log('Global queries:', globalQueries);

        const combinedData: StoredQuery[] = historyData.map(history => {
          const globalQuery = globalQueries?.find(g => g.query_hash === history.query_hash);
          console.log('Found global query:', globalQuery);
          
          let parsedParams = null;
          if (globalQuery?.parameters) {
            try {
              parsedParams = typeof globalQuery.parameters === 'string' 
                ? JSON.parse(globalQuery.parameters)
                : globalQuery.parameters;
              console.log('Parsed parameters:', parsedParams);
            } catch (e) {
              console.error('Error parsing parameters:', e);
            }
          }

          return {
            ...history,
            global_queries: globalQuery || undefined
          };
        });

        console.log('Combined data:', combinedData);
        setStoredQueries(combinedData);
        return combinedData;
      }
      return [];
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateQueryHistory = async (
    userId: string, 
    queryHash: string, 
    versionNumber: number, 
    numResults: number
  ) => {
    try {
      // First try to find any existing history entries for this query
      const { data: histories, error: historiesError } = await supabase
        .from('user_queries_history')
        .select('*')
        .eq('user_id', userId)
        .eq('query_hash', queryHash)
        .order('executed_at', { ascending: false })
        .limit(1);

      if (historiesError) {
        addLog(`Error checking history: ${historiesError.message}`);
        throw historiesError;
      }

      const existingHistory = histories?.[0];

      if (existingHistory) {
        // Update existing history entry
        const { error: updateError } = await supabase
          .from('user_queries_history')
          .update({
            executed_at: new Date().toISOString()
          })
          .eq('id', existingHistory.id);

        if (updateError) {
          addLog(`History update error: ${updateError.message}`);
          throw updateError;
        }
        addLog('Updated existing history entry');
      } else {
        // Create new history entry if it doesn't exist
        const { error: historyError } = await supabase
          .from('user_queries_history')
          .insert({
            user_id: userId,
            project_id: '00000000-0000-0000-0000-000000000000',
            query_hash: queryHash,
            version_number: versionNumber,
            number_of_results: numResults
          });

        if (historyError) {
          addLog(`History insert error: ${historyError.message}`);
          throw historyError;
        }
      }

      // Refresh the stored queries
      await fetchStoredQueries(userId);
    } catch (error) {
      console.error('Error updating history:', error);
      throw error;
    }
  };

  return {
    storedQueries,
    loading,
    logs,
    addLog,
    fetchStoredQueries,
    updateQueryHistory
  };
};
