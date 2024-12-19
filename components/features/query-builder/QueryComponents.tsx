import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircleIcon, XCircleIcon } from 'lucide-react'

export type QueryItem = {
  type: 'term' | 'group'
  value: string
  items?: QueryItem[]
  operator?: 'AND' | 'OR'
  exact?: boolean
}

interface QueryTermProps {
  value: string
  exact: boolean
  onChange: (value: string, exact: boolean) => void
}

export const QueryTerm: React.FC<QueryTermProps> = ({ value, exact, onChange }) => {
  return (
    <div className="relative flex items-center gap-2 flex-grow">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value, exact)}
        placeholder="Enter search term"
        className="flex-1 bg-gray-50 border-gray-200 rounded-xl"
      />
      <Button
        variant={exact ? "default" : "outline"}
        size="sm"
        className={`h-8 shrink-0 ${exact ? 
          "bg-emerald-500 hover:bg-emerald-600 text-white" : 
          "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"}`}
        onClick={() => onChange(value, !exact)}
      >
        Exact
      </Button>
    </div>
  )
}

interface QueryGroupProps {
  items: QueryItem[]
  onChange: (items: QueryItem[]) => void
}

export const QueryGroup: React.FC<QueryGroupProps> = ({ items, onChange }) => {
  const addTerm = () => {
    onChange([...items, { type: 'term', value: '', exact: false, operator: items.length > 0 ? 'OR' : undefined }])
  }

  const addGroup = () => {
    onChange([...items, { type: 'group', value: '', items: [], operator: items.length > 0 ? 'OR' : undefined }])
  }

  const updateItem = (index: number, newItem: QueryItem) => {
    const newItems = [...items]
    newItems[index] = newItem
    onChange(newItems)
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  return (
    <Card className="w-full rounded-xl border-gray-200 bg-gray-50/50">
      <CardContent className="p-4 space-y-3">
        {items.map((item, index) => (
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
                onChange={(value, exact) => updateItem(index, { ...item, type: 'term', value, exact })}
              />
            ) : (
              <QueryGroup
                items={item.items || []}
                onChange={(items) => updateItem(index, { ...item, type: 'group', items })}
              />
            )}
            <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
              <XCircleIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addTerm} className="flex items-center gap-1">
            <PlusCircleIcon className="h-4 w-4" />
            Add Term
          </Button>
          <Button variant="outline" size="sm" onClick={addGroup} className="flex items-center gap-1">
            <PlusCircleIcon className="h-4 w-4" />
            Add Group
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
