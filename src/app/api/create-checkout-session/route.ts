import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateStripeCustomer, createCheckoutSession } from '@/lib/stripe-admin'

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

        // Get request body
        const body = await req.json().catch(() => ({}))
        const { priceId } = body

        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
        }

        // 1. Look up the product in the database
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('stripe_price_id', priceId)
            .single()

        if (productError || !product) {
            console.error('Error fetching product:', productError)
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // 2. Determine mode based on product type
        // 'subscription' -> mode: 'subscription'
        // 'payment' (or anything else) -> mode: 'payment'
        const mode = product.payment_type === 'subscription' ? 'subscription' : 'payment'

        // 3. Check for existing access
        if (mode === 'payment') {
            // Check if user already purchased this specific product
            const { data: existingPurchase } = await supabase
                .from('one_time_purchases')
                .select('*')
                .eq('user_id', user.id)
                .eq('stripe_price_id', priceId)
                .single()

            if (existingPurchase) {
                return NextResponse.json(
                    { error: 'Ya compraste este contenido' },
                    { status: 400 }
                )
            }
        } else {
            // Check if user already has an active subscription for this specific product
            // Note: We now check for THIS specific price_id or product linkage, 
            // but the subscriptions table stores stripe_price_id from the webinar logic.
            const { data: existingSubscription } = await supabase
                .from('subscriptions')
                .select('status')
                .eq('user_id', user.id)
                .eq('price_id', priceId) // Ensure we check for this specific plan
                .eq('status', 'active')
                .single()

            if (existingSubscription) {
                return NextResponse.json(
                    { error: 'Ya tienes este plan activo' },
                    { status: 400 }
                )
            }
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

        // Get or create Stripe customer
        const customerId = await getOrCreateStripeCustomer(user.id, profile.email)

        // Create checkout session
        const origin = req.headers.get('origin') || 'http://localhost:3000'
        const checkoutUrl = await createCheckoutSession(
            customerId,
            priceId,
            user.id,
            `${origin}/dashboard?success=true`,
            `${origin}/?canceled=true`,
            mode
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
