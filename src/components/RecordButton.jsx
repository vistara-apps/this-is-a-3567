import React, { useState, useRef } from 'react'
import { Mic, Video, Square, Play } from 'lucide-react'
import Button from './Button'
import { useApp } from '../context/AppContext'

export default function RecordButton({ variant = 'both' }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState(null)
  const [recordedBlob, setRecordedBlob] = useState(null)
  const mediaRecorderRef = useRef(null)
  const { dispatch } = useApp()

  const startRecording = async (type) => {
    try {
      const constraints = {
        audio: true,
        video: type === 'video' || type === 'both'
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: type === 'audio' ? 'audio/webm' : 'video/webm' 
        })
        setRecordedBlob(blob)
        
        // Create recording record
        const recording = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          location: 'Location access needed', // Would implement geolocation
          type: type,
          blob: blob,
          size: blob.size
        }

        dispatch({ type: 'ADD_RECORDING', payload: recording })
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingType(type)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to access camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingType(null)
    }
  }

  const playRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob)
      const audio = new Audio(url)
      audio.play()
    }
  }

  if (isRecording) {
    return (
      <div className="text-center space-y-4">
        <div className="recording-pulse">
          <div className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center">
            {recordingType === 'audio' ? (
              <Mic className="h-8 w-8 text-white" />
            ) : (
              <Video className="h-8 w-8 text-white" />
            )}
          </div>
        </div>
        <p className="text-white font-medium">
          Recording {recordingType}...
        </p>
        <Button onClick={stopRecording} variant="secondary">
          <Square className="h-4 w-4 mr-2" />
          Stop Recording
        </Button>
      </div>
    )
  }

  if (recordedBlob) {
    return (
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
          <Play className="h-8 w-8 text-white" />
        </div>
        <p className="text-white font-medium">Recording saved!</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={playRecording} variant="secondary" size="sm">
            Play Recording
          </Button>
          <Button 
            onClick={() => setRecordedBlob(null)} 
            variant="secondary" 
            size="sm"
          >
            Record Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white text-lg font-medium text-center mb-4">
        Quick Recording
      </h3>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {(variant === 'audio' || variant === 'both') && (
          <Button
            onClick={() => startRecording('audio')}
            variant="primary"
            size="lg"
            className="flex-1 sm:flex-none"
          >
            <Mic className="h-5 w-5 mr-2" />
            Record Audio
          </Button>
        )}
        {(variant === 'video' || variant === 'both') && (
          <Button
            onClick={() => startRecording('video')}
            variant="primary"
            size="lg"
            className="flex-1 sm:flex-none"
          >
            <Video className="h-5 w-5 mr-2" />
            Record Video
          </Button>
        )}
      </div>
      <p className="text-white/70 text-sm text-center">
        One-tap recording with automatic timestamp and location capture
      </p>
    </div>
  )
}