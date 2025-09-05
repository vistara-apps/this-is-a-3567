import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const initialState = {
  user: null,
  selectedState: null,
  subscriptionTier: 'free',
  trustedContacts: [],
  recordings: [],
  isLoading: false,
  error: null
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_SELECTED_STATE':
      return { ...state, selectedState: action.payload }
    case 'SET_SUBSCRIPTION':
      return { ...state, subscriptionTier: action.payload }
    case 'ADD_TRUSTED_CONTACT':
      return { 
        ...state, 
        trustedContacts: [...state.trustedContacts, action.payload] 
      }
    case 'REMOVE_TRUSTED_CONTACT':
      return { 
        ...state, 
        trustedContacts: state.trustedContacts.filter(contact => contact.id !== action.payload) 
      }
    case 'ADD_RECORDING':
      return { 
        ...state, 
        recordings: [...state.recordings, action.payload] 
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('kyrb-state')
    if (savedState) {
      const parsed = JSON.parse(savedState)
      if (parsed.selectedState) {
        dispatch({ type: 'SET_SELECTED_STATE', payload: parsed.selectedState })
      }
      if (parsed.subscriptionTier) {
        dispatch({ type: 'SET_SUBSCRIPTION', payload: parsed.subscriptionTier })
      }
      if (parsed.trustedContacts) {
        parsed.trustedContacts.forEach(contact => {
          dispatch({ type: 'ADD_TRUSTED_CONTACT', payload: contact })
        })
      }
    }
  }, [])

  // Save state changes to localStorage
  useEffect(() => {
    const stateToSave = {
      selectedState: state.selectedState,
      subscriptionTier: state.subscriptionTier,
      trustedContacts: state.trustedContacts
    }
    localStorage.setItem('kyrb-state', JSON.stringify(stateToSave))
  }, [state.selectedState, state.subscriptionTier, state.trustedContacts])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}