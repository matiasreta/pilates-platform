// Supabase Edge Function for Stripe Webhooks
// This runs directly on Supabase infrastructure for minimal latency

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0"
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno"

// Initialize Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
})

// Initialize Supabase Admin Client
const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

serve(async (req: Request) => {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 })
    }

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()

    if (!signature) {
        return new Response('Missing stripe-signature header', { status: 400 })
    }

    let event: Stripe.Event

    try {
        // Verify webhook signature
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
    } catch (err: any) {
        console.error('⚠️ Webhook signature verification failed:', err.message)
        return new Response(JSON.stringify({ error: 'Webhook signature verification failed' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }

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

                // Handle Subscription
                const subscriptionId = session.subscription as string
                const customerId = session.customer as string

                // Get full subscription object with expanded data
                const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
                    expand: ['latest_invoice', 'customer']
                })

                const subData = subscription as any
                console.log('Full Subscription Object:', JSON.stringify({
                    id: subData.id,
                    status: subData.status,
                    current_period_start: subData.current_period_start,
                    current_period_end: subData.current_period_end,
                }, null, 2))

                // Try to get the period end from multiple possible locations
                let currentPeriodEnd = null

                if (subData.current_period_end) {
                    currentPeriodEnd = new Date(subData.current_period_end * 1000).toISOString()
                    console.log('✅ Found current_period_end directly:', currentPeriodEnd)
                } else if (subData.billing_cycle_anchor) {
                    const anchorDate = new Date(subData.billing_cycle_anchor * 1000)
                    anchorDate.setMonth(anchorDate.getMonth() + 1)
                    currentPeriodEnd = anchorDate.toISOString()
                    console.log('⚠️ Calculated current_period_end from billing_cycle_anchor:', currentPeriodEnd)
                } else if (subData.created) {
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

                const subData = subscription as any
                const currentPeriodEnd = subData.current_period_end
                    ? new Date(subData.current_period_end * 1000).toISOString()
                    : null

                console.log('📅 Updating subscription with period end:', currentPeriodEnd)

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

                // Fetch latest data directly from Stripe
                const latestSubscription = await stripe.subscriptions.retrieve(subscription.id)
                const rawSub = latestSubscription as any

                let currentPeriodEndVal = rawSub.current_period_end
                if (!currentPeriodEndVal && rawSub.items?.data?.[0]?.current_period_end) {
                    currentPeriodEndVal = rawSub.items.data[0].current_period_end
                }

                const currentPeriodEnd = currentPeriodEndVal
                    ? new Date(currentPeriodEndVal * 1000).toISOString()
                    : null

                const explicitCancel = rawSub.cancel_at_period_end === true
                const scheduledCancel = rawSub.cancel_at !== null && rawSub.cancel_at !== undefined
                const cancelAtPeriodEnd = explicitCancel || scheduledCancel

                console.log('🔄 Subscription Update:', {
                    id: latestSubscription.id,
                    current_period_end: currentPeriodEnd,
                    is_canceling: cancelAtPeriodEnd,
                })

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
                const subscriptionId = (invoice as any).subscription
                const subId = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId?.id

                if (!subId) break

                const { error } = await supabase
                    .from('subscriptions')
                    .update({
                        status: 'past_due',
                    })
                    .eq('stripe_subscription_id', subId)

                if (error) {
                    console.error('Error marking subscription as past_due:', error)
                } else {
                    console.log('⚠️ Payment failed for subscription:', subId)
                }
                break
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice
                const subscriptionId = (invoice as any).subscription
                const subId = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId?.id

                if (!subId) break

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

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (error: any) {
        console.error('Error processing webhook:', error)
        return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
})
