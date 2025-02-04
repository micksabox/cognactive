import { useState } from 'react'
import { CheckCircle, ExternalLink, XCircle } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

const PrivacyDimensions: React.FC = () => {
  const { t } = useTranslation()
  const [selectedDimension, setSelectedDimension] = useState('localDataStorage')

  const dimensions = [
    {
      id: 'localDataStorage',
      name: t('privacy.dimensions.local-storage.title'),
      description: t('privacy.dimensions.local-storage.description'),
      icon: CheckCircle,
    },
    {
      id: 'thirdPartySharing',
      name: t('privacy.dimensions.third-party.title'),
      description: t('privacy.dimensions.third-party.description'),
      icon: XCircle,
    },
  ]

  return (
    <div className="container mx-auto">
      <h2 className="py-8 text-4xl font-bold">{t('privacy.title')}</h2>
      <Link className="text-slate-6000" to="policy">
        {t('privacy.policy-link')} <ExternalLink className="ml-2 inline-block h-6 w-6" />
      </Link>
      <h2 className="py-4 text-2xl font-semibold">{t('privacy.regimen-title')}</h2>
      <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
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
