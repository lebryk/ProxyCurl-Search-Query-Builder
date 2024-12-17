"use client"

import { QueryItem } from './QueryComponents'

export const tokenize = (query: string): string[] => {
    const tokens: string[] = []
    let currentToken = ''
    let inQuotes = false
    let parenthesesDepth = 0

    const isOperator = (str: string) => /^(AND|OR)$/.test(str.trim())

    const pushToken = () => {
        const trimmed = currentToken.trim()
        if (trimmed) {
            // Check if the token ends with an operator
            const parts = trimmed.split(/\s+(AND|OR)\s*$/)
            if (parts.length === 3) {
                // If there's a term before the operator
                if (parts[0]) tokens.push(parts[0])
                // Push the operator
                tokens.push(parts[1])
            } else {
                tokens.push(trimmed)
            }
        }
        currentToken = ''
    }

    for (let i = 0; i < query.length; i++) {
        const char = query[i]

        if (char === '"') {
            if (currentToken && !inQuotes) {
                pushToken()
            }
            inQuotes = !inQuotes
            currentToken += char
            if (!inQuotes) {
                pushToken()
            }
        } else if (!inQuotes && char === '(') {
            pushToken()
            tokens.push('(')
            parenthesesDepth++
        } else if (!inQuotes && char === ')') {
            pushToken()
            tokens.push(')')
            parenthesesDepth--
            if (parenthesesDepth < 0) {
                throw new Error('Unmatched closing parenthesis')
            }
        } else if (!inQuotes && char === ' ') {
            // Check if we have an operator
            const nextWord = query.slice(i + 1).match(/^(AND|OR)\s/)
            if (nextWord) {
                pushToken()
                tokens.push(nextWord[1])
                i += nextWord[0].length
            } else {
                currentToken += char
            }
        } else {
            currentToken += char
        }
    }

    pushToken()

    if (parenthesesDepth > 0) {
        throw new Error('Unmatched opening parenthesis')
    }

    // Post-process tokens to handle any remaining operators
    return tokens.reduce((acc: string[], token: string) => {
        if (isOperator(token)) {
            acc.push(token)
        } else {
            const parts = token.split(/\s+(AND|OR)\s+/)
            parts.forEach((part) => {
                if (isOperator(part)) {
                    acc.push(part)
                } else if (part.trim()) {
                    acc.push(part.trim())
                }
            })
        }
        return acc
    }, [])
}

export const deconstructQuery = (query: string): QueryItem[] => {
    const tokens = tokenize(query)
    const result: QueryItem[] = []
    const groupStack: QueryItem[][] = [result]
    let lastOperator: 'AND' | 'OR' | null = null

    tokens.forEach((token) => {
        if (token === '(') {
            const newGroup: QueryItem = { type: 'group', value: '', items: [], operator: lastOperator || undefined }
            groupStack[groupStack.length - 1].push(newGroup)
            groupStack.push(newGroup.items!)
            lastOperator = null
        } else if (token === ')') {
            if (groupStack.length > 1) {
                groupStack.pop()
            }
            // If groupStack.length === 1, we ignore the unmatched closing parenthesis
        } else if (token === 'AND' || token === 'OR') {
            lastOperator = token
        } else {
            const isExact = token.startsWith('"') && token.endsWith('"')
            const value = isExact ? token.slice(1, -1) : token
            const newTerm: QueryItem = {
                type: 'term',
                value: value,
                exact: isExact,
                operator: lastOperator || undefined
            }
            groupStack[groupStack.length - 1].push(newTerm)
            lastOperator = null
        }
    })

    // Handle any remaining open groups
    while (groupStack.length > 1) {
        groupStack.pop()
    }

    return result
}