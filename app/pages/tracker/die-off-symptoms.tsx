import React, { useRef } from 'react'
import { useSymptomCount, useTrackSymptom } from './use-track-symptom'
import { Button } from 'src/components/ui/button'
import { BarChart2, PenLineIcon, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { formatDateKey } from 'src/lib/utils'
import { ISymptom } from './db'
import { TrackerTool } from './dashboard'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

// Map the default symptoms to their translation keys
const defaultSymptomKeys = [
  'tiredness',
  'exhaustion',
  'muscle_soreness',
  'increased_discharge',
  'cold_flu',
  'cold_sores',
  'headaches',
  'irritability',
  'stool_changes',
  'rash',
  'bloated_stomach',
  'cramps',
  'increased_gas',
] as const

type DieOffSymptomsProps = {
  date: Date
}

const DieOffSymptoms: React.FC<DieOffSymptomsProps> = (props) => {
  const { t } = useTranslation()
  const dateKey = formatDateKey(props.date)

  const { symptoms, customSymptoms, addSymptom } = useTrackSymptom(dateKey)

  const totalSymptoms = useSymptomCount(undefined)

  const inputRef = useRef<HTMLInputElement | null>(null)

  // Get the translated default symptoms
  const defaultSymptoms = defaultSymptomKeys.map((key) => t(`tracker.die_off_symptoms.symptoms.${key}`))

  const handleSymptomChange = (symptom: string, custom: boolean) => {
    if (custom && defaultSymptoms.includes(symptom)) {
      return
    }

    addSymptom({
      date: dateKey,
      type: symptom,
      severity: 1, // by default
      custom: custom ? 1 : 0,
      createdAt: new Date(),
    }).then((maybeId) => {
      if (maybeId) {
        toast.success(
          t('tracker.die_off_symptoms.new_symptom.success', {
            date: dateKey,
            custom: custom ? ' custom' : '',
            symptom,
          }),
          { position: 'top-left' },
        )
      }

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    })
  }

  return (
    <div>
      <TrackerTool
        title={t('tracker.die_off_symptoms.title')}
        toolbarItems={
          <div className="flex items-center gap-2">
            <div className="text-right text-xs font-semibold">{t('tracker.die_off_symptoms.total')}</div>
            <span className="text-2xl font-bold">{totalSymptoms}</span>
          </div>
        }
      />
      <div className="my-2 flex items-center justify-between gap-2">
        <p className="text-sm text-slate-600">{t('tracker.die_off_symptoms.description')}</p>
        <Button className="text-blue-500" size={'sm'} variant={'link'} asChild>
          <Link to="/trends" viewTransition>
            <BarChart2 className="mr-2 inline-block w-4" />
            {t('tracker.die_off_symptoms.view_chart')}
          </Link>
        </Button>
      </div>
      <ul>
        <li>
          <form
            className="relative flex w-full items-center space-x-2 rounded-t border border-b-0 p-2"
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const customSymptom = formData.get('custom_symptom') as string
              if (customSymptom.length > 2) {
                handleSymptomChange(customSymptom, true)
              } else {
                toast.error(t('tracker.die_off_symptoms.new_symptom.error'))
              }
            }}
          >
            <input
              ref={inputRef}
              className="ml-4 w-full p-2"
              type="text"
              placeholder={t('tracker.die_off_symptoms.new_symptom.placeholder')}
              name="custom_symptom"
            />
            <PenLineIcon className="absolute left-0 w-4 text-slate-400" />
            <Button size={'sm'} variant={'secondary'} type="submit">
              <Plus className="w-4" />
              {t('tracker.die_off_symptoms.new_symptom.track_button')}
            </Button>
          </form>
        </li>
        {defaultSymptoms.concat((customSymptoms || []).map((s) => s.type)).map((symptom) => (
          <SymptomListItem
            key={symptom}
            symptom={symptom}
            symptoms={symptoms}
            handleSymptomChange={handleSymptomChange}
          />
        ))}
      </ul>
    </div>
  )
}

const SymptomListItem = ({
  symptom,
  symptoms,
  handleSymptomChange,
}: {
  symptom: string
  symptoms?: ISymptom[]
  handleSymptomChange: (symptom: string, flag: boolean) => void
}) => {
  const symptomCount = useSymptomCount(symptom)

  return (
    <li className="flex w-full border border-b-0 px-4 py-2 last-of-type:border-b" key={symptom}>
      <label className="w-full items-center">
        <input
          type="checkbox"
          checked={symptoms && symptoms.find((s) => s.type == symptom) !== undefined ? true : false}
          onChange={() => handleSymptomChange(symptom, false)}
        />{' '}
        {symptom}
      </label>
      <span className="text-slate-300">{symptomCount}</span>
    </li>
  )
}

export default DieOffSymptoms
