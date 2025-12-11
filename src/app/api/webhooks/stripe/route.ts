import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-admin'
import { createAdminClient } from '@/lib/supabase/admin'
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

    const supabase = createAdminClient()

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const userId = session.metadata?.user_id

                if (!userId) {
                    console.error('No user_id in session metadata')
                    break
                }

                if (session.mode === 'payment') {
                    // Handle One-Time Payment
                    const priceId = session.metadata?.price_id

                    if (priceId) {
                        const { error } = await supabase.from('one_time_purchases').insert({
                            user_id: userId,
                            stripe_price_id: priceId,
                            stripe_checkout_session_id: session.id,
                            status: 'completed'
                        })

                        if (error) {
                            console.error('Error creating one-time purchase:', error)
                        } else {
                            console.log('✅ One-time purchase recorded for user:', userId, 'Price:', priceId)
                        }
                    } else {
                        console.error('No price_id found in metadata for one-time payment')
                    }

                    break
                }

                // Handle Subscription (Existing Logic)
                const subscriptionId = session.subscription as string
                const customerId = session.customer as string

                // Get full subscription object with expanded data
                const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
                    expand: ['latest_invoice', 'customer']
                })

                // Debug log - let's see EVERYTHING
                const subData = subscription as any
                console.log('Full Subscription Object:', JSON.stringify({
                    id: subData.id,
                    status: subData.status,
                    current_period_start: subData.current_period_start,
                    current_period_end: subData.current_period_end,
                    billing_cycle_anchor: subData.billing_cycle_anchor,
                    trial_end: subData.trial_end,
                    keys: Object.keys(subData).filter(k => k.includes('period') || k.includes('end') || k.includes('start'))
                }, null, 2))

                // Try to get the period end from multiple possible locations
                let currentPeriodEnd = null

                // Try direct property
                if (subData.current_period_end) {
                    currentPeriodEnd = new Date(subData.current_period_end * 1000).toISOString()
                    console.log('✅ Found current_period_end directly:', currentPeriodEnd)
                }
                // Try from billing_cycle_anchor + 1 month (fallback)
                else if (subData.billing_cycle_anchor) {
                    const anchorDate = new Date(subData.billing_cycle_anchor * 1000)
                    anchorDate.setMonth(anchorDate.getMonth() + 1)
                    currentPeriodEnd = anchorDate.toISOString()
                    console.log('⚠️ Calculated current_period_end from billing_cycle_anchor:', currentPeriodEnd)
                }
                // Try from created + 1 month (last resort)
                else if (subData.created) {
                    const createdDate = new Date(subData.created * 1000)
                    createdDate.setMonth(createdDate.getMonth() + 1)
                    currentPeriodEnd = createdDate.toISOString()
                    console.log('⚠️ Calculated current_period_end from created date:', currentPeriodEnd)
                }

                // Create subscription record in Supabase
                const { error } = await supabase.from('subscriptions').insert({
                    user_id: userId,
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    status: subscription.status,
                    price_id: subscription.items.data[0].price.id,
                    current_period_end: currentPeriodEnd,
                    cancel_at_period_end: subData.cancel_at_period_end || false,
                })

                if (error) {
                    console.error('Error creating subscription:', error)
                } else {
                    console.log('✅ Subscription created for user:', userId)
                }
                break
            }

            case 'customer.subscription.created': {
                const subscription = event.data.object as Stripe.Subscription
                const userId = subscription.metadata?.user_id

                if (!userId) {
                    console.error('No user_id in subscription metadata')
                    break
                }

                // Get current_period_end safely
                const subData = subscription as any
                const currentPeriodEnd = subData.current_period_end
                    ? new Date(subData.current_period_end * 1000).toISOString()
                    : null

                console.log('📅 Updating subscription with period end:', currentPeriodEnd)

                // Update the subscription with current_period_end
                const { error } = await supabase
                    .from('subscriptions')
                    .update({
                        current_period_end: currentPeriodEnd,
                        cancel_at_period_end: subData.cancel_at_period_end || false,
                    })
                    .eq('stripe_subscription_id', subscription.id)

                if (error) {
                    console.error('Error updating subscription period:', error)
                } else {
                    console.log('✅ Subscription period updated for user:', userId)
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

                // To be absolutely sure we have the latest data, let's fetch it directly
                const latestSubscription = await stripe.subscriptions.retrieve(subscription.id)

                // Safe extraction for this specific API version which might be missing root properties
                const rawSub = latestSubscription as any

                // 1. Get current_period_end (fallback to first item if missing at root)
                let currentPeriodEndVal = rawSub.current_period_end
                if (!currentPeriodEndVal && rawSub.items?.data?.[0]?.current_period_end) {
                    currentPeriodEndVal = rawSub.items.data[0].current_period_end
                }

                const currentPeriodEnd = currentPeriodEndVal
                    ? new Date(currentPeriodEndVal * 1000).toISOString()
                    : null

                // 2. Determine cancellation status
                // If cancel_at_period_end is explicitly true, trust it.
                // If cancel_at is set to a future date, it means it IS canceling (at that date).
                const explicitCancel = rawSub.cancel_at_period_end === true
                const scheduledCancel = rawSub.cancel_at !== null && rawSub.cancel_at !== undefined

                // We consider it "cancelled at period end" if either flag is true OR if it's scheduled to cancel
                const cancelAtPeriodEnd = explicitCancel || scheduledCancel

                console.log('🔄 Subscription Update:', {
                    id: latestSubscription.id,
                    current_period_end: currentPeriodEnd,
                    is_canceling: cancelAtPeriodEnd,
                    source: {
                        explicit_flag: explicitCancel,
                        scheduled_cancel: scheduledCancel
                    }
                })

                // Update subscription in Supabase
                const { error } = await supabase
                    .from('subscriptions')
                    .update({
                        status: rawSub.status,
                        current_period_end: currentPeriodEnd,
                        cancel_at_period_end: cancelAtPeriodEnd,
                    })
                    .eq('stripe_subscription_id', latestSubscription.id)

                if (error) {
                    console.error('Error updating subscription:', error)
                } else {
                    console.log('✅ Subscription updated for user:', userId, '- Cancel state:', cancelAtPeriodEnd)
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
