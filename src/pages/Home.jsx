import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Mic, MessageSquare, Share2 } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import StateSelector from '../components/StateSelector'
import { useApp } from '../context/AppContext'

export default function Home() {
  const { state } = useApp()

  const features = [
    {
      icon: Shield,
      title: 'Know Your Rights',
      description: 'State-specific legal guidance tailored to your location',
      link: state.selectedState ? `/guide/${state.selectedState}` : '#',
      disabled: !state.selectedState
    },
    {
      icon: MessageSquare,
      title: 'What to Say',
      description: 'Pre-written scripts for common police interaction scenarios',
      link: '/scripts',
      disabled: false
    },
    {
      icon: Mic,
      title: 'Quick Recording',
      description: 'One-tap audio/video recording with timestamp and location',
      link: '/recording',
      disabled: false
    },
    {
      icon: Share2,
      title: 'Share & Connect',
      description: 'Generate shareable summary cards and alert trusted contacts',
      link: '/profile',
      disabled: false
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
          Know Your Rights Buddy
        </h1>
        <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
          Your pocket guide to legal rights during police interactions. 
          Instant access to state-specific guidance, actionable scripts, 
          and documentation tools.
        </p>
      </div>

      {/* State Selection */}
      <Card variant="elevated" className="max-w-2xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Get Started
          </h2>
          <p className="text-gray-600">
            Select your state to access personalized legal guidance
          </p>
          <StateSelector variant="dropdown" />
          {state.selectedState && (
            <div className="pt-4">
              <Link to={`/guide/${state.selectedState}`}>
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  View My Rights Guide
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          const content = (
            <Card 
              variant="elevated" 
              className={`h-full transition-all ${
                feature.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 cursor-pointer'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    Learn more
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </Card>
          )

          if (feature.disabled) {
            return <div key={index}>{content}</div>
          }

          return (
            <Link key={index} to={feature.link}>
              {content}
            </Link>
          )
        })}
      </div>

      {/* CTA Section */}
      <Card variant="elevated" className="text-center bg-gradient-to-r from-primary/5 to-accent/5">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Emergency Situation?
        </h2>
        <p className="text-gray-600 mb-6">
          Quick access to recording tools and emergency contact features
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/recording">
            <Button variant="primary" size="lg">
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="secondary" size="lg">
              <Share2 className="h-5 w-5 mr-2" />
              Alert Contacts
            </Button>
          </Link>
        </div>
      </Card>

      {/* Subscription Notice */}
      {state.subscriptionTier === 'free' && (
        <Card variant="plain" className="text-center border-2 border-accent/20">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Unlock Premium Features
          </h3>
          <p className="text-gray-600 mb-4">
            Get unlimited access to all states, advanced recording tools, and emergency alerts
          </p>
          <Link to="/profile">
            <Button variant="primary">
              Upgrade to Premium
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}