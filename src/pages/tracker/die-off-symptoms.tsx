/*
Fungal die off symptoms may include :
Tiredness, exhaustion, muscle soreness, increased chest or nasal discharge, cold or flu like symptoms, cold sores, headaches, irritability, change in stool frequency, volume or color; rash, bloated stomach, cramps, increased gas.
*/

import React, { useState } from 'react'

const symptoms = [
  'Tiredness',
  'Exhaustion',
  'Muscle soreness',
  'Increased chest or nasal discharge',
  'Cold or flu like symptoms',
  'Cold sores',
  'Headaches',
  'Irritability',
  'Change in stool frequency, volume or color',
  'Rash',
  'Bloated stomach',
  'Cramps',
  'Increased gas',
]

const DieOffSymptoms: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])

  const handleSymptomChange = (symptom: string) => {
    setSelectedSymptoms((prevSelectedSymptoms) =>
      prevSelectedSymptoms.includes(symptom)
        ? prevSelectedSymptoms.filter((s) => s !== symptom)
        : [...prevSelectedSymptoms, symptom],
    )
  }

  return (
    <div>
      <h3>Select your symptoms:</h3>
      <ul>
        {symptoms.map((symptom) => (
          <li key={symptom}>
            <label>
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => handleSymptomChange(symptom)}
              />
              &nbsp;{symptom}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DieOffSymptoms
