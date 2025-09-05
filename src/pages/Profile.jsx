import React, { useState } from 'react'
import { User, Shield, Users, CreditCard, Settings, Plus, Trash2 } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import ShareCardGenerator from '../components/ShareCardGenerator'
import { useApp } from '../context/AppContext'

export default function Profile() {
  const { state, dispatch } = useApp()
  const [showAddContact, setShowAddContact] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' })

  const addTrustedContact = () => {
    if (newContact.name && (newContact.phone || newContact.email)) {
      const contact = {
        id: Date.now().toString(),
        ...newContact
      }
      dispatch({ type: 'ADD_TRUSTED_CONTACT', payload: contact })
      setNewContact({ name: '', phone: '', email: '' })
      setShowAddContact(false)
    }
  }

  const removeTrustedContact = (contactId) => {
    dispatch({ type: 'REMOVE_TRUSTED_CONTACT', payload: contactId })
  }

  const upgradeSubscription = () => {
    // Simulate subscription upgrade
    dispatch({ type: 'SET_SUBSCRIPTION', payload: 'premium' })
    alert('Upgraded to Premium! (Demo simulation)')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Profile & Settings</h1>
        <p className="text-white/90">
          Manage your account, trusted contacts, and emergency sharing features
        </p>
      </div>

      {/* Subscription Status */}
      <Card variant="elevated">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 capitalize">
                {state.subscriptionTier} Plan
              </h3>
              <p className="text-gray-600">
                {state.subscriptionTier === 'free' 
                  ? 'Limited access to features' 
                  : 'Full access to all features'
                }
              </p>
            </div>
          </div>
          {state.subscriptionTier === 'free' && (
            <Button onClick={upgradeSubscription} variant="primary">
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          )}
        </div>

        {state.subscriptionTier === 'free' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">Premium Features Include:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Unlimited access to all state guides</li>
              <li>• Advanced recording tools and storage</li>
              <li>• Emergency contact alerts</li>
              <li>• AI-powered summary generation</li>
              <li>• Priority customer support</li>
            </ul>
          </div>
        )}
      </Card>

      {/* Trusted Contacts */}
      <Card variant="elevated">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold text-gray-900">Trusted Contacts</h3>
          </div>
          <Button
            onClick={() => setShowAddContact(true)}
            variant="secondary"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {showAddContact && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">Add Trusted Contact</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="flex space-x-3">
                <Button onClick={addTrustedContact} variant="primary" size="sm">
                  Add Contact
                </Button>
                <Button onClick={() => setShowAddContact(false)} variant="secondary" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {state.trustedContacts.length === 0 ? (
          <div className="text-center py-6">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No trusted contacts added</p>
            <p className="text-gray-400 text-sm mt-2">
              Add contacts who can receive emergency alerts and summary cards
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.trustedContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{contact.name}</h4>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-600">
                    {contact.phone && <span>{contact.phone}</span>}
                    {contact.email && <span>{contact.email}</span>}
                  </div>
                </div>
                <Button
                  onClick={() => removeTrustedContact(contact.id)}
                  variant="icon"
                  size="icon"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Share Card Generator */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Emergency Sharing</h3>
        <ShareCardGenerator variant="preview" />
      </div>

      {/* Account Settings */}
      <Card variant="elevated">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold text-gray-900">Account Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="font-medium text-gray-900">Selected State</h4>
              <p className="text-sm text-gray-600">
                {state.selectedState || 'No state selected'}
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="font-medium text-gray-900">Recording Quality</h4>
              <p className="text-sm text-gray-600">High quality (default)</p>
            </div>
            <Button variant="secondary" size="sm">
              Adjust
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900">Data & Privacy</h4>
              <p className="text-sm text-gray-600">Manage your data preferences</p>
            </div>
            <Button variant="secondary" size="sm">
              Manage
            </Button>
          </div>
        </div>
      </Card>

      {/* Support */}
      <Card variant="plain" className="text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-gray-600 mb-4">
          Contact our support team for assistance with the app or legal questions
        </p>
        <Button variant="primary">
          Contact Support
        </Button>
      </Card>
    </div>
  )
}