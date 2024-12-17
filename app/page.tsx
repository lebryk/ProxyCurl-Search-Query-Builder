"use client"

import { useState } from 'react'
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

export default function SearchQueryBuilderPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFields, setSelectedFields] = useState<(keyof PeopleSearchQueryParams)[]>([])
  const [query, setQuery] = useState<Partial<PeopleSearchQueryParams>>({})
  const [isBooleanBuilderOpen, setIsBooleanBuilderOpen] = useState(false)
  const [currentBooleanField, setCurrentBooleanField] = useState<keyof PeopleSearchQueryParams | null>(null)
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const { toast } = useToast()

  const addFields = (fields: (keyof PeopleSearchQueryParams)[]) => {
    setSelectedFields([...new Set([...selectedFields, ...fields])])
    setIsModalOpen(false)
  }

  const updateQuery = (field: keyof PeopleSearchQueryParams, value: string | string[] | number) => {
    setQuery({ ...query, [field]: value })
  }

  const handleSearch = () => {
    console.log("Performing search with query:", query)
    // Here you would typically call your search function or API
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
      const parsedQuery = JSON.parse(jsonInput)
      const newSelectedFields = Object.keys(parsedQuery) as (keyof PeopleSearchQueryParams)[]
      setSelectedFields(newSelectedFields)
      setQuery(parsedQuery)
      setJsonError(null)
    } catch (error) {
      setJsonError('Invalid JSON input. Please check your query and try again.')
      console.error('Error parsing JSON:', error)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Advanced Search Query Builder</h1>
      <Card className="w-full bg-white rounded-2xl shadow-lg">
        <CardHeader className="space-y-1 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-medium">Build Your Query</CardTitle>
            <CardDescription className="text-gray-500">Add and configure search parameters</CardDescription>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Add Search Query Fields
          </Button>
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
          >
            Search
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
  )
}
