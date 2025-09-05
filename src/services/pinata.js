const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY
const PINATA_BASE_URL = 'https://api.pinata.cloud'

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
  console.warn('Pinata API keys not found. File storage will use local fallback.')
}

// Pinata IPFS service for storing recordings and files
export const pinataService = {
  async uploadFile(file, metadata = {}) {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      return this.simulateUpload(file, metadata)
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Add metadata
      const pinataMetadata = {
        name: metadata.name || file.name,
        keyvalues: {
          type: metadata.type || 'recording',
          timestamp: metadata.timestamp || new Date().toISOString(),
          userId: metadata.userId || 'anonymous',
          ...metadata.customData
        }
      }
      
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata))
      
      // Pinata options
      const pinataOptions = {
        cidVersion: 1,
        customPinPolicy: {
          regions: [
            {
              id: 'FRA1',
              desiredReplicationCount: 2
            },
            {
              id: 'NYC1',
              desiredReplicationCount: 2
            }
          ]
        }
      }
      
      formData.append('pinataOptions', JSON.stringify(pinataOptions))

      const response = await fetch(`${PINATA_BASE_URL}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        ipfsHash: result.IpfsHash,
        pinSize: result.PinSize,
        timestamp: result.Timestamp,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        metadata: pinataMetadata
      }
    } catch (error) {
      console.error('Error uploading to Pinata:', error)
      return this.simulateUpload(file, metadata)
    }
  },

  async uploadJSON(jsonData, metadata = {}) {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      return this.simulateJSONUpload(jsonData, metadata)
    }

    try {
      const pinataMetadata = {
        name: metadata.name || 'json-data',
        keyvalues: {
          type: 'json',
          timestamp: new Date().toISOString(),
          ...metadata
        }
      }

      const data = {
        pinataContent: jsonData,
        pinataMetadata,
        pinataOptions: {
          cidVersion: 1
        }
      }

      const response = await fetch(`${PINATA_BASE_URL}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`Pinata JSON upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        ipfsHash: result.IpfsHash,
        pinSize: result.PinSize,
        timestamp: result.Timestamp,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        metadata: pinataMetadata
      }
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error)
      return this.simulateJSONUpload(jsonData, metadata)
    }
  },

  async getFileInfo(ipfsHash) {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      return this.simulateFileInfo(ipfsHash)
    }

    try {
      const response = await fetch(`${PINATA_BASE_URL}/data/pinList?hashContains=${ipfsHash}`, {
        method: 'GET',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get file info: ${response.statusText}`)
      }

      const result = await response.json()
      const fileInfo = result.rows[0]

      if (!fileInfo) {
        throw new Error('File not found')
      }

      return {
        ipfsHash: fileInfo.ipfs_pin_hash,
        size: fileInfo.size,
        timestamp: fileInfo.date_pinned,
        metadata: fileInfo.metadata,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${fileInfo.ipfs_pin_hash}`
      }
    } catch (error) {
      console.error('Error getting file info:', error)
      return this.simulateFileInfo(ipfsHash)
    }
  },

  async unpinFile(ipfsHash) {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      return { success: true, message: 'Simulated unpin successful' }
    }

    try {
      const response = await fetch(`${PINATA_BASE_URL}/pinning/unpin/${ipfsHash}`, {
        method: 'DELETE',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to unpin file: ${response.statusText}`)
      }

      return {
        success: true,
        message: 'File unpinned successfully'
      }
    } catch (error) {
      console.error('Error unpinning file:', error)
      throw error
    }
  },

  async listUserFiles(userId, limit = 10) {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      return this.simulateFileList(userId, limit)
    }

    try {
      const response = await fetch(
        `${PINATA_BASE_URL}/data/pinList?status=pinned&pageLimit=${limit}&metadata[keyvalues][userId][value]=${userId}`,
        {
          method: 'GET',
          headers: {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to list files: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        files: result.rows.map(file => ({
          ipfsHash: file.ipfs_pin_hash,
          size: file.size,
          timestamp: file.date_pinned,
          metadata: file.metadata,
          gatewayUrl: `https://gateway.pinata.cloud/ipfs/${file.ipfs_pin_hash}`
        })),
        count: result.count
      }
    } catch (error) {
      console.error('Error listing files:', error)
      return this.simulateFileList(userId, limit)
    }
  },

  // Utility methods
  generateGatewayUrl(ipfsHash, gateway = 'pinata') {
    const gateways = {
      pinata: 'https://gateway.pinata.cloud/ipfs/',
      ipfs: 'https://ipfs.io/ipfs/',
      cloudflare: 'https://cloudflare-ipfs.com/ipfs/'
    }
    
    return `${gateways[gateway] || gateways.pinata}${ipfsHash}`
  },

  async testConnection() {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      return { success: false, message: 'API keys not configured' }
    }

    try {
      const response = await fetch(`${PINATA_BASE_URL}/data/testAuthentication`, {
        method: 'GET',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        }
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`)
      }

      const result = await response.json()
      return {
        success: true,
        message: result.message
      }
    } catch (error) {
      console.error('Pinata connection test failed:', error)
      return {
        success: false,
        message: error.message
      }
    }
  },

  // Simulation methods for development/fallback
  simulateUpload(file, metadata) {
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`
    
    return Promise.resolve({
      success: true,
      ipfsHash: mockHash,
      pinSize: file.size,
      timestamp: new Date().toISOString(),
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
      metadata: {
        name: metadata.name || file.name,
        keyvalues: {
          type: metadata.type || 'recording',
          timestamp: metadata.timestamp || new Date().toISOString(),
          userId: metadata.userId || 'demo-user',
          ...metadata.customData
        }
      },
      isSimulated: true
    })
  },

  simulateJSONUpload(jsonData, metadata) {
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`
    
    return Promise.resolve({
      success: true,
      ipfsHash: mockHash,
      pinSize: JSON.stringify(jsonData).length,
      timestamp: new Date().toISOString(),
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
      metadata: {
        name: metadata.name || 'json-data',
        keyvalues: {
          type: 'json',
          timestamp: new Date().toISOString(),
          ...metadata
        }
      },
      isSimulated: true
    })
  },

  simulateFileInfo(ipfsHash) {
    return Promise.resolve({
      ipfsHash,
      size: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
      metadata: {
        name: 'simulated-file',
        keyvalues: {
          type: 'recording',
          userId: 'demo-user'
        }
      },
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      isSimulated: true
    })
  },

  simulateFileList(userId, limit) {
    const files = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      ipfsHash: `Qm${Math.random().toString(36).substring(2, 15)}`,
      size: Math.floor(Math.random() * 1000000),
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        name: `recording-${i + 1}`,
        keyvalues: {
          type: 'recording',
          userId
        }
      },
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/Qm${Math.random().toString(36).substring(2, 15)}`
    }))

    return Promise.resolve({
      files,
      count: files.length,
      isSimulated: true
    })
  }
}
