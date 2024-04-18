import { Edit3Icon } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'src/components/ui/sheet'

import { Textarea } from 'src/components/ui/textarea'
import db from './db'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from '@remix-run/react'

export default function DailyNoteForm({ dateKey }: { dateKey: string }) {
  const [note, setNote] = useState<string>('')

  const navigate = useNavigate()

  //   const recentNotes = useLiveQuery(() => db.notes.orderBy('date').limit(3).toArray(), [dateKey])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="ml-2" variant={'secondary'} size={'sm'}>
          <Edit3Icon className="mr-2 w-4" /> Add Note
        </Button>
      </SheetTrigger>
      <SheetContent side={'top'}>
        <SheetHeader>
          <SheetTitle>What&apos;s notable about {dateKey}?</SheetTitle>
          <SheetDescription>Eat anything special? Do anything different?</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write your note here" />
          {/* <div>
            <h3 className="mt-4 mb-2 text-lg font-semibold">Recent Notes</h3>
            <ul className="flex gap-4">
              {recentNotes?.map((noteItem) => (
                <li key={noteItem.id} className="mb-1">
                  <button
                    className="p-1 w-full text-sm text-left text-gray-700 rounded hover:bg-gray-100"
                    onClick={() => setNote(noteItem.content)}
                  >
                    {noteItem.content}
                  </button>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              disabled={note.length == 0}
              type="submit"
              onClick={() => {
                toast.success('Note saved')
                db.addNote({
                  content: note,
                  date: dateKey,
                  createdAt: new Date(),
                })
                setNote('')
                navigate('/tracker-journal')
              }}
            >
              Save Note
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
