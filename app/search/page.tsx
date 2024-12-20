"use client"

import { useState, useEffect, useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { PlusCircleIcon } from 'lucide-react'
import { ClipboardIcon } from "lucide-react"
import { PeopleSearchQueryParams } from '@/types/searchTypes'
import BooleanQueryBuilderModal from '@/components/features/query-builder/BooleanQueryBuilderModal'
import QueryModal from '@/components/features/query-builder/QueryModal'
import QueryInputs from '@/components/features/query-builder/QueryInputs'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core";
import { AgentState } from '../../types/agentState';
import { Progress } from '@/components/features/query-builder/Progress'
import { ChatContext } from '../providers'
import { SearchService } from '@/services/search/searchService'
import { useAuth } from '@/hooks/useAuth'
import { useProject } from "@/contexts/ProjectContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getQueryHistory } from '@/services/search/searchCache'

export default function SearchQueryBuilderPage() {
  const [selectedFields, setSelectedFields] = useState<(keyof PeopleSearchQueryParams)[]>([])
  const [query, setQuery] = useState<Partial<PeopleSearchQueryParams>>({})
  const [isBooleanBuilderOpen, setIsBooleanBuilderOpen] = useState(false)
  const [currentBooleanField, setCurrentBooleanField] = useState<keyof PeopleSearchQueryParams | null>(null)
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [queryHistory, setQueryHistory] = useState<Array<{ query_hash: string, parameters: any }>>([])
  const [selectedQueryHash, setSelectedQueryHash] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const { activeProject } = useProject()
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<string[]>([])
  const { isChatOpen } = useContext(ChatContext ?? true);

  const addFields = (fields: (keyof PeopleSearchQueryParams)[]) => {
    setSelectedFields([...new Set([...selectedFields, ...fields])])
    setIsModalOpen(false)
  }

  const updateQuery = (field: keyof PeopleSearchQueryParams, value: string | string[] | number) => {
    setQuery({ ...query, [field]: value })
  }

  const handleSearch = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to perform a search",
        variant: "destructive"
      })
      return
    }

    if (!activeProject) {
      toast({
        title: "Error",
        description: "Please select a project before searching",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      const searchService = new SearchService(
        user.id, 
        activeProject.id
      )
      
      const searchParams = {
        query: JSON.stringify(query),
        filters: {
          selectedFields
        }
      }

      const results = await searchService.search(searchParams)
      
      setSearchResults(results.candidateIds)
      
      toast({
        title: results.fromCache ? "Results from cache" : "Search completed",
        description: `Found ${results.candidateIds.length} results`,
        variant: "default"
      })
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openBooleanBuilder = (field: keyof PeopleSearchQueryParams) => {
    setCurrentBooleanField(field)
    setIsBooleanBuilderOpen(true)
  }

  const handleApplyBooleanQuery = (booleanQuery: string) => {
    if (currentBooleanField) {
      updateQuery(currentBooleanField, booleanQuery)
    }
    setIsBooleanBuilderOpen(false)
    setCurrentBooleanField(null)
  }

  const handleJsonParse = () => {
    try {
      // Validate input before parsing
      if (!jsonInput.trim() || typeof jsonInput.trim() !== 'string' || jsonInput.trim() === '') {
        console.warn('Invalid JSON input: empty or not a string');
        setJsonError('Invalid JSON input: empty or not a string');
        return;
      }

      // Try to validate JSON structure before parsing
      if (!jsonInput.trim().startsWith('{') || !jsonInput.trim().endsWith('}')) {
        console.warn('Invalid JSON input: not an object');
        setJsonError('Invalid JSON input: must be a valid JSON object');
        return;
      }

      console.log('JSON input:', jsonInput);
      const parsedQuery = JSON.parse(jsonInput.trim());
      
      // Validate parsed result is an object
      if (!parsedQuery || typeof parsedQuery !== 'object') {
        console.warn('Invalid JSON input: parsed result is not an object');
        setJsonError('Invalid JSON input: must be a valid JSON object');
        return;
      }

      const newSelectedFields = Object.keys(parsedQuery) as (keyof PeopleSearchQueryParams)[];
      setSelectedFields(newSelectedFields);
      setQuery(parsedQuery);
      setJsonError(null); // Clear any previous errors on success
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setJsonError('Invalid JSON input. Please check your query and try again.');
    }
  };

  const handleClearQuery = () => {
    setQuery({})
    setSelectedFields([])
    setJsonInput('')
    setJsonError(null)
    setSearchResults([])
    setSelectedQueryHash(null)
  }

  useEffect(() => {
    const fetchQueryHistory = async () => {
      try {
        const history = await getQueryHistory()
        setQueryHistory(history)
      } catch (error) {
        console.error('Failed to fetch query history:', error)
      }
    }
    fetchQueryHistory()
  }, [])

  const handleHistorySelect = (queryHash: string) => {
    const selectedQuery = queryHistory.find(q => q.query_hash === queryHash)
    if (selectedQuery) {
      setQuery(selectedQuery.parameters)
      setSelectedFields(Object.keys(selectedQuery.parameters) as (keyof PeopleSearchQueryParams)[])
      setSelectedQueryHash(queryHash)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { state, setState } = useCoAgent<AgentState>({
    name: "agent",
    initialState: {
    },
  });

  // Update the Search Query Grid when the CoAgent state changes
  useEffect(() => {
    console.log('CoAgent State Update:', state);
    if (state.optimized_query && typeof state.optimized_query === 'object') {
      const jsonString = JSON.stringify(state.optimized_query, null, 2);
      setJsonInput(jsonString);
      setSelectedFields(Object.keys(state.optimized_query) as (keyof PeopleSearchQueryParams)[]);
      setQuery(state.optimized_query);
    }
  }, [state.optimized_query]);

  useCoAgentStateRender<AgentState>({
    name: "agent",
    render: ({ state }) => {
      if (state.logs) {
        return <Progress logs={state.logs} />
      }
      return null
    },
  });

  return (
      <div className={`flex-1 h-full transition-all duration-400 ${isChatOpen ? 'mr-[450px]' : 'mr-0'}`}>
        <div className="container mx-auto p-6 space-y-8">
          <h1 className="text-3xl font-bold">Advanced Search Query Builder</h1>
          <Card className="w-full bg-white rounded-2xl shadow-lg">
            <CardHeader className="space-y-1 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-medium">Build Your Query</CardTitle>
                <CardDescription className="text-gray-500">Add and configure search parameters</CardDescription>
              </div>
              <div>
                <div className="flex justify-end items-center gap-2">
                  <Button 
                    onClick={handleClearQuery}
                    variant="outline"
                    className="w-[100px]"
                  >
                    New Query
                  </Button>
                  <Select value={selectedQueryHash || ''} onValueChange={handleHistorySelect}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select from history" />
                    </SelectTrigger>
                    <SelectContent>
                      {queryHistory.map((historyItem) => (
                        <SelectItem key={historyItem.query_hash} value={historyItem.query_hash}>
                          {Object.values(historyItem.parameters)
                            .join(', ')
                            .substring(0, 30)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white w-[308px]"
                  >
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Add Search Query Fields
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <QueryInputs 
                  selectedFields={selectedFields} 
                  query={query} 
                  updateQuery={updateQuery}
                  onOpenBooleanBuilder={openBooleanBuilder}
                />
                <div className="mt-4 relative">
                  <Input
                    type="text"
                    placeholder="Constructed query will appear here"
                    value={JSON.stringify(query)}
                    readOnly
                    className="bg-gray-50 border-gray-200 rounded-xl pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="hover:bg-transparent h-8 w-8 p-0"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(query))
                        toast({
                          title: "Success",
                          description: "Copied to clipboard!",
                          duration: 1000,
                        })
                      }}
                    >
                      <ClipboardIcon className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
                {jsonError && (
                  <Alert variant="destructive">
                    <AlertDescription>{jsonError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleSearch}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </CardFooter>
          </Card>
          <Card className="w-full bg-white rounded-2xl shadow-lg mb-8">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-medium">Parse JSON Query</CardTitle>
              <CardDescription className="text-gray-500">Paste your JSON query to populate the search fields</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder="Paste your JSON query here"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="bg-gray-50 border-gray-200 rounded-xl pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="hover:bg-transparent h-8 w-8 p-0"
                      onClick={() => {
                        navigator.clipboard.writeText(jsonInput)
                        toast({
                          title: "Success",
                          description: "Copied to clipboard!",
                          duration: 1000,
                        })
                      }}
                    >
                      <ClipboardIcon className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={handleJsonParse}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Parse JSON
                </Button>
                {jsonError && (
                  <Alert variant="destructive">
                    <AlertDescription>{jsonError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
          <QueryModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onAdd={addFields}
            selectedFields={selectedFields}
          />
          <BooleanQueryBuilderModal
            isOpen={isBooleanBuilderOpen}
            onClose={() => setIsBooleanBuilderOpen(false)}
            onApply={handleApplyBooleanQuery}
            initialQuery={currentBooleanField ? query[currentBooleanField] as string : ''}
          />
          <Toaster />
        </div>
      </div>
  )
}
