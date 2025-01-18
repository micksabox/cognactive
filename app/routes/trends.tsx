import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ContentHeader from 'src/components/content-header.tsx'
import { Button } from 'src/components/ui/button'
import db, { ISymptom } from 'src/pages/tracker/db'
import type { Route } from './+types/trends'
import { useTranslation } from 'react-i18next'

export const clientLoader = async () => {
  const symptoms = await db.symptoms.toArray()
  return {
    symptoms,
  }
}

clientLoader.hydrate = true

export function HydrateFallback() {
  const { t } = useTranslation()
  return <p>{t('tracker.trends.loading')}</p>
}

const SymptomAnalysis: React.FC<Route.ComponentProps> = ({ loaderData }) => {
  const { t } = useTranslation()
  const { symptoms } = loaderData
  const [range, setRange] = useState<'weekly' | 'monthly'>('weekly')

  const processData = (data: ISymptom[], range: 'weekly' | 'monthly') => {
    const groupedData: { [key: string]: number } = {}

    data.forEach((symptom) => {
      let key
      if (range === 'weekly') {
        const date = new Date(symptom.date)
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        key = weekStart.toISOString().split('T')[0]
      } else {
        key = symptom.date.substring(0, 7) // YYYY-MM
      }

      if (!groupedData[key]) {
        groupedData[key] = 0
      }
      groupedData[key] += symptom.severity
    })

    return Object.keys(groupedData)
      .sort()
      .map((key) => ({
        date: key,
        severity: groupedData[key],
      }))
  }

  const chartData = processData(symptoms, range)

  return (
    <div className="max-w-md p-2 md:container">
      <ContentHeader
        title={t('tracker.trends.title')}
        linkTo="/tracker"
        linkText={t('tracker.trends.back_to_tracker')}
      />
      <p className="text-sm text-gray-500">
        {t('tracker.trends.chart_description', { period: t(`tracker.trends.period.${range}`) })}
      </p>
      <div className="my-4">
        <Button
          variant={range === 'weekly' ? 'default' : 'outline'}
          className="rounded-r-none"
          onClick={() => setRange('weekly')}
        >
          {t('tracker.trends.period.week')}
        </Button>
        <Button
          variant={range === 'monthly' ? 'default' : 'outline'}
          className="rounded-l-none"
          onClick={() => setRange('monthly')}
        >
          {t('tracker.trends.period.month')}
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="severity" fill="#8884d8" name={t('tracker.trends.chart.symptom_severity')} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SymptomAnalysis
