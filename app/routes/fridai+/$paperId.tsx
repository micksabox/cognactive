import { useLoaderData } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'
import { semanticScholarClient } from '@/utils/semantic-scholar.server'
import type { Paper } from '@/utils/semantic-scholar.server'

export const loader: LoaderFunction = async ({ params }) => {
  const { paperId } = params

  if (!paperId) {
    throw new Response('No paper ID provided', { status: 400 })
  }

  try {
    const paper = await semanticScholarClient.getPaper(paperId)
    console.log('paper', paper, paperId)
    return json({ paper })
  } catch (error) {
    console.error('Error fetching paper:', error)
    throw new Response('Failed to fetch paper details', { status: 500 })
  }
}

export default function PaperDetails() {
  const { paper } = useLoaderData<{ paper: Paper }>()

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{paper.title}</h1>
      <p className="mb-2">
        <strong>Authors:</strong> {paper.authors.join(', ')}
      </p>
      <p className="mb-2">
        <strong>Year:</strong> {paper.year}
      </p>
      <p className="mb-2">
        <strong>Venue:</strong> {paper.venue}
      </p>
      <p className="mb-4">
        <strong>Abstract:</strong> {paper.abstract}
      </p>
      <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        View on Semantic Scholar
      </a>
    </div>
  )
}
