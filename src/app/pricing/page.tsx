'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Check, Zap, Star, Crown } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const planIcons = {
  free: Zap,
  pro: Star,
  enterprise: Crown,
}

export default function PricingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (planType: string, priceId: string) => {
    if (planType === 'free') {
      router.push('/dashboard')
      return
    }

    setIsLoading(planType)

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, planType }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        alert('Failed to create checkout session. Please try again.')
        setIsLoading(null)
        return
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred. Please try again.')
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">ResumeTailor</h1>
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Start for free, upgrade when you need more. All plans include our core features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => {
            const Icon = planIcons[key as keyof typeof planIcons]
            const isPro = key === 'pro'

            return (
              <Card
                key={key}
                className={`relative ${
                  isPro
                    ? 'border-2 border-primary shadow-xl scale-105'
                    : 'border border-slate-200'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className={`inline-flex p-3 rounded-lg mb-4 mx-auto ${
                    key === 'free' ? 'bg-slate-100' :
                    key === 'pro' ? 'bg-primary/10' :
                    'bg-purple-100'
                  }`}>
                    <Icon className={`h-8 w-8 ${
                      key === 'free' ? 'text-slate-600' :
                      key === 'pro' ? 'text-primary' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-slate-600"> /month</span>
                    )}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isPro ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(key, plan.priceId)}
                    disabled={isLoading === key}
                  >
                    {isLoading === key
                      ? 'Loading...'
                      : key === 'free'
                      ? 'Get Started Free'
                      : 'Subscribe'}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h4 className="font-semibold text-lg mb-2">Can I cancel anytime?</h4>
              <p className="text-slate-600">
                Yes! You can cancel your subscription at any time. You'll continue to have access
                until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h4 className="font-semibold text-lg mb-2">What payment methods do you accept?</h4>
              <p className="text-slate-600">
                We accept all major credit cards through our secure payment processor, Stripe.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h4 className="font-semibold text-lg mb-2">Can I upgrade or downgrade my plan?</h4>
              <p className="text-slate-600">
                Yes! You can change your plan at any time from your account settings. Changes take
                effect immediately.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
