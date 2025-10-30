import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/../auth'
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId, planType } = await req.json()

    if (!priceId || !planType) {
      return NextResponse.json(
        { error: 'Missing priceId or planType' },
        { status: 400 }
      )
    }

    // Verify plan exists
    const plan = SUBSCRIPTION_PLANS[planType as keyof typeof SUBSCRIPTION_PLANS]
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true, email: true, name: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let customerId = user.stripeCustomerId

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      })

      // Save customer ID to database
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customer.id },
      })

      customerId = customer.id
    }

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/pricing`,
      metadata: {
        userId: session.user.id,
        planType,
      },
    })

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
