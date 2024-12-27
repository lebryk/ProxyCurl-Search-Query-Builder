import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PeopleSearchQueryParams } from '@/types/searchTypes'

interface QueryListProps {
  queries: Partial<PeopleSearchQueryParams>[]
}

export default function QueryList({ queries }: QueryListProps) {
  if (queries.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Added Queries</h2>
      {queries.map((query, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Query {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{JSON.stringify(query, null, 2)}</pre>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

