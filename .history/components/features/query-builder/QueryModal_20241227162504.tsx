"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PeopleSearchQueryParams } from '@/types/PersonSearch'
import { queryFields, QueryField } from '@/utils/queryFields'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"

interface QueryModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (fields: (keyof PeopleSearchQueryParams)[]) => void
  selectedFields: (keyof PeopleSearchQueryParams)[]
}

export default function QueryModal({ isOpen, onClose, onAdd, selectedFields }: QueryModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<keyof PeopleSearchQueryParams>>(new Set(selectedFields))

  // Update selectedItems when modal opens or selectedFields changes
  useEffect(() => {
    if (isOpen) {
      setSelectedItems(new Set(selectedFields))
    }
  }, [isOpen, selectedFields])

  const handleCheckboxChange = (field: keyof PeopleSearchQueryParams) => {
    const newSelectedItems = new Set(selectedItems)
    if (newSelectedItems.has(field)) {
      newSelectedItems.delete(field)
    } else {
      newSelectedItems.add(field)
    }
    setSelectedItems(newSelectedItems)
  }

  const handleSubmit = () => {
    onAdd(Array.from(selectedItems))
  }

  const groupedFields = queryFields.reduce((acc, field) => {
    if (!acc[field.group]) {
      acc[field.group] = []
    }
    acc[field.group].push(field)
    return acc
  }, {} as Record<string, QueryField[]>)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] h-[90vh] flex flex-col p-0 bg-white rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-medium">Available Query Fields</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groupedFields).map(([group, fields]) => (
              <Card key={group} className="overflow-hidden">
                <CardHeader className="bg-muted py-2">
                  <CardTitle className="text-sm font-medium">{group}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {fields.map((field) => (
                      <div key={field.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={field.name}
                          checked={selectedItems.has(field.name)}
                          onCheckedChange={() => handleCheckboxChange(field.name)}
                        />
                        <div className="flex items-center space-x-1">
                          <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {field.label}
                          </label>
                          <Popover>
                            <PopoverTrigger>
                              <QuestionMarkCircledIcon className="h-4 w-4 text-gray-400" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-2 text-sm">
                              {field.field_description}
                              <div className="mt-2">
                                <span className="inline-block bg-gray-100 rounded px-2 py-1 text-sm">Example: &apos;{field.example}&apos;</span>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end space-x-2 p-6 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600 text-white">Add Fields</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
