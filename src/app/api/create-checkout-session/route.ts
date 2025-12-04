import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateStripeCustomer, createCheckoutSession } from '@/lib/stripe-admin'

// Price ID from Stripe Dashboard
// TODO: Replace with your actual price ID after creating the product in Stripe
const PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_XXXXXXXXXXXXXXXX'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user profile for email
        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', user.id)
            .single()

        if (!profile?.email) {
            return NextResponse.json({ error: 'User email not found' }, { status: 400 })
        }

        // Check if user already has an active subscription
        const { data: existingSubscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .single()

        if (existingSubscription && existingSubscription.status === 'active') {
            return NextResponse.json(
                { error: 'Ya tienes una suscripción activa' },
                { status: 400 }
            )
        }

        // Get or create Stripe customer
        const customerId = await getOrCreateStripeCustomer(user.id, profile.email)

        // Create checkout session
        const origin = req.headers.get('origin') || 'http://localhost:3000'
        const checkoutUrl = await createCheckoutSession(
            customerId,
            PRICE_ID,
            user.id,
            `${origin}/dashboard?success=true`,
            `${origin}/pricing?canceled=true`
        )

        return NextResponse.json({ url: checkoutUrl })
    } catch (error: any) {
        console.error('Error creating checkout session:', error)
        return NextResponse.json(
            { error: 'Error al crear la sesión de pago' },
            { status: 500 }
        )
    }
}
