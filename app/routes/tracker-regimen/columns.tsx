'use client'

import { ColumnDef } from '@tanstack/react-table'
import { SunriseIcon, SunsetIcon } from 'lucide-react'
import { IRegimen } from 'src/pages/tracker/db'
import HiddenSwitch from './hidden-switch'

export const columns: ColumnDef<IRegimen>[] = [
  {
    accessorFn: (regimen, _index) => regimen,
    cell: ({ getValue }) => {
      const value: IRegimen = getValue<IRegimen>()
      return (
        <span>
          {value.label} {value.timeslot === 'morning' && <SunriseIcon className="inline-block w-4 text-orange-500" />}
          {value.timeslot === 'night' && <SunsetIcon className="inline-block w-4 text-purple-500" />}
        </span>
      )
    },
    header: 'Name',
  },
  {
    accessorKey: 'activityAmount',
    header: 'Amount',
    cell: ({ row }) => (
      <span>
        {row.original.activityAmount} {row.original.unitOfMeasure}
      </span>
    ),
  },
  {
    accessorKey: 'actions',
    header: 'Visible?',
    cell: ({ row }) => <HiddenSwitch regimen={row.original} />,
  },
]
