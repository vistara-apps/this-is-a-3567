import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Payment features will be disabled.')
}

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey || 'pk_test_demo')

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Basic rights information',
      'Limited state guides (1 state)',
      'Basic scripts',
      'Community support'
    ],
    limits: {
      stateGuides: 1,
      recordings: 5,
      trustedContacts: 2
    }
  },
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 1.99,
    priceId: 'price_basic_monthly', // Replace with actual Stripe price ID
    features: [
      'All free features',
      'Access to 5 state guides',
      'Extended script library',
      'Email support',
      'Basic incident recording'
    ],
    limits: {
      stateGuides: 5,
      recordings: 25,
      trustedContacts: 5
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'All basic features',
      'Unlimited state guides',
      'AI-powered script generation',
      'Advanced documentation tools',
      'Emergency contact alerts',
      'Priority support',
      'Cloud storage for recordings'
    ],
    limits: {
      stateGuides: Infinity,
      recordings: Infinity,
      trustedContacts: 20
    }
  }
}

// Payment service
export const paymentService = {
  async createCheckoutSession(priceId, userId, successUrl, cancelUrl) {
    try {
      // In a real implementation, this would call your backend API
      // which would create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl,
          cancelUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      
      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      // For demo purposes, simulate successful subscription
      return this.simulateSubscription(priceId, userId)
    }
  },

  async createPortalSession(customerId, returnUrl) {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error creating portal session:', error)
      throw error
    }
  },

  // Demo/simulation methods for development
  simulateSubscription(priceId, userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tier = Object.values(SUBSCRIPTION_TIERS).find(t => t.priceId === priceId)
        resolve({
          success: true,
          subscription: {
            id: `sub_${Date.now()}`,
            status: 'active',
            tier: tier?.id || 'premium',
            customerId: `cus_${userId}`,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
          }
        })
      }, 1500)
    })
  },

  async getSubscriptionStatus(userId) {
    try {
      const response = await fetch(`/api/subscription-status/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting subscription status:', error)
      // Return demo data for development
      return {
        tier: 'free',
        status: 'active',
        currentPeriodEnd: null
      }
    }
  },

  getTierByPriceId(priceId) {
    return Object.values(SUBSCRIPTION_TIERS).find(tier => tier.priceId === priceId)
  },

  getTierById(tierId) {
    return Object.values(SUBSCRIPTION_TIERS).find(tier => tier.id === tierId) || SUBSCRIPTION_TIERS.FREE
  },

  canAccessFeature(userTier, feature, currentUsage = 0) {
    const tier = this.getTierById(userTier)
    const limit = tier.limits[feature]
    
    if (limit === Infinity) return true
    return currentUsage < limit
  }
}

// Webhook handler utilities (for backend implementation)
export const webhookHandlers = {
  handleCheckoutCompleted(session) {
    // Handle successful subscription creation
    console.log('Checkout completed:', session)
  },

  handleSubscriptionUpdated(subscription) {
    // Handle subscription changes
    console.log('Subscription updated:', subscription)
  },

  handleSubscriptionDeleted(subscription) {
    // Handle subscription cancellation
    console.log('Subscription deleted:', subscription)
  },

  handleInvoicePaymentSucceeded(invoice) {
    // Handle successful payment
    console.log('Payment succeeded:', invoice)
  },

  handleInvoicePaymentFailed(invoice) {
    // Handle failed payment
    console.log('Payment failed:', invoice)
  }
}
