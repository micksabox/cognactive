import React, { useEffect, useState } from 'react'
import db, { ISupplement, INote } from 'src/pages/tracker/db'
import { formatDateKey } from 'src/lib/utils'
import ContentHeader from 'src/components/content-header.tsx'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from 'src/components/ui/pagination'

interface JournalEntry {
  [date: string]: (ISupplement | INote)[]
}

const TrackerJournal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry>({})
  const [page, setPage] = useState(0)
  const pageSize = 50
  const [totalEntries, setTotalEntries] = useState(0)

  const loadEntries = async () => {
    const supplements: ISupplement[] = await db.supplements
      .orderBy('date')
      .reverse()
      .offset(page * pageSize)
      .limit(pageSize)
      .toArray()
    const notes: INote[] = await db.notes
      .orderBy('date')
      .reverse()
      .offset(page * pageSize)
      .limit(pageSize)
      .toArray()

    const combinedEntries: JournalEntry = supplements
      // @ts-ignore
      .concat(notes)
      .reduce((acc: JournalEntry, entry: ISupplement | INote) => {
        const { date } = entry
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(entry)
        return acc
      }, {})

    setEntries((prevEntries) => ({
      ...prevEntries,
      ...combinedEntries,
    }))
  }

  useEffect(() => {
    loadEntries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    const fetchTotalEntries = async () => {
      const totalSupplements = await db.supplements.count()
      const totalNotes = await db.notes.count()
      setTotalEntries(totalSupplements + totalNotes)
    }

    fetchTotalEntries()
  }, [])

  return (
    <div className="p-2">
      <ContentHeader title="Journal" linkTo="/tracker" linkText="Tracker" />
      {Object.keys(entries).length === 0 ? (
        <div>No journal entries found.</div>
      ) : (
        <ul>
          {Object.entries(entries).map(([date, contents], index) => (
            <li key={index}>
              <p className="text-slate-400">{formatDateKey(new Date(date))}</p>
              {contents.map((content, contentIndex) => (
                <p key={contentIndex}>
                  {'content' in content
                    ? `Note: ${content.content}`
                    : `${content.name} - ${content.dosage} ${content.dosageUnit}`}
                </p>
              ))}
            </li>
          ))}
        </ul>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage((oldPage) => Math.max(0, oldPage - 1))} href="#" />
          </PaginationItem>
          <PaginationItem>{page + 1}</PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((oldPage) => Math.min(oldPage + 1, Math.floor(totalEntries / pageSize)))}
              href="#"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default TrackerJournal
