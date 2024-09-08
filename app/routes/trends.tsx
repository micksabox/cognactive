import { useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ContentHeader from 'src/components/content-header.tsx'
import { Button } from 'src/components/ui/button'
import db, { DieOffSymptom } from 'src/pages/tracker/db'

export const clientLoader = async () => {
  const symptoms = await db.symptoms.toArray()
  return {
    symptoms: symptoms.map((symptom) => ({
      ...symptom,
      createdAt: new Date(symptom.createdAt),
    })),
  }
}

clientLoader.hydrate = true

export function HydrateFallback() {
  return <p>Loading Symptom Analysis...</p>
}

const SymptomAnalysis = () => {
  const { symptoms } = useLoaderData<typeof clientLoader>()
  const [range, setRange] = useState<'weekly' | 'monthly'>('weekly')

  const processData = (data: DieOffSymptom[], range: 'weekly' | 'monthly') => {
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
      <ContentHeader title="Myco Die-Off" linkTo="/tracker" linkText="Tracker" />
      <p className="text-sm text-gray-500">Chart showing {range === 'weekly' ? 'weekly' : 'monthly'} data</p>
      <div className="my-4">
        <Button
          variant={range === 'weekly' ? 'default' : 'outline'}
          className="rounded-r-none"
          onClick={() => setRange('weekly')}
        >
          Week
        </Button>
        <Button
          variant={range === 'monthly' ? 'default' : 'outline'}
          className="rounded-l-none"
          onClick={() => setRange('monthly')}
        >
          Month
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
          <Bar dataKey="severity" fill="#8884d8" name="Symptom Severity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SymptomAnalysis
