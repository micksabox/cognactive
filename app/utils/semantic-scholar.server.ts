import axios, { AxiosInstance } from 'axios'
import { SemanticScholar } from 'semanticscholarjs'

export const semanticScholar = new SemanticScholar(10000, process.env.SEMANTIC_SCHOLAR_API_KEY)

type ApiResponse<T> = {
  data: T[]
  total?: number
  offset: number
  next?: number
}

export type PaperSearchItem = {
  paperId: string
  title: string
}

export type Paper = {
  abstract: string
  authors: string[]
  citationCount: number
  citations: Paper[]
  corpusId: string
  embedding: string
  externalIds: string[]
  fieldsOfStudy: string[]
  influentialCitationCount: number
  isOpenAccess: boolean
  //   journal: Journal
  openAccessPdf: string
  paperId: string
  publicationDate: Date
  publicationTypes: string[]
  //   publicationVenue: PublicationVenue
  referenceCount: number
  //   references: Paper[]
  s2FieldsOfStudy: string[]
  title: string
  //   tldr: Tldr
  url: string
  venue: string
  year: number
}

class SemanticScholarClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.semanticscholar.org/graph/v1',
      timeout: 10000,
      headers: {
        'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY,
      },
    })
  }

  async searchPapers(query: string, limit = 10) {
    try {
      const response = await this.client.get<ApiResponse<PaperSearchItem>>(`/paper/search`, {
        params: {
          query,
          fields: 'paperId,title,abstract,year,authors',
          limit,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error searching papers:', error)
      throw error
    }
  }

  async getPaper(paperId: string) {
    const response = await this.client.get(`/paper/${paperId}`, {
      params: {
        fields:
          'abstract,authors,citationCount,citations,fieldsOfStudy,influentialCitationCount,isOpenAccess,openAccessPdf,publicationDate,publicationTypes,referenceCount,s2FieldsOfStudy,title,url,venue,year',
      },
    })
    return response.data
  }
}

const semanticScholarClient = new SemanticScholarClient()

export { semanticScholarClient }
