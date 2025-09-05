// Geolocation service for capturing location data during incidents
export const geolocationService = {
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
      ...options
    }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: new Date(position.timestamp).toISOString()
          }
          resolve(locationData)
        },
        (error) => {
          reject(this.handleGeolocationError(error))
        },
        defaultOptions
      )
    })
  },

  async watchPosition(callback, errorCallback, options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute for watching
      ...options
    }

    if (!navigator.geolocation) {
      errorCallback(new Error('Geolocation is not supported by this browser'))
      return null
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: new Date(position.timestamp).toISOString()
        }
        callback(locationData)
      },
      (error) => {
        errorCallback(this.handleGeolocationError(error))
      },
      defaultOptions
    )

    return watchId
  },

  clearWatch(watchId) {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
  },

  async reverseGeocode(latitude, longitude) {
    try {
      // Using a free geocoding service (OpenStreetMap Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'KnowYourRightsBuddy/1.0'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Geocoding request failed')
      }

      const data = await response.json()
      
      return {
        address: data.display_name,
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        country: data.address?.country,
        postalCode: data.address?.postcode,
        county: data.address?.county,
        neighborhood: data.address?.neighbourhood || data.address?.suburb,
        street: data.address?.road,
        houseNumber: data.address?.house_number,
        formatted: data.display_name
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      return {
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        formatted: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      }
    }
  },

  async getLocationWithAddress(options = {}) {
    try {
      const position = await this.getCurrentPosition(options)
      const address = await this.reverseGeocode(position.latitude, position.longitude)
      
      return {
        ...position,
        address
      }
    } catch (error) {
      throw error
    }
  },

  handleGeolocationError(error) {
    const errorMessages = {
      [error.PERMISSION_DENIED]: 'Location access denied by user',
      [error.POSITION_UNAVAILABLE]: 'Location information is unavailable',
      [error.TIMEOUT]: 'Location request timed out'
    }

    return new Error(errorMessages[error.code] || 'Unknown geolocation error')
  },

  async requestPermission() {
    try {
      if (!navigator.permissions) {
        // Fallback: try to get position to trigger permission request
        await this.getCurrentPosition({ timeout: 1000 })
        return 'granted'
      }

      const permission = await navigator.permissions.query({ name: 'geolocation' })
      return permission.state
    } catch (error) {
      console.error('Error requesting location permission:', error)
      return 'denied'
    }
  },

  formatCoordinates(latitude, longitude, format = 'decimal') {
    switch (format) {
      case 'dms': // Degrees, Minutes, Seconds
        return {
          latitude: this.decimalToDMS(latitude, 'lat'),
          longitude: this.decimalToDMS(longitude, 'lng')
        }
      case 'dm': // Degrees, Minutes
        return {
          latitude: this.decimalToDM(latitude, 'lat'),
          longitude: this.decimalToDM(longitude, 'lng')
        }
      case 'decimal':
      default:
        return {
          latitude: parseFloat(latitude.toFixed(6)),
          longitude: parseFloat(longitude.toFixed(6))
        }
    }
  },

  decimalToDMS(decimal, type) {
    const absolute = Math.abs(decimal)
    const degrees = Math.floor(absolute)
    const minutesFloat = (absolute - degrees) * 60
    const minutes = Math.floor(minutesFloat)
    const seconds = Math.round((minutesFloat - minutes) * 60 * 100) / 100

    const direction = type === 'lat' 
      ? (decimal >= 0 ? 'N' : 'S')
      : (decimal >= 0 ? 'E' : 'W')

    return `${degrees}°${minutes}'${seconds}"${direction}`
  },

  decimalToDM(decimal, type) {
    const absolute = Math.abs(decimal)
    const degrees = Math.floor(absolute)
    const minutes = Math.round((absolute - degrees) * 60 * 1000) / 1000

    const direction = type === 'lat' 
      ? (decimal >= 0 ? 'N' : 'S')
      : (decimal >= 0 ? 'E' : 'W')

    return `${degrees}°${minutes}'${direction}`
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    
    return {
      kilometers: Math.round(distance * 100) / 100,
      miles: Math.round(distance * 0.621371 * 100) / 100
    }
  },

  toRadians(degrees) {
    return degrees * (Math.PI / 180)
  },

  // Privacy-focused location sharing
  obfuscateLocation(latitude, longitude, radiusMeters = 100) {
    // Add random offset within specified radius for privacy
    const offsetLat = (Math.random() - 0.5) * 2 * (radiusMeters / 111000) // ~111km per degree
    const offsetLon = (Math.random() - 0.5) * 2 * (radiusMeters / (111000 * Math.cos(latitude * Math.PI / 180)))
    
    return {
      latitude: latitude + offsetLat,
      longitude: longitude + offsetLon,
      accuracy: radiusMeters,
      obfuscated: true
    }
  },

  // Emergency location sharing
  async shareLocationWithContacts(contacts, message = '') {
    try {
      const location = await this.getLocationWithAddress()
      const shareData = {
        location,
        message,
        timestamp: new Date().toISOString(),
        emergencyContact: true
      }

      // In a real implementation, this would send to your backend
      // which would notify the contacts via SMS/email
      console.log('Sharing location with contacts:', contacts, shareData)
      
      // Simulate sharing
      return {
        success: true,
        sharedWith: contacts.length,
        location: location.address.formatted
      }
    } catch (error) {
      console.error('Error sharing location:', error)
      throw error
    }
  }
}
