import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCustomerPortalSession } from '@/lib/stripe-admin'

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

        // Get user's subscription to find customer ID
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single()

        if (!subscription?.stripe_customer_id) {
            return NextResponse.json(
                { error: 'No se encontró una suscripción' },
                { status: 400 }
            )
        }

        // Create portal session
        const origin = req.headers.get('origin') || 'http://localhost:3000'
        const portalUrl = await createCustomerPortalSession(
            subscription.stripe_customer_id,
            `${origin}/dashboard`
        )

        return NextResponse.json({ url: portalUrl })
    } catch (error: any) {
        console.error('Error creating portal session:', error)
        return NextResponse.json(
            { error: 'Error al crear la sesión del portal' },
            { status: 500 }
        )
    }
}
