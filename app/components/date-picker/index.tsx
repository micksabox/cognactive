'use client'

import * as React from 'react'
import { intlFormat } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from 'src/lib/utils'
import { Button } from 'src/components/ui/button'
import { Calendar } from 'src/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { useLocale } from 'remix-i18next/react'
import { useTranslation } from 'react-i18next'

type DatePickerProps = {
  currentDate?: Date
  fromDate?: Date
  toDate?: Date
  onSetDate: (d: Date | undefined) => void
}

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  const [date, setDate] = React.useState<Date | undefined>(props.currentDate)

  React.useEffect(() => {
    setDate(props.currentDate)
  }, [props.currentDate])

  const locale = useLocale('lang')
  const { t } = useTranslation()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            intlFormat(date, { month: 'long', day: 'numeric', year: 'numeric' }, { locale: locale })
          ) : (
            <span>{t('tracker.pick_date')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={props.currentDate || date}
          required
          onSelect={(d) => {
            setDate(props.currentDate || d)
            props.onSetDate(d)
          }}
          fromDate={props.fromDate}
          toDate={props.toDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
