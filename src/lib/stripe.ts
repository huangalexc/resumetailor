import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: '', // No price ID for free plan
    features: [
      '1 resume',
      'Basic templates',
      '3 job applications per month',
      'Email support',
    ],
    limits: {
      resumes: 1,
      applications: 3,
    },
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    features: [
      'Unlimited resumes',
      'All premium templates',
      'Unlimited job applications',
      'AI-powered resume tailoring',
      'Cover letter generation',
      'Priority support',
    ],
    limits: {
      resumes: Infinity,
      applications: Infinity,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 29.99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Advanced analytics',
      'Custom branding',
      'Dedicated account manager',
      'API access',
    ],
    limits: {
      resumes: Infinity,
      applications: Infinity,
    },
  },
} as const

export type PlanType = keyof typeof SUBSCRIPTION_PLANS

// Helper function to check if user has active subscription
export function hasActiveSubscription(
  subscriptionStatus: string | null | undefined
): boolean {
  return subscriptionStatus === 'active' || subscriptionStatus === 'trialing'
}

// Helper function to get user's current plan
export function getUserPlan(
  stripePriceId: string | null | undefined,
  subscriptionStatus: string | null | undefined
): PlanType {
  if (!hasActiveSubscription(subscriptionStatus)) {
    return 'free'
  }

  const plan = Object.entries(SUBSCRIPTION_PLANS).find(
    ([_, config]) => config.priceId === stripePriceId
  )

  return (plan?.[0] as PlanType) || 'free'
}

// Helper function to check if user can perform action
export function canPerformAction(
  action: 'createResume' | 'createApplication',
  userPlan: PlanType,
  currentCount: number
): boolean {
  const limits = SUBSCRIPTION_PLANS[userPlan].limits

  switch (action) {
    case 'createResume':
      return currentCount < limits.resumes
    case 'createApplication':
      return currentCount < limits.applications
    default:
      return false
  }
}
