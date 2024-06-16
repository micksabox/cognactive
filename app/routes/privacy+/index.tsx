import { useState } from 'react'
import { CheckCircle, ExternalLink, XCircle } from 'lucide-react'
import { Link } from '@remix-run/react'

const PrivacyDimensions: React.FC = () => {
  const [selectedDimension, setSelectedDimension] = useState('localDataStorage')

  const dimensions = [
    {
      id: 'localDataStorage',
      name: 'Local Data Privacy',
      description: 'Regimen activity data is stored only on your device and never transmitted to servers.',
      icon: CheckCircle,
    },
    {
      id: 'thirdPartySharing',
      name: 'No Third-Party Sharing',
      description: 'Regimen activity data is not shared with third parties.',
      icon: XCircle,
    },
  ]

  return (
    <div className="container mx-auto">
      <h2 className="py-8 text-4xl font-bold">Privacy &amp; Data Usage</h2>
      <Link className="text-slate-6000" to="policy">
        Read full privacy policy <ExternalLink className="ml-2 inline-block h-6 w-6" />
      </Link>
      <h2 className="py-4 text-2xl font-semibold">Protocol Regimen Tracking Utility</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {dimensions.map((dimension) => (
          <button
            key={dimension.id}
            className={`rounded-lg border p-4 text-left ${
              selectedDimension === dimension.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setSelectedDimension(dimension.id)}
          >
            <div className="mb-2 flex items-center">
              <dimension.icon
                className={`mr-2 h-6 w-6 ${selectedDimension === dimension.id ? 'text-blue-500' : 'text-gray-500'}`}
              />
              <span className="text-lg font-semibold">{dimension.name}</span>
            </div>
            <p className="text-gray-600">{dimension.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PrivacyDimensions
