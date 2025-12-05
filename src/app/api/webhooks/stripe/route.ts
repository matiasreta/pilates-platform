import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-admin'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

// Disable body parsing, need raw body for signature verification
export const runtime = 'nodejs'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        console.error('⚠️  Webhook signature verification failed:', err.message)
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    const supabase = await createClient()

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session

                // Get subscription details
                const subscriptionId = session.subscription as string
                const customerId = session.customer as string
                const userId = session.metadata?.user_id

                if (!userId) {
                    console.error('No user_id in session metadata')
                    break
                }

                // Get full subscription object
                const subscription = await stripe.subscriptions.retrieve(subscriptionId)

                // Get current_period_end safely
                const periodEnd = (subscription as any).current_period_end
                const currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000).toISOString() : null

                // Create subscription record in Supabase
                const { error } = await supabase.from('subscriptions').insert({
                    user_id: userId,
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    status: subscription.status,
                    price_id: subscription.items.data[0].price.id,
                    current_period_end: currentPeriodEnd,
                })

                if (error) {
                    console.error('Error creating subscription:', error)
                } else {
                    console.log('✅ Subscription created for user:', userId)
                }
                break
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription
                const userId = subscription.metadata?.user_id

                if (!userId) {
                    console.error('No user_id in subscription metadata')
                    break
                }

                // Get current_period_end safely
                const periodEnd = (subscription as any).current_period_end
                const currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000).toISOString() : null

                // Update subscription in Supabase
                const { error } = await supabase
                    .from('subscriptions')
                    .update({
                        status: subscription.status,
                        current_period_end: currentPeriodEnd,
                    })
                    .eq('stripe_subscription_id', subscription.id)

                if (error) {
                    console.error('Error updating subscription:', error)
                } else {
                    console.log('✅ Subscription updated for user:', userId, '- Status:', subscription.status)
                }
                break
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription
                const userId = subscription.metadata?.user_id

                if (!userId) {
                    console.error('No user_id in subscription metadata')
                    break
                }

                // Mark subscription as canceled
                const { error } = await supabase
                    .from('subscriptions')
                    .update({
                        status: 'canceled',
                    })
                    .eq('stripe_subscription_id', subscription.id)

                if (error) {
                    console.error('Error canceling subscription:', error)
                } else {
                    console.log('✅ Subscription canceled for user:', userId)
                }
                break
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice
                // Type assertion to access subscription property
                const subscriptionId = (invoice as any).subscription
                const subId = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId?.id

                if (!subId) break

                // Mark subscription as past_due
                const { error } = await supabase
                    .from('subscriptions')
                    .update({
                        status: 'past_due',
                    })
                    .eq('stripe_subscription_id', subId)

                if (error) {
                    console.error('Error marking subscription as past_due:', error)
                } else {
                    console.log('⚠️  Payment failed for subscription:', subId)
                }
                break
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice
                // Type assertion to access subscription property
                const subscriptionId = (invoice as any).subscription
                const subId = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId?.id

                if (!subId) break

                // Update subscription to active
                const { error } = await supabase
                    .from('subscriptions')
                    .update({
                        status: 'active',
                    })
                    .eq('stripe_subscription_id', subId)

                if (error) {
                    console.error('Error updating subscription to active:', error)
                } else {
                    console.log('✅ Payment succeeded for subscription:', subId)
                }
                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        console.error('Error processing webhook:', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
