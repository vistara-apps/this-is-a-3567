import React, { useState } from 'react'
import { MessageSquare, Copy, Check, Volume2 } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'

const SCRIPT_CATEGORIES = {
  'traffic-stop': {
    title: 'Traffic Stop',
    scripts: [
      {
        id: 'traffic-basic',
        title: 'Basic Traffic Stop Response',
        english: "Officer, I am exercising my right to remain silent. I do not consent to any searches. Am I free to leave?",
        spanish: "Oficial, estoy ejerciendo mi derecho a permanecer en silencio. No consiento a ningún registro. ¿Soy libre de irme?",
        scenario: 'When pulled over for a traffic violation'
      },
      {
        id: 'traffic-search',
        title: 'Refusing Vehicle Search',
        english: "I do not consent to a search of my vehicle. I am exercising my Fourth Amendment rights.",
        spanish: "No consiento a un registro de mi vehículo. Estoy ejerciendo mis derechos de la Cuarta Enmienda.",
        scenario: 'When officer requests to search your car'
      }
    ]
  },
  'questioning': {
    title: 'Police Questioning',
    scripts: [
      {
        id: 'questioning-basic',
        title: 'Invoking Right to Silence',
        english: "I am invoking my right to remain silent and my right to an attorney. I will not answer any questions without my lawyer present.",
        spanish: "Estoy invocando mi derecho a permanecer en silencio y mi derecho a un abogado. No responderé ninguna pregunta sin mi abogado presente.",
        scenario: 'When being questioned by police'
      },
      {
        id: 'questioning-detention',
        title: 'Asking About Detention',
        english: "Am I under arrest or am I free to leave? If I am not under arrest, I would like to leave now.",
        spanish: "¿Estoy arrestado o soy libre de irme? Si no estoy arrestado, me gustaría irme ahora.",
        scenario: 'When unsure if you are being detained'
      }
    ]
  },
  'home': {
    title: 'Home Encounters',
    scripts: [
      {
        id: 'home-warrant',
        title: 'Requesting to See Warrant',
        english: "I do not consent to you entering my home. Do you have a warrant? I would like to see the warrant before you enter.",
        spanish: "No consiento que entren a mi casa. ¿Tienen una orden? Me gustaría ver la orden antes de que entren.",
        scenario: 'When police come to your door'
      },
      {
        id: 'home-no-entry',
        title: 'Refusing Entry Without Warrant',
        english: "I am exercising my rights under the Fourth Amendment. I do not consent to any search of my home without a warrant.",
        spanish: "Estoy ejerciendo mis derechos bajo la Cuarta Enmienda. No consiento a ningún registro de mi casa sin una orden.",
        scenario: 'When police want to enter without warrant'
      }
    ]
  }
}

export default function Scripts() {
  const [selectedCategory, setSelectedCategory] = useState('traffic-stop')
  const [copiedScript, setCopiedScript] = useState(null)
  const [language, setLanguage] = useState('english')

  const copyToClipboard = async (text, scriptId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedScript(scriptId)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'spanish' ? 'es-ES' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Actionable Scripts</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          Pre-written phrases and clear instructions for common police interaction scenarios. 
          Practice these ahead of time to communicate effectively under pressure.
        </p>
      </div>

      {/* Language Toggle */}
      <Card variant="plain" className="max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-4">
          <span className="text-gray-700 font-medium">Language:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLanguage('english')}
              className={`px-4 py-2 rounded-md transition-colors ${
                language === 'english'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('spanish')}
              className={`px-4 py-2 rounded-md transition-colors ${
                language === 'spanish'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Español
            </button>
          </div>
        </div>
      </Card>

      {/* Category Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(SCRIPT_CATEGORIES).map(([key, category]) => (
          <Card
            key={key}
            variant={selectedCategory === key ? 'elevated' : 'plain'}
            className={`cursor-pointer transition-all ${
              selectedCategory === key
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-white/70'
            }`}
            onClick={() => setSelectedCategory(key)}
          >
            <div className="text-center">
              <MessageSquare className={`h-8 w-8 mx-auto mb-2 ${
                selectedCategory === key ? 'text-primary' : 'text-gray-400'
              }`} />
              <h3 className="font-bold text-gray-900">{category.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {category.scripts.length} scripts
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Scripts */}
      <div className="space-y-4">
        {SCRIPT_CATEGORIES[selectedCategory].scripts.map((script) => (
          <Card key={script.id} variant="elevated" className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {script.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Scenario:</strong> {script.scenario}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  {language === 'english' ? 'English' : 'Spanish'}
                </h4>
                <div className="flex space-x-2">
                  <Button
                    variant="icon"
                    size="icon"
                    onClick={() => speakText(language === 'english' ? script.english : script.spanish)}
                    className="bg-white/50 hover:bg-white/70"
                  >
                    <Volume2 className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="icon"
                    size="icon"
                    onClick={() => copyToClipboard(
                      language === 'english' ? script.english : script.spanish,
                      script.id
                    )}
                    className="bg-white/50 hover:bg-white/70"
                  >
                    {copiedScript === script.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-gray-900 leading-relaxed font-medium">
                "{language === 'english' ? script.english : script.spanish}"
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                <strong>Tip:</strong> Practice saying this phrase clearly and calmly. 
                Repeat it exactly as written to ensure you properly invoke your rights.
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Practice Tips */}
      <Card variant="elevated">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Practice Tips</h3>
        <div className="space-y-3 text-gray-700">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-3"></div>
            <p>Memorize at least one script from each category</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-3"></div>
            <p>Practice speaking these phrases out loud regularly</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-3"></div>
            <p>Stay calm and speak clearly when using these scripts</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-3"></div>
            <p>Repeat the phrases exactly as written for maximum legal protection</p>
          </div>
        </div>
      </Card>
    </div>
  )
}