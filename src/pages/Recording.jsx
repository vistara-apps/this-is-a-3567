import React from 'react'
import { Mic, Video, Camera, MapPin, Clock } from 'lucide-react'
import Card from '../components/Card'
import RecordButton from '../components/RecordButton'
import { useApp } from '../context/AppContext'

export default function Recording() {
  const { state } = useApp()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Quick Recording</h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          One-tap recording with automatic timestamp and location capture. 
          Your recordings are stored securely and can be shared with trusted contacts.
        </p>
      </div>

      {/* Recording Interface */}
      <Card variant="elevated" className="text-center">
        <RecordButton variant="both" />
      </Card>

      {/* Recording Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="plain">
          <div className="text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Automatic Timestamp</h3>
            <p className="text-gray-600 text-sm">
              Every recording includes precise date and time information
            </p>
          </div>
        </Card>

        <Card variant="plain">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Location Capture</h3>
            <p className="text-gray-600 text-sm">
              GPS coordinates are automatically saved with each recording
            </p>
          </div>
        </Card>

        <Card variant="plain">
          <div className="text-center">
            <Camera className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Secure Storage</h3>
            <p className="text-gray-600 text-sm">
              Recordings are encrypted and stored securely on IPFS
            </p>
          </div>
        </Card>
      </div>

      {/* Recording History */}
      <Card variant="elevated">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Recordings</h3>
        {state.recordings.length === 0 ? (
          <div className="text-center py-8">
            <Mic className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recordings yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Start your first recording above
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.recordings.map((recording) => (
              <div
                key={recording.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {recording.type === 'audio' ? (
                    <Mic className="h-5 w-5 text-primary" />
                  ) : (
                    <Video className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {recording.type === 'audio' ? 'Audio' : 'Video'} Recording
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(recording.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {(recording.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-gray-400">
                    {recording.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recording Tips */}
      <Card variant="elevated">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recording Tips</h3>
        <div className="space-y-3 text-gray-700">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-3"></div>
            <p>Know your local laws regarding recording police interactions</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-3"></div>
            <p>Keep your phone visible and announce that you are recording</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-3"></div>
            <p>Remain calm and do not interfere with police duties</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-3"></div>
            <p>Keep recording until the interaction is completely over</p>
          </div>
        </div>
      </Card>

      {/* Legal Notice */}
      <Card variant="plain" className="bg-yellow-50 border border-yellow-200">
        <h4 className="font-bold text-yellow-800 mb-2">Legal Recording Notice</h4>
        <p className="text-yellow-700 text-sm">
          Recording laws vary by state and situation. In most states, you have the right to record 
          police in public spaces, but some restrictions may apply. Always verify your local laws 
          and exercise this right responsibly and safely.
        </p>
      </Card>
    </div>
  )
}