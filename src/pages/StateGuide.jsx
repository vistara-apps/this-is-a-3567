import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'

const STATE_GUIDES = {
  'CA': {
    name: 'California',
    rightsInfo: [
      'You have the right to remain silent',
      'You have the right to refuse searches of your person, car, or home without a warrant',
      'You have the right to ask if you are free to leave',
      'You have the right to have an attorney present during questioning',
      'You have the right to refuse field sobriety tests (with potential license consequences)',
      'You have the right to record police interactions in public spaces'
    ],
    prohibitions: [
      'Do not physically resist arrest, even if you believe it is wrongful',
      'Do not lie to police officers - remain silent instead',
      'Do not consent to searches without being legally required',
      'Do not interfere with police duties or investigations',
      'Do not make sudden movements or reach for items without permission'
    ],
    specialNotes: [
      'California has strong protections for recording police interactions',
      'Cannabis laws vary by jurisdiction within California',
      'Immigration status questions require careful consideration'
    ]
  },
  'NY': {
    name: 'New York',
    rightsInfo: [
      'You have the right to remain silent',
      'You have the right to refuse searches without a warrant',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney during questioning',
      'You have the right to record police in public spaces',
      'Stop-and-frisk requires reasonable suspicion of criminal activity'
    ],
    prohibitions: [
      'Do not physically resist arrest',
      'Do not provide false information',
      'Do not consent to searches without legal requirement',
      'Do not interfere with police activities',
      'Do not make threatening gestures or statements'
    ],
    specialNotes: [
      'New York has specific stop-and-frisk regulations',
      'NYPD has body camera policies that may affect interactions',
      'Subway and public transit have additional considerations'
    ]
  },
  'TX': {
    name: 'Texas',
    rightsInfo: [
      'You have the right to remain silent',
      'You have the right to refuse searches without a warrant',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney during questioning',
      'You have limited right to record police interactions',
      'Vehicle searches require probable cause or consent'
    ],
    prohibitions: [
      'Do not physically resist arrest',
      'Do not provide false identification',
      'Do not consent to searches without legal requirement',
      'Do not interfere with police duties',
      'Do not carry weapons without proper licensing'
    ],
    specialNotes: [
      'Texas has concealed carry laws that affect police interactions',
      'Recording police may have restrictions in certain situations',
      'Border areas may have additional federal law enforcement presence'
    ]
  }
}

export default function StateGuide() {
  const { state } = useParams()
  const guide = STATE_GUIDES[state] || {
    name: 'Unknown State',
    rightsInfo: ['Please select a valid state for specific guidance'],
    prohibitions: ['General guidance not available'],
    specialNotes: ['Select a supported state for detailed information']
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="icon" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">
          {guide.name} Rights Guide
        </h1>
      </div>

      {/* Know Your Rights */}
      <Card variant="elevated">
        <div className="flex items-start space-x-3 mb-4">
          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
          <h2 className="text-2xl font-bold text-gray-900">Know Your Rights</h2>
        </div>
        <div className="space-y-3">
          {guide.rightsInfo.map((right, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-3"></div>
              <p className="text-gray-700 leading-relaxed">{right}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* What NOT to Do */}
      <Card variant="elevated">
        <div className="flex items-start space-x-3 mb-4">
          <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
          <h2 className="text-2xl font-bold text-gray-900">What NOT to Say or Do</h2>
        </div>
        <div className="space-y-3">
          {guide.prohibitions.map((prohibition, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-3"></div>
              <p className="text-gray-700 leading-relaxed">{prohibition}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Special Notes */}
      <Card variant="elevated">
        <div className="flex items-start space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
          <h2 className="text-2xl font-bold text-gray-900">Special Considerations</h2>
        </div>
        <div className="space-y-3">
          {guide.specialNotes.map((note, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-3"></div>
              <p className="text-gray-700 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card variant="elevated">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/scripts">
            <Button variant="primary" className="w-full">
              View Scripts
            </Button>
          </Link>
          <Link to="/recording">
            <Button variant="secondary" className="w-full">
              Start Recording
            </Button>
          </Link>
        </div>
      </Card>

      {/* Disclaimer */}
      <Card variant="plain" className="bg-yellow-50 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-yellow-800 mb-1">Important Disclaimer</h4>
            <p className="text-yellow-700 text-sm">
              This information is for educational purposes only and does not constitute legal advice. 
              Laws and enforcement practices can vary by jurisdiction. When in doubt, consult with a 
              qualified attorney familiar with local laws.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}