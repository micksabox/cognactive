import React from 'react'
import db, { INote } from 'src/pages/tracker/db'
import { formatDateKey } from 'src/lib/utils'
import ContentHeader from 'src/components/content-header.tsx'

import DailyNoteForm from 'src/pages/tracker/daily-note-form'
import { useLiveQuery } from 'dexie-react-hooks'

const TrackerJournal: React.FC = () => {
  const journalNotes = useLiveQuery<INote[]>(() => db.notes.orderBy('date').reverse().toArray(), [])

  const currentDate = formatDateKey(new Date())
  let lastDate = ''

  const journalElements = journalNotes?.flatMap((note, index) => {
    const noteDate = formatDateKey(new Date(note.date))
    const elements = []

    if (noteDate !== lastDate) {
      elements.push(
        <li key={`header-${index}`}>
          <h2 className="text-xl font-bold">{noteDate === currentDate ? 'Today' : noteDate}</h2>
        </li>,
      )
      lastDate = noteDate
    }

    elements.push(
      <li className="p-2" key={index}>
        <p>{note.content}</p>
      </li>,
    )

    return elements
  })
  return (
    <div className="p-2">
      <div className="my-1">
        <ContentHeader title="Note Journal" linkTo="/tracker" linkText="Tracker" />
      </div>
      <DailyNoteForm buttonClassName="my-2" dateKey={formatDateKey(new Date())} />
      {journalNotes?.length === 0 ? (
        <div>No notes found.</div>
      ) : (
        <ul className="divide-y divide-gray-200">{journalElements}</ul>
      )}
      {/* <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              isActive={false}
              onClick={() => setPage((oldPage) => Math.max(0, oldPage - 1))}
              href="#"
            />
          </PaginationItem>
          <PaginationItem>{page + 1}</PaginationItem>
          <PaginationItem>
            <PaginationNext
              isActive={page < Math.floor(totalEntries / pageSize)}
              onClick={() => setPage((oldPage) => Math.min(oldPage + 1, Math.floor(totalEntries / pageSize)))}
              href="#next"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
    </div>
  )
}

export default TrackerJournal
