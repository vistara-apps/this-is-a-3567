import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using demo mode.')
}

export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-key'
)

// Database operations
export const db = {
  // User operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('userId', userId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // State Rights Guide operations
  async getStateGuide(stateCode) {
    const { data, error } = await supabase
      .from('state_rights_guides')
      .select('*')
      .eq('stateCode', stateCode)
      .single()
    
    if (error) throw error
    return data
  },

  async getAllStateGuides() {
    const { data, error } = await supabase
      .from('state_rights_guides')
      .select('stateCode, title')
      .order('title')
    
    if (error) throw error
    return data
  },

  // Incident Record operations
  async createIncidentRecord(recordData) {
    const { data, error } = await supabase
      .from('incident_records')
      .insert([recordData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserIncidentRecords(userId) {
    const { data, error } = await supabase
      .from('incident_records')
      .select('*')
      .eq('userId', userId)
      .order('timestamp', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updateIncidentRecord(recordId, updates) {
    const { data, error } = await supabase
      .from('incident_records')
      .update(updates)
      .eq('recordId', recordId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteIncidentRecord(recordId) {
    const { error } = await supabase
      .from('incident_records')
      .delete()
      .eq('recordId', recordId)
    
    if (error) throw error
    return true
  }
}

// Authentication helpers
export const auth = {
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }
}

// Real-time subscriptions
export const subscriptions = {
  subscribeToUserRecords(userId, callback) {
    return supabase
      .channel('user-records')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incident_records',
          filter: `userId=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  unsubscribe(subscription) {
    supabase.removeChannel(subscription)
  }
}
