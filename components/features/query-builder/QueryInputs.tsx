"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PeopleSearchQueryParams } from '@/types/searchTypes'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { queryFields } from '@/utils/queryFields'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FilterIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"

interface QueryInputsProps {
  selectedFields: (keyof PeopleSearchQueryParams)[]
  query: Partial<PeopleSearchQueryParams>
  updateQuery: (field: keyof PeopleSearchQueryParams, value: string | string[] | number) => void
  onOpenBooleanBuilder: (field: keyof PeopleSearchQueryParams) => void
}

export default function QueryInputs({ selectedFields, query, updateQuery, onOpenBooleanBuilder }: QueryInputsProps) {
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof PeopleSearchQueryParams, string>>>({})

  const getFieldInfo = (fieldName: keyof PeopleSearchQueryParams) => {
    const field = queryFields.find(f => f.name === fieldName)
    return field ? { 
      label: field.label, 
      description: field.field_description, 
      example: field.example,
      validation_rules: field.validation_rules
    } : { 
      label: fieldName, 
      description: '', 
      example: '',
      validation_rules: undefined
    }
  }

// Utility function to check if parentheses and quotes are balanced
function checkBalanced(value: string): boolean {
  const stack: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < value.length; i++) {
    const c = value[i];

    if (c === '"') {
      // Toggle quote mode on encountering a quote
      inQuotes = !inQuotes;
    } else if (!inQuotes) {
      // Only check parentheses if we are not inside quotes
      if (c === '(') {
        stack.push(c);
      } else if (c === ')') {
        const last = stack.pop();
        if (last !== '(') {
          return false; // Unmatched parenthesis
        }
      }
    }
    // Other characters don't affect balance
  }

  // At the end, we must not be in quotes and stack should be empty
  return stack.length === 0 && !inQuotes;
}

// Utility function to detect if query might be Boolean
function isBooleanQuery(value: string): boolean {
  const booleanChars = /(\bOR\b|\bAND\b|\(|\)|"|^-|\*)/i;
  return booleanChars.test(value);
}

// Utility function to extract tokens from a Boolean query
function extractBooleanTokens(value: string): string[] {
  const parts = value.split(/\b(?:OR|AND)\b/i).map(part => part.trim());
  const tokens: string[] = [];

  for (let part of parts) {
    // Remove outer parentheses
    part = part.replace(/^\(+/, '').replace(/\)+$/, '');

    // Remove surrounding quotes if present
    if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
      part = part.slice(1, -1);
    }

    // If there's a leading '-', remove it
    if (part.startsWith('-')) {
      part = part.slice(1);
    }

    tokens.push(part);
  }

  return tokens;
}

const validateField = (field: keyof PeopleSearchQueryParams, value: string) => {
  const { validation_rules } = getFieldInfo(field);

  if (!validation_rules) {
    // No validation rules defined, so clear any existing errors
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    });
    return;
  }

  const regex = new RegExp(validation_rules);
  let isValid = true;

  if (isBooleanQuery(value)) {
    // Check if quotes and parentheses are balanced before extracting tokens
    if (!checkBalanced(value)) {
      isValid = false;
    } else {
      const tokens = extractBooleanTokens(value);
      // Validate each token individually
      for (const token of tokens) {
        if (!regex.test(token)) {
          isValid = false;
          break;
        }
      }
    }
  } else {
    // Not a Boolean query, validate the entire value directly
    isValid = regex.test(value);
  }

  if (!isValid) {
    setValidationErrors(prev => ({ ...prev, [field]: `Invalid input for ${field}` }));
  } else {
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    });
  }
};



  const handleInputChange = (field: keyof PeopleSearchQueryParams, value: string) => {
    updateQuery(field, value)
    validateField(field, value)
  }

  const renderInput = (field: keyof PeopleSearchQueryParams) => {
    const value = query[field] || ''
    
    const inputElement = (() => {
      switch (field) {
        case 'current_company_type':
          return (
            <Select onValueChange={(value) => updateQuery(field, value)} value={value as string}>
              <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                {["EDUCATIONAL", "GOVERNMENT_AGENCY", "NON_PROFIT", "PARTNERSHIP", "PRIVATELY_HELD", "PUBLIC_COMPANY", "SELF_EMPLOYED", "SELF_OWNED"].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        case 'enrich_profiles':
          return (
            <Select onValueChange={(value) => updateQuery(field, value)} value={value as string}>
              <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Select enrich profiles option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skip">Skip</SelectItem>
                <SelectItem value="enrich">Enrich</SelectItem>
              </SelectContent>
            </Select>
          )
        case 'use_cache':
          return (
            <Select onValueChange={(value) => updateQuery(field, value)} value={value as string}>
              <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue placeholder="Select cache option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="if-present">If Present</SelectItem>
                <SelectItem value="if-recent">If Recent</SelectItem>
              </SelectContent>
            </Select>
          )
        default:
          return (
            <Input
              className={`mt-1 bg-gray-50 border-gray-200 rounded-xl ${validationErrors[field] ? 'border-red-500' : ''}`}
              type={typeof value === 'number' ? 'number' : 'text'}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={`Enter ${getFieldInfo(field).label}`}
            />
          )
      }
    })()

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {inputElement}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onOpenBooleanBuilder(field)}
            className="flex-shrink-0"
          >
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
        {validationErrors[field] && (
          <p className="text-sm text-red-500">{validationErrors[field]}</p>
        )}
      </div>
    )
  }

  const groupedFields = selectedFields.reduce((acc, field) => {
    const queryField = queryFields.find(f => f.name === field)
    if (queryField) {
      if (!acc[queryField.group]) {
        acc[queryField.group] = []
      }
      acc[queryField.group].push(field)
    }
    return acc
  }, {} as Record<string, (keyof PeopleSearchQueryParams)[]>)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedFields).map(([group, fields]) => (
          <Card key={group} className="overflow-hidden">
            <CardHeader className="bg-muted py-2">
              <CardTitle className="text-sm font-medium">{group}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field} className="space-y-2">
                    <div className="flex items-center space-x-1">
                      <Label htmlFor={field} className="text-sm font-medium text-gray-700">
                        {getFieldInfo(field).label}
                      </Label>
                      <Popover>
                        <PopoverTrigger>
                          <QuestionMarkCircledIcon className="h-4 w-4 text-gray-400" />
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-2 text-sm">
                          {getFieldInfo(field).description}
                          <div className="mt-2">
                            <span className="inline-block bg-gray-100 rounded px-2 py-1 text-sm">Example: &apos;{getFieldInfo(field).example}&apos;</span>
                          </div>
                          {getFieldInfo(field).validation_rules && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">Validation: {getFieldInfo(field).validation_rules}</span>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                    {renderInput(field)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
