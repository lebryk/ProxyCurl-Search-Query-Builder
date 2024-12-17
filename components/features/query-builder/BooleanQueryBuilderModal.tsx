"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { InfoIcon, PlusCircleIcon, XCircleIcon } from 'lucide-react'
import { QueryTerm, QueryGroup, QueryItem } from './QueryComponents'
import { deconstructQuery } from './QueryDeconstructor'

interface BooleanQueryBuilderModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (query: string) => void
  initialQuery?: string
}

const BooleanQueryBuilderModal: React.FC<BooleanQueryBuilderModalProps> = ({ isOpen, onClose, onApply, initialQuery = '' }) => {
  const [query, setQuery] = useState<QueryItem[]>(() => 
    initialQuery ? deconstructQuery(initialQuery) : []
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialQuery) {
      setQuery(deconstructQuery(initialQuery))
    } else {
      setQuery([])
    }
  }, [initialQuery])

  const addTerm = () => {
    setQuery([...query, { type: 'term', value: '', exact: false, operator: query.length > 0 ? 'OR' : undefined }])
  }

  const addGroup = () => {
    setQuery([...query, { type: 'group', value: '', items: [], operator: query.length > 0 ? 'OR' : undefined }])
  }

  const updateItem = (index: number, newItem: QueryItem) => {
    if (newItem.type === 'term' && newItem.value.length > 100) {
      setError("Search term cannot be longer than 100 characters");
      return;
    }
    
    setError(null);
    const newQuery = [...query];
    newQuery[index] = newItem;
    setQuery(newQuery);
  }

  const removeItem = (index: number) => {
    const newQuery = query.filter((_, i) => i !== index)
    setQuery(newQuery)
  }

  const buildQueryString = (items: QueryItem[]): string => {
    return items.map((item, index) => {
      let itemString = ''
      if (item.type === 'term') {
        itemString = item.exact ? `"${item.value}"` : item.value
      } else if (item.type === 'group') {
        itemString = `(${buildQueryString(item.items || [])})`
      }
      return index > 0 ? `${item.operator || 'OR'} ${itemString}` : itemString
    }).join(' ')
  }

  const handleApply = () => {
    if (query.length === 0) {
      setError("Query cannot be empty");
      return;
    }
    
    // Check if all terms have values
    const hasEmptyTerms = query.some(item => 
      (item.type === 'term' && !item.value.trim()) || 
      (item.type === 'group' && (!item.items || item.items.length === 0))
    );
    
    if (hasEmptyTerms) {
      setError("All terms and groups must have values");
      return;
    }

    setError(null);
    const queryString = buildQueryString(query);
    onApply(queryString);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] h-[90vh] flex flex-col p-0 bg-white rounded-2xl" aria-describedby="dialog-description">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-medium">Boolean Query Builder</DialogTitle>
          <DialogDescription id="dialog-description" className="text-sm text-gray-500">
            Create a complex boolean search query for your selected field.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-auto p-6">
          <Card className="w-full bg-white border-none rounded-none shadow-none">

            <CardContent className="p-6">
              <div className="space-y-4">
                {query.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {index > 0 && (
                      <select
                        className="border rounded-xl p-2 bg-gray-50 border-gray-200 text-gray-700"
                        value={item.operator || 'OR'}
                        onChange={(e) => updateItem(index, { ...item, operator: e.target.value as 'AND' | 'OR' })}
                      >
                        <option value="OR">OR</option>
                        <option value="AND">AND</option>
                      </select>
                    )}
                    {item.type === 'term' ? (
                      <QueryTerm
                        value={item.value}
                        exact={item.exact || false}
                        onChange={(value, exact) => updateItem(index, { ...item, value, exact })}
                      />
                    ) : (
                      <QueryGroup
                        items={item.items || []}
                        onChange={(items) => updateItem(index, { ...item, items })}
                      />
                    )}
                    <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                      <XCircleIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={addTerm}
                    className="bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100"
                  >
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Add Term
                  </Button>
                  <Button 
                    onClick={addGroup}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Add Group
                  </Button>
                </div>
                <Input
                  type="text"
                  placeholder="Constructed query will appear here"
                  value={buildQueryString(query)}
                  readOnly
                  className="mt-4 bg-gray-50 border-gray-200 rounded-xl"
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <InfoIcon className="mr-2 h-4 w-4" />
                    Syntax Guide
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Boolean Search Syntax</h4>
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      <li>&ldquo;Exact phrase&rdquo; for exact matches</li>
                      <li>Use AND, OR between terms</li>
                      <li>Use - before a term to exclude it</li>
                      <li>Group terms with parentheses ()</li>
                      <li>Use * for wildcard (not at start)</li>
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
              <Button 
                onClick={handleApply}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Apply Query
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BooleanQueryBuilderModal
